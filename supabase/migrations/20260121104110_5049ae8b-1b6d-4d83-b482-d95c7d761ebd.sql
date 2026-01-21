
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert loans" ON public.loans;
DROP POLICY IF EXISTS "Authenticated users can update loans" ON public.loans;
DROP POLICY IF EXISTS "Authenticated users can insert decisions" ON public.loan_decisions;

-- Create more restrictive policies for loans
-- Analysts can insert loans they are assigned to, or unassigned loans
CREATE POLICY "Analysts can insert loans"
  ON public.loans FOR INSERT
  TO authenticated
  WITH CHECK (
    assigned_analyst_id IS NULL OR
    assigned_analyst_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Analysts can update loans they are assigned to
CREATE POLICY "Analysts can update their assigned loans"
  ON public.loans FOR UPDATE
  TO authenticated
  USING (
    assigned_analyst_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Users can only insert decisions for their own decisions
CREATE POLICY "Users can insert their own decisions"
  ON public.loan_decisions FOR INSERT
  TO authenticated
  WITH CHECK (
    decided_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );
