// Bank Account Types
export interface BankAccount {
  id: string;
  maskedAccountNumber: string;
  bankName: string;
  accountType: 'Current Account' | 'Overdraft Account' | 'Savings Account';
  branchName?: string;
  ifscCode?: string;
  accountName: string;
  customerId?: string;
  statementPeriod: string;
  registeredAddress?: string;
}

// Transaction Summary Types
export interface TransactionSummary {
  totalCredits: number;
  totalDebits: number;
  totalTransactions: number;
  analysisPeriods: number;
}

// AI Banking Summary Types
export interface BankingConductAnalysis {
  transactionFrequency: 'Low' | 'Medium' | 'High';
  creditDebitDominance: 'Credit Dominant' | 'Balanced' | 'Debit Dominant';
  digitalVsCash: 'Digital Dominant' | 'Mixed' | 'Cash Dominant';
  usageConsistency: 'Consistent' | 'Variable' | 'Irregular';
  insights: string[];
}

export interface CashFlowPattern {
  month: string;
  credits: number;
  debits: number;
  netCashFlow: number;
  creditCount: number;
  debitCount: number;
}

export interface BalanceBehavior {
  averageEODBalance: number;
  lowestBalance: number;
  frequencyOfNegativeBalances: number;
  overdraftUsage?: {
    frequency: number;
    averageDuration: number;
    maxNegativeBalance: number;
  };
}

export interface BankingRedFlags {
  frequentChequeBounces: boolean;
  negativeEODBalances: boolean;
  netCashOutflow: boolean;
  excessiveOverdraftDependence: boolean;
  details: string[];
}

export interface AIBankingAssessment {
  financialDiscipline: string;
  liquidityStrength: string;
  riskOfDefault: string;
  creditworthiness: string;
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  summary: string;
}

// Banking Bounce Analysis Types
export interface OutwardChequeBounce {
  chequesDeposited: number;
  chequesBounced: number;
  bounceRate: number;
  validMonths: number;
  excludedMonths: number;
}

export interface InwardChequeBounce {
  chequesIssued: number;
  chequesBounced: number;
  bounceRate: number;
}

export interface BankingEMIBounce {
  totalEmiBounces: number;
  recencyOfBounces: string;
  frequency: 'None' | 'Occasional' | 'Repeated';
}

// Banking Cash Flow Analysis Types
export interface CashVsNonCash {
  cashDepositPercentage: number;
  cashWithdrawalPercentage: number;
  cashDepositValue: number;
  cashWithdrawalValue: number;
}

export interface MonthlyBalance {
  month: string;
  averageBalance: number;
  lowestBalance: number;
  closingBalance: number;
}
