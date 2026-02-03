import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Loan {
  id: string;
  application_id: string;
  customer_name: string;
  loan_amount: number;
  loan_type: 'WCBL' | 'Term Loan' | 'LAP' | 'OD' | 'CC';
  status: 'under-review' | 'approved' | 'rejected' | 'processing' | 'disbursed';
  assigned_analyst_id: string | null;
  anchor_name: string | null;
  team: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    full_name: string;
  } | null;
}

export interface LoanDecision {
  id: string;
  loan_id: string;
  decision: 'approved' | 'rejected';
  comments: string | null;
  decided_by: string;
  decided_at: string;
}

export function useLoans() {
  return useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loans')
        .select(`
          *,
          profiles:assigned_analyst_id (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Loan[];
    },
  });
}

export function useLoan(id: string | undefined) {
  return useQuery({
    queryKey: ['loan', id],
    queryFn: async () => {
      if (!id) return null;

      // Accept either the primary `id` (uuid) or the human-facing `application_id`.
      // `.or` lets us search both columns and still use `maybeSingle` safely.
      const selector = `*, profiles:assigned_analyst_id ( id, full_name )`;
      const { data, error } = await supabase
        .from('loans')
        .select(selector)
        .or(`id.eq.${id},application_id.eq.${id}`)
        .maybeSingle();

      if (error) throw error;
      return data as Loan | null;
    },
    enabled: !!id,
  });
}

export function useLoanDecision(loanId: string | undefined) {
  return useQuery({
    queryKey: ['loan-decision', loanId],
    queryFn: async () => {
      if (!loanId) return null;
      
      const { data, error } = await supabase
        .from('loan_decisions')
        .select('*')
        .eq('loan_id', loanId)
        .order('decided_at', { ascending: false })
        .maybeSingle();

      if (error) throw error;
      return data as LoanDecision | null;
    },
    enabled: !!loanId,
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loan: Omit<Loan, 'id' | 'created_at' | 'updated_at' | 'profiles'>) => {
      const { data, error } = await supabase
        .from('loans')
        .insert(loan)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success('Loan application created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create loan application', {
        description: error.message,
      });
    },
  });
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Loan> & { id: string }) => {
      // Defensive: require an identifier
      if (!id) throw new Error('Missing loan identifier for update');

      // Support either PK `id` (uuid) or `application_id` (human id in routes)
      // Use `.or` so the filter is explicit; do NOT rely on an absent filter.
      const { data, error } = await supabase
        .from('loans')
        .update(updates)
        .or(`id.eq.${id},application_id.eq.${id}`)
        .select();

      if (error) throw error;

      // Supabase may return an array if multiple rows were updated — guard that.
      if (Array.isArray(data)) {
        if (data.length === 0) {
          throw new Error('No matching loan found to update');
        }
        if (data.length > 1) {
          console.error('update returned multiple rows for identifier:', id, data);
          throw new Error('Update matched multiple rows; expected a single loan');
        }
        return data[0];
      }

      // Defensive: if supabase returned no row (null/undefined), surface an error so callers know the update failed.
      if (!data || (typeof data === 'object' && !('id' in (data as any)) && !('application_id' in (data as any)))) {
        console.error('useUpdateLoan: unexpected update result', { id, data });
        throw new Error('Update did not return the updated loan');
      }

      return data;
    },
    onSuccess: (data) => {
      // Guard the invalidation so we never attempt to access properties on `null`.
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      if (!data) return;
      const key = (data as any).id || (data as any).application_id;
      if (key) queryClient.invalidateQueries({ queryKey: ['loan', key] });
    },
    onError: (error) => {
      console.error('useUpdateLoan error:', error);
      toast.error('Failed to update loan', {
        description: error?.message || String(error),
      });
    },
  });
}

export function useCreateLoanDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (decision: Omit<LoanDecision, 'id' | 'decided_at'>) => {
      const { data, error } = await supabase
        .from('loan_decisions')
        .insert(decision)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['loan-decision', data.loan_id] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
    onError: (error) => {
      toast.error('Failed to save decision', {
        description: error.message,
      });
    },
  });
}

// Atomic RPC-backed mutation: inserts a loan_decision and updates loan.status in a single transaction.
export function useCreateDecisionRpc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (decision: Omit<LoanDecision, 'id' | 'decided_at'> & { loan_id: string }) => {
      // Try RPC first (preferred, atomic)
      const tryRpc = async () => {
        const { data, error } = await (supabase as any).rpc('create_loan_decision_and_update_status', {
          p_loan_id: decision.loan_id,
          p_decision: decision.decision,
          p_comments: decision.comments,
          p_decided_by: decision.decided_by,
        }).single();

        if (error) throw error;
        return data as { loan: Loan; decision: LoanDecision };
      };

      // Legacy two-step fallback (used when RPC isn't deployed or allowed)
      const fallbackTwoStep = async () => {
        // Insert decision
        const { data: d, error: derr } = await supabase
          .from('loan_decisions')
          .insert({
            loan_id: decision.loan_id,
            decision: decision.decision,
            comments: decision.comments,
            decided_by: decision.decided_by,
          })
          .select()
          .maybeSingle();

        if (derr) throw derr;
        if (!d) throw new Error('Failed to insert loan_decision (fallback)');

        // Update loan status
        const { data: l, error: lerr } = await supabase
          .from('loans')
          .update({ status: decision.decision })
          .eq('id', decision.loan_id)
          .select()
          .maybeSingle();

        if (lerr) throw lerr;
        if (!l) throw new Error('No matching loan found to update (fallback)');

        return { loan: l as Loan, decision: d as LoanDecision };
      };

      try {
        return await tryRpc();
      } catch (err: any) {
        // Detect function-not-found (Postgres 42883) or Supabase schema cache message and fallback
        const msg = (err?.message || '') as string;
        const isMissingFunction = msg.includes('Could not find the function') || (err?.code === '42883');
        if (isMissingFunction) {
          // Surface a concise toast then attempt fallback so the UI remains usable.
          console.warn('RPC create_loan_decision_and_update_status missing; falling back to two-step flow.');
          toast.error('RPC not available — falling back to two-step update');
          return await fallbackTwoStep();
        }
        throw err;
      }
    },
    onSuccess: (data) => {
      const loanId = (data as any)?.loan?.id || (data as any)?.loan?.application_id;
      const decisionLoanId = (data as any)?.decision?.loan_id;
      if (decisionLoanId) queryClient.invalidateQueries({ queryKey: ['loan-decision', decisionLoanId] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      if (loanId) queryClient.invalidateQueries({ queryKey: ['loan', loanId] });
    },
    onError: (error) => {
      toast.error('Failed to save decision (atomic)', {
        description: error?.message || String(error),
      });
    },
  });
}

// -----------------------------
// Bank ingestion (client-side CSV/XLSX) - MVP
// - parse CSV/XLSX in the browser
// - upload original file to Storage
// - insert documents + bank_statements + bank_transactions
// - enqueue ingestion_jobs via the existing RPC
// -----------------------------
import { parseBankFile, ParsedStatement } from '@/lib/bankParser';

export function useBankStatements(loanId: string | undefined) {
  return useQuery({
    queryKey: ['bank-statements', loanId],
    queryFn: async () => {
      if (!loanId) return [];
      const { data, error } = await (supabase as any)
        .from('bank_statements')
        .select('*, bank_transactions(*)')
        .eq('loan_id', loanId)
        .order('inserted_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!loanId,
  });
}

export function useUploadAndParseBankStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, loanId }: { file: File; loanId: string }) => {
      // 1) upload file to storage
      const path = `documents/${Date.now()}_${file.name}`;
      const { data: storageRes, error: upErr } = await supabase.storage.from('documents').upload(path, file, { upsert: false });
      if (upErr) throw upErr;

      // 2) register document + enqueue ingestion (RPC)
      const { data: rpcRes, error: rpcErr } = await (supabase as any).rpc('rpc_create_document_and_enqueue_ingestion', {
        p_loan_id: loanId,
        p_file_name: file.name,
        p_storage_path: path,
        p_file_type: file.type || 'application/octet-stream',
        p_file_size: file.size,
        p_provider: 'client-sheetjs',
      }).single();

      if (rpcErr) throw rpcErr;
      const documentId = rpcRes?.document_id as string | undefined;

      // 3) attempt client-side parse (CSV/XLSX only)
      const parsed: ParsedStatement = await parseBankFile(file);

      // 4) persist parsed statement + transactions (best-effort)
      const { data: stmt, error: stmtErr } = await (supabase as any)
        .from('bank_statements')
        .insert({
          loan_id: loanId,
          document_id: documentId,
          account_mask: parsed.account_mask,
          account_number: parsed.account_number,
          statement_from: parsed.statement_from,
          statement_to: parsed.statement_to,
          opening_balance: parsed.opening_balance,
          closing_balance: parsed.closing_balance,
          meta: parsed.meta || {},
        })
        .select()
        .maybeSingle();

      if (stmtErr) throw stmtErr;
      const bankStatementId = stmt?.id;

      if (parsed.transactions && parsed.transactions.length > 0 && bankStatementId) {
        // chunk inserts at 500 rows to avoid payload limits
        const chunkSize = 500;
        for (let i = 0; i < parsed.transactions.length; i += chunkSize) {
          const chunk = parsed.transactions.slice(i, i + chunkSize).map((t) => ({
            bank_statement_id: bankStatementId,
            occurred_at: t.occurred_at,
            amount: t.amount,
            direction: t.direction,
            counterparty: t.counterparty,
            narration: t.narration,
            raw: t.raw || {},
          }));
          const { error: txErr } = await (supabase as any).from('bank_transactions').insert(chunk);
          if (txErr) throw txErr;
        }
      }

      // 5) mark ingestion_jobs done (best-effort update so UI shows parsed data immediately)
      try {
        await (supabase as any).from('ingestion_jobs').update({ status: 'done', progress: 100, finished_at: new Date().toISOString(), meta: { client_parsed: true } }).eq('document_id', documentId);
      } catch (e) {
        // non-blocking
        console.warn('Failed to update ingestion_jobs status (non-blocking):', e);
      }

      queryClient.invalidateQueries({ queryKey: ['bank-statements', loanId] });
      queryClient.invalidateQueries({ queryKey: ['loan', loanId] });

      return { documentId, bankStatementId };
    },
    onError: (error) => {
      console.error('uploadAndParseBankStatement error:', error);
      toast.error('Failed to ingest bank statement', { description: String(error) });
    },
    onSuccess: (_data) => {
      toast.success('Bank statement ingested');
    },
  });
}
