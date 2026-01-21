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
      
      const { data, error } = await supabase
        .from('loans')
        .select(`
          *,
          profiles:assigned_analyst_id (
            id,
            full_name
          )
        `)
        .eq('id', id)
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
      const { data, error } = await supabase
        .from('loans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loan', data.id] });
    },
    onError: (error) => {
      toast.error('Failed to update loan', {
        description: error.message,
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
