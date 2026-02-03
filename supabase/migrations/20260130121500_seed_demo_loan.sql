-- Seed a persisted demo loan for local E2E verification
-- Run this in Supabase SQL editor or apply via your migrations workflow.

-- Optional: create a demo profile for the current test user (only if you need a decided_by FK for manual inserts)
-- NOTE: set user_id to a real auth.users.id if you want the profile to be associated with an existing user.

INSERT INTO public.profiles (id, user_id, full_name, designation, created_at, updated_at)
SELECT
  'b3b6f9d6-7c9a-4b06-9b14-0a9d5f7e2c11'::uuid,
  NULL::uuid,
  'Demo Analyst',
  'Analyst',
  now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'b3b6f9d6-7c9a-4b06-9b14-0a9d5f7e2c11'::uuid);

-- Insert a deterministic loan (use the application_id when navigating in the UI)
INSERT INTO public.loans (id, application_id, customer_name, loan_amount, loan_type, status, team, created_at, updated_at)
SELECT
  '18f4cf5a-204f-400b-9465-a869e65eedab'::uuid,
  'T2-DEMO-0001',
  'Test 2',
  2000000::numeric,
  'Term Loan'::public.loan_type,
  'under-review'::public.loan_status,
  'Retail',
  now(), now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.loans WHERE id = '18f4cf5a-204f-400b-9465-a869e65eedab'::uuid OR application_id = 'T2-DEMO-0001'
);

-- Confirm inserted rows
SELECT id, application_id, customer_name, loan_amount, loan_type, status, created_at
FROM public.loans
WHERE application_id = 'T2-DEMO-0001' OR id = '18f4cf5a-204f-400b-9465-a869e65eedab';

-- Cleanup helper (run manually when finished):
-- DELETE FROM public.loan_decisions WHERE loan_id = '18f4cf5a-204f-400b-9465-a869e65eedab'::uuid;
-- DELETE FROM public.loans WHERE id = '18f4cf5a-204f-400b-9465-a869e65eedab'::uuid;
-- DELETE FROM public.profiles WHERE id = 'b3b6f9d6-7c9a-4b06-9b14-0a9d5f7e2c11'::uuid;