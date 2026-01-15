// Fraud Assessment - Lumpsum Patterns
export interface LumpsumCluster {
  id: string;
  merchantName: string;
  transactionCount: number;
  roundedRatio: number;
  totalDebitValue: number;
  totalCreditValue: number;
  patternType: 'Recurring' | 'One-time';
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface LumpsumPatternAnalysis {
  totalClusters: number;
  totalTransactions: number;
  accountsWithActivity: number;
  totalDebitAmount: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  clusters: LumpsumCluster[];
}

// Fraud Assessment - Recurring Patterns
export interface RecurringCluster {
  id: string;
  counterpartyName: string;
  transactionCount: number;
  averageDebitAmount: number;
  totalDebitExposure: number;
  patternClassification: 'Recurring';
  runningBalanceTrend: 'Positive' | 'Negative' | 'Variable';
}

export interface RecurringPatternAnalysis {
  totalClusters: number;
  totalTransactions: number;
  accountsWithActivity: number;
  averageDebitAmount: number;
  totalDebitExposure: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  clusters: RecurringCluster[];
  highRiskIndicators: string[];
}

// Fraud Assessment - Round Tripping
export interface RoundTrippingChain {
  id: string;
  involvedAccounts: string[];
  counterparties: string[];
  chainLength: number;
  averageTransactionValue: number;
  timeProximity: 'Short' | 'Medium' | 'Long';
  valueConsistency: 'High' | 'Medium' | 'Low';
}

export interface RoundTrippingAnalysis {
  clustersFound: boolean;
  totalChains: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'None';
  chains: RoundTrippingChain[];
  summary: string;
}
