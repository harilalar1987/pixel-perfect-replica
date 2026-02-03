-- Atomic RPC: insert a loan_decision and update loan.status in a single transaction
-- Returns the updated loan and the created decision as a single row.

CREATE OR REPLACE FUNCTION public.create_loan_decision_and_update_status(
  p_loan_id uuid,
  p_decision text,
  p_comments text,
  p_decided_by uuid
)
RETURNS TABLE(loan public.loans, decision public.loan_decisions)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  l public.loans%ROWTYPE;
  d public.loan_decisions%ROWTYPE;
  _ok boolean;
BEGIN
  -- Ensure the caller is the same user referenced by the profiles.id passed in
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = p_decided_by AND user_id = auth.uid()) INTO _ok;
  IF NOT _ok THEN
    RAISE EXCEPTION 'decided_by does not match the current authenticated user';
  END IF;

  -- Insert decision (will fail FK/RLS if loan doesn't exist or caller not allowed)
  INSERT INTO public.loan_decisions (loan_id, decision, comments, decided_by)
  VALUES (p_loan_id, p_decision, p_comments, p_decided_by)
  RETURNING * INTO d;

  -- Update loan status atomically
  UPDATE public.loans
  SET status = CASE WHEN p_decision IN ('approved', 'rejected') THEN p_decision::public.loan_status ELSE status END
  WHERE id = p_loan_id
  RETURNING * INTO l;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No matching loan found to update';
  END IF;

  -- Return both rows so the client can invalidate caches correctly
  RETURN QUERY SELECT l, d;
END;
$$;

-- Grant execute to authenticated users (keeps RLS for table access but allows calling the RPC)
GRANT EXECUTE ON FUNCTION public.create_loan_decision_and_update_status(uuid, text, text, uuid) TO authenticated;

SELECT proname, pg_get_functiondef(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE proname = 'create_loan_decision_and_update_status';
