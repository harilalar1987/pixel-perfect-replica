-- Migration: create documents, ingestion_jobs and parsed-data tables (bank/gst/bureau)
-- Timestamp: 2026-02-02 10:30 UTC
-- Purpose: store uploaded files, track ingestion jobs, and persist normalized parsed outputs
-- NOTE: after applying, run the verification queries below and adjust RLS policies to match your project's ownership columns.

-- enable uuid generator (if not present)
create extension if not exists "pgcrypto";

-- 1) documents: original uploaded files (storage path + provenance)
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES public.loans(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  file_type text,
  file_size bigint,
  uploaded_by uuid DEFAULT auth.uid(),
  meta jsonb DEFAULT '{}'::jsonb,
  inserted_at timestamptz DEFAULT now()
);

-- 2) ingestion_jobs: queue + status for parser workers
CREATE TABLE IF NOT EXISTS public.ingestion_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE,
  provider text NOT NULL, -- e.g. 'client-sheetjs' | 'edge-worker-camelot' | 'ocr-docai'
  status text NOT NULL DEFAULT 'queued', -- queued | processing | done | failed
  progress numeric DEFAULT 0, -- 0..100
  error text,
  meta jsonb DEFAULT '{}'::jsonb, -- parser warnings, confidence, row-mappings
  started_at timestamptz,
  finished_at timestamptz,
  inserted_at timestamptz DEFAULT now()
);

-- 3) bank_statements + bank_transactions (normalized canonical model)
CREATE TABLE IF NOT EXISTS public.bank_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES public.loans(id) ON DELETE CASCADE,
  document_id uuid REFERENCES public.documents(id),
  account_mask text, -- e.g. "XXXX1234"
  account_number text,
  statement_from date,
  statement_to date,
  opening_balance numeric,
  closing_balance numeric,
  currency text DEFAULT 'INR',
  meta jsonb DEFAULT '{}'::jsonb,
  inserted_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bank_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_statement_id uuid REFERENCES public.bank_statements(id) ON DELETE CASCADE,
  occurred_at date NOT NULL,
  amount numeric NOT NULL,
  direction text CHECK (direction IN ('credit','debit')) NOT NULL,
  counterparty text,
  narration text,
  raw jsonb DEFAULT '{}'::jsonb,
  inserted_at timestamptz DEFAULT now()
);

-- 4) GST: entities + returns (basic MVP schema)
CREATE TABLE IF NOT EXISTS public.gst_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES public.loans(id) ON DELETE CASCADE,
  document_id uuid REFERENCES public.documents(id),
  gstin text,
  legal_name text,
  period_from date,
  period_to date,
  meta jsonb DEFAULT '{}'::jsonb,
  inserted_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gst_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gst_entity_id uuid REFERENCES public.gst_entities(id) ON DELETE CASCADE,
  period text, -- e.g. '2025-04'
  gstr3b_revenue numeric,
  gstr3b_itc numeric,
  filing_status text,
  raw jsonb DEFAULT '{}'::jsonb,
  inserted_at timestamptz DEFAULT now()
);

-- 5) Bureau (canonical record for parsed bureau artifacts)
CREATE TABLE IF NOT EXISTS public.bureau_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES public.loans(id) ON DELETE CASCADE,
  document_id uuid REFERENCES public.documents(id),
  subject_type text, -- 'individual' | 'company'
  subject_identifier text, -- PAN / CIN / name
  raw jsonb DEFAULT '{}'::jsonb,
  inserted_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS documents_loan_idx ON public.documents(loan_id);
CREATE INDEX IF NOT EXISTS ingestion_jobs_doc_idx ON public.ingestion_jobs(document_id, status);
CREATE INDEX IF NOT EXISTS bank_statements_loan_idx ON public.bank_statements(loan_id);
CREATE INDEX IF NOT EXISTS bank_tx_stmt_idx ON public.bank_transactions(bank_statement_id, occurred_at);
CREATE INDEX IF NOT EXISTS gst_entities_loan_idx ON public.gst_entities(loan_id);
CREATE INDEX IF NOT EXISTS bureau_records_loan_idx ON public.bureau_records(loan_id);

-- RLS: enable row level security and provide conservative starter policies
-- IMPORTANT: review & tighten these policies to your product's ownership model (e.g. loans.created_by / assigned_analyst_id)

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY documents_insert_if_authenticated ON public.documents
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY documents_select_owner ON public.documents
  FOR SELECT USING (uploaded_by = auth.uid());

CREATE POLICY documents_update_owner ON public.documents
  FOR UPDATE USING (uploaded_by = auth.uid()) WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY documents_delete_owner ON public.documents
  FOR DELETE USING (uploaded_by = auth.uid());

ALTER TABLE public.ingestion_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY ingestion_jobs_insert_if_authenticated ON public.ingestion_jobs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- allow workers (service role) to update job status via service key (service role bypasses RLS)
CREATE POLICY ingestion_jobs_select_owner ON public.ingestion_jobs
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.documents d WHERE d.id = public.ingestion_jobs.document_id AND d.uploaded_by = auth.uid()));

-- bank_statements/transactions/gst_entities/bureau_records: restrict to uploaded_by via documents join
ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;
CREATE POLICY bank_statements_select_owner ON public.bank_statements
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.documents d WHERE d.id = public.bank_statements.document_id AND d.uploaded_by = auth.uid()));

ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY bank_transactions_select_owner ON public.bank_transactions
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.bank_statements bs JOIN public.documents d ON d.id = bs.document_id WHERE bs.id = public.bank_transactions.bank_statement_id AND d.uploaded_by = auth.uid()));

ALTER TABLE public.gst_entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY gst_entities_select_owner ON public.gst_entities
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.documents d WHERE d.id = public.gst_entities.document_id AND d.uploaded_by = auth.uid()));

ALTER TABLE public.bureau_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY bureau_records_select_owner ON public.bureau_records
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.documents d WHERE d.id = public.bureau_records.document_id AND d.uploaded_by = auth.uid()));

-- NOTE: the above policies assume the client sets uploaded_by = auth.uid() on insert (or the DB default is used).
-- If your application requires analysts or other users to view documents created by others, replace the USING clauses
-- with checks against your loans table (e.g. loans.created_by = auth.uid() OR loans.assigned_analyst_id = auth.uid()).

-- 6) Convenience RPC: insert document + enqueue ingestion in one transaction (ideal for client usage)
CREATE OR REPLACE FUNCTION public.rpc_create_document_and_enqueue_ingestion(
  p_loan_id uuid,
  p_file_name text,
  p_storage_path text,
  p_file_type text,
  p_file_size bigint,
  p_provider text
) RETURNS TABLE(document_id uuid, job_id uuid) LANGUAGE plpgsql AS $$
DECLARE
  v_doc_id uuid;
  v_job_id uuid;
BEGIN
  INSERT INTO public.documents(loan_id, file_name, storage_path, file_type, file_size)
    VALUES (p_loan_id, p_file_name, p_storage_path, p_file_type, p_file_size)
    RETURNING id INTO v_doc_id;

  INSERT INTO public.ingestion_jobs(document_id, provider)
    VALUES (v_doc_id, p_provider)
    RETURNING id INTO v_job_id;

  RETURN QUERY SELECT v_doc_id, v_job_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.rpc_create_document_and_enqueue_ingestion(uuid,text,text,text,bigint,text) TO authenticated;

-- 7) Safety: quick rollback helper (for dev only)
-- To rollback (dev):
-- DROP FUNCTION IF EXISTS public.rpc_create_document_and_enqueue_ingestion(uuid,text,text,text,bigint,text);
-- DROP TABLE IF EXISTS public.bank_transactions, public.bank_statements, public.ingestion_jobs, public.documents, public.gst_returns, public.gst_entities, public.bureau_records CASCADE;

-- End of migration
