import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type {
  GSTEntityDetails,
  GSTAISummary,
  RevenueComparison,
  ITCComparison,
  AnnualGrossAnalysis,
  AnnualNetAnalysis,
  FilingDelay,
  TopParty,
  CommonParty,
} from '@/types/gst';

export function useGSTEntities(loanId: string | undefined) {
  return useQuery({
    queryKey: ['gst-entities', loanId],
    queryFn: async () => {
      if (!loanId) return [];
      const { data, error } = await (supabase as any)
        .from('gst_entities')
        .select('*, gst_returns(*)')
        .eq('loan_id', loanId)
        .order('inserted_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!loanId,
  });
}

/** Extract structured GST data from DB records */
export function useGSTAnalytics(loanId: string | undefined) {
  const { data: entities, isLoading } = useGSTEntities(loanId);

  if (!entities || entities.length === 0) {
    return { data: null, isLoading };
  }

  const entity = entities[0]; // primary entity
  const meta = entity.meta || {};
  const returns = entity.gst_returns || [];

  // Entity Details
  const entityDetails: GSTEntityDetails = {
    gstin: entity.gstin || '—',
    legalName: entity.legal_name || '—',
    tradeName: meta.trade_name || entity.legal_name || '—',
    pan: meta.pan || '—',
  };

  // Compute from gst_returns
  const totalRevenue = returns.reduce((a: number, r: any) => a + Number(r.gstr3b_revenue || 0), 0);
  const totalITC = returns.reduce((a: number, r: any) => a + Number(r.gstr3b_itc || 0), 0);

  const aiSummary: GSTAISummary | null = meta.aiSummary || meta.ai_summary || null;
  const revenueComparison: RevenueComparison = meta.revenueComparison || {
    gstr1Revenue: totalRevenue,
    gstr3bRevenue: totalRevenue,
    variancePercentage: 0,
  };
  const itcComparison: ITCComparison = meta.itcComparison || {
    gstr3bITC: totalITC,
    gstr2aITC: totalITC,
    variancePercentage: 0,
    analysisPeriod: 'Rolling 12 Months',
  };
  const grossAnalysis: AnnualGrossAnalysis = meta.grossAnalysis || {
    currentPeriodRevenue: totalRevenue,
    previousPeriodRevenue: 0,
    yoyRevenueGrowth: 0,
    currentPeriodPurchases: totalITC,
    previousPeriodPurchases: 0,
  };
  const netAnalysis: AnnualNetAnalysis = meta.netAnalysis || {
    netRevenue: totalRevenue - totalITC,
    netPurchases: totalITC,
    yoyNetChange: 0,
  };

  // Filing delays from returns
  const filingDelays: FilingDelay[] = meta.filingDelays || [];
  const topSuppliers: TopParty[] = meta.topSuppliers || [];
  const topCustomers: TopParty[] = meta.topCustomers || [];
  const commonParties: CommonParty[] = meta.commonParties || [];

  return {
    data: {
      entityDetails,
      aiSummary,
      revenueComparison,
      itcComparison,
      grossAnalysis,
      netAnalysis,
      filingDelays,
      topSuppliers,
      topCustomers,
      commonParties,
    },
    isLoading,
  };
}
