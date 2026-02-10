import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type {
  CommercialBureauSummary,
  IndividualBureauSummary,
  AIBureauInsights,
  BureauLoan,
  LoanSummary,
  BureauEnquiry,
  EnquiryMetrics,
  BureauRelationship,
  LoanPaymentDelay,
  BounceAnalysis,
  EMIBounceAnalysis,
} from '@/types/bureau';

export function useBureauRecords(loanId: string | undefined) {
  return useQuery({
    queryKey: ['bureau-records', loanId],
    queryFn: async () => {
      if (!loanId) return [];
      const { data, error } = await (supabase as any)
        .from('bureau_records')
        .select('*')
        .eq('loan_id', loanId)
        .order('inserted_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!loanId,
  });
}

/** Extract structured bureau data from raw JSONB records */
export function useBureauAnalytics(loanId: string | undefined) {
  const { data: records, isLoading } = useBureauRecords(loanId);

  if (!records || records.length === 0) {
    return { data: null, isLoading };
  }

  // Merge all raw JSONB into a single object (each record may be a different subject_type)
  const raw = records.reduce((acc: any, r: any) => {
    const rData = r.raw || {};
    return { ...acc, ...rData };
  }, {});

  // Extract structured data from raw - the raw JSON is expected to follow the bureau report structure
  const commercialSummary: CommercialBureauSummary | null = raw.commercialSummary || raw.commercial_summary || null;
  const individualSummary: IndividualBureauSummary | null = raw.individualSummary || raw.individual_summary || null;
  const aiInsights: AIBureauInsights | null = raw.aiInsights || raw.ai_insights || null;
  const commercialLoans: BureauLoan[] = raw.commercialLoans || raw.commercial_loans || [];
  const individualLoans: BureauLoan[] = raw.individualLoans || raw.individual_loans || [];
  const commercialLoanSummary: LoanSummary | null = raw.commercialLoanSummary || raw.commercial_loan_summary || null;
  const individualLoanSummary: LoanSummary | null = raw.individualLoanSummary || raw.individual_loan_summary || null;
  const enquiries: BureauEnquiry[] = raw.enquiries || [];
  const enquiryMetrics: EnquiryMetrics | null = raw.enquiryMetrics || raw.enquiry_metrics || null;
  const relationships: BureauRelationship[] = raw.relationships || [];
  const paymentDelays: LoanPaymentDelay[] = raw.paymentDelays || raw.payment_delays || [];
  const bounceAnalysis: BounceAnalysis | null = raw.bounceAnalysis || raw.bounce_analysis || null;
  const emiBounceAnalysis: EMIBounceAnalysis | null = raw.emiBounceAnalysis || raw.emi_bounce_analysis || null;

  return {
    data: {
      commercialSummary,
      individualSummary,
      aiInsights,
      commercialLoans,
      individualLoans,
      commercialLoanSummary,
      individualLoanSummary,
      enquiries,
      enquiryMetrics,
      relationships,
      paymentDelays,
      bounceAnalysis,
      emiBounceAnalysis,
    },
    isLoading,
  };
}
