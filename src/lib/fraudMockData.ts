import {
  LumpsumPatternAnalysis,
  RecurringPatternAnalysis,
  RoundTrippingAnalysis,
} from '@/types/fraud';

// Lumpsum Pattern Analysis
export const mockLumpsumPatternAnalysis: LumpsumPatternAnalysis = {
  totalClusters: 3,
  totalTransactions: 12,
  accountsWithActivity: 2,
  totalDebitAmount: 4850000,
  riskLevel: 'Medium',
  clusters: [
    {
      id: 'LC001',
      merchantName: 'ABC Enterprises',
      transactionCount: 5,
      roundedRatio: 100,
      totalDebitValue: 2500000,
      totalCreditValue: 0,
      patternType: 'Recurring',
      riskLevel: 'Medium',
    },
    {
      id: 'LC002',
      merchantName: 'XYZ Trading Co',
      transactionCount: 4,
      roundedRatio: 75,
      totalDebitValue: 1600000,
      totalCreditValue: 500000,
      patternType: 'Recurring',
      riskLevel: 'Low',
    },
    {
      id: 'LC003',
      merchantName: 'Metro Finance',
      transactionCount: 3,
      roundedRatio: 100,
      totalDebitValue: 750000,
      totalCreditValue: 0,
      patternType: 'One-time',
      riskLevel: 'Medium',
    },
  ],
};

// Recurring Pattern Analysis
export const mockRecurringPatternAnalysis: RecurringPatternAnalysis = {
  totalClusters: 4,
  totalTransactions: 28,
  accountsWithActivity: 2,
  averageDebitAmount: 125000,
  totalDebitExposure: 3500000,
  riskLevel: 'Medium',
  clusters: [
    {
      id: 'RC001',
      counterpartyName: 'Bajaj Finance Ltd',
      transactionCount: 12,
      averageDebitAmount: 85000,
      totalDebitExposure: 1020000,
      patternClassification: 'Recurring',
      runningBalanceTrend: 'Variable',
    },
    {
      id: 'RC002',
      counterpartyName: 'HDFC Bank EMI',
      transactionCount: 8,
      averageDebitAmount: 156000,
      totalDebitExposure: 1248000,
      patternClassification: 'Recurring',
      runningBalanceTrend: 'Positive',
    },
    {
      id: 'RC003',
      counterpartyName: 'Tata Capital',
      transactionCount: 5,
      averageDebitAmount: 154400,
      totalDebitExposure: 772000,
      patternClassification: 'Recurring',
      runningBalanceTrend: 'Variable',
    },
    {
      id: 'RC004',
      counterpartyName: 'Kotak Mahindra Bank',
      transactionCount: 3,
      averageDebitAmount: 153333,
      totalDebitExposure: 460000,
      patternClassification: 'Recurring',
      runningBalanceTrend: 'Positive',
    },
  ],
  highRiskIndicators: [
    'Multiple clusters linked to NBFCs and finance companies',
    'Variable running balance trend in 2 clusters',
    'Total monthly recurring exposure of ₹2.92L identified',
  ],
};

// Round Tripping Analysis
export const mockRoundTrippingAnalysis: RoundTrippingAnalysis = {
  clustersFound: false,
  totalChains: 0,
  riskLevel: 'None',
  chains: [],
  summary: 'No round-tripping patterns meeting the defined thresholds were detected in the analyzed transaction data. The transaction flows do not indicate circular movement of funds or artificial turnover creation.',
};
