import {
  BankAccount,
  TransactionSummary,
  BankingConductAnalysis,
  CashFlowPattern,
  BalanceBehavior,
  BankingRedFlags,
  AIBankingAssessment,
  OutwardChequeBounce,
  InwardChequeBounce,
  BankingEMIBounce,
  CashVsNonCash,
  MonthlyBalance,
} from '@/types/banking';

// Bank Accounts
export const mockBankAccounts: BankAccount[] = [
  {
    id: 'BA001',
    maskedAccountNumber: 'XXXX XXXX 1234',
    bankName: 'HDFC Bank',
    accountType: 'Current Account',
    branchName: 'Connaught Place, Delhi',
    ifscCode: 'HDFC0001234',
    accountName: 'Diamond Agencies Pvt Ltd',
    customerId: 'CUST123456',
    statementPeriod: 'Jan 2024 - Jan 2025 (12 months)',
    registeredAddress: '123, Nehru Place, New Delhi - 110019',
  },
  {
    id: 'BA002',
    maskedAccountNumber: 'XXXX XXXX 5678',
    bankName: 'ICICI Bank',
    accountType: 'Overdraft Account',
    branchName: 'Saket, Delhi',
    ifscCode: 'ICIC0005678',
    accountName: 'Diamond Agencies Pvt Ltd',
    statementPeriod: 'Jan 2024 - Jan 2025 (12 months)',
  },
];

// Transaction Summary
export const mockTransactionSummary: TransactionSummary = {
  totalCredits: 52500000,
  totalDebits: 48200000,
  totalTransactions: 2456,
  analysisPeriods: 12,
};

// Banking Conduct Analysis
export const mockBankingConductAnalysis: BankingConductAnalysis = {
  transactionFrequency: 'High',
  creditDebitDominance: 'Credit Dominant',
  digitalVsCash: 'Digital Dominant',
  usageConsistency: 'Consistent',
  insights: [
    'Stable activity with regular credits and debits throughout the analysis period',
    'Digital transactions dominate with 85% non-cash transactions',
    'Average of 205 transactions per month indicating active business operations',
    'Credit inflows consistently exceed debit outflows by an average of 8%',
  ],
};

// Cash Flow Patterns
export const mockCashFlowPatterns: CashFlowPattern[] = [
  { month: 'Jan 2025', credits: 4800000, debits: 4200000, netCashFlow: 600000, creditCount: 42, debitCount: 156 },
  { month: 'Dec 2024', credits: 5200000, debits: 4800000, netCashFlow: 400000, creditCount: 48, debitCount: 178 },
  { month: 'Nov 2024', credits: 4500000, debits: 4100000, netCashFlow: 400000, creditCount: 38, debitCount: 145 },
  { month: 'Oct 2024', credits: 4200000, debits: 4500000, netCashFlow: -300000, creditCount: 35, debitCount: 168 },
  { month: 'Sep 2024', credits: 4600000, debits: 4000000, netCashFlow: 600000, creditCount: 40, debitCount: 152 },
  { month: 'Aug 2024', credits: 4300000, debits: 3900000, netCashFlow: 400000, creditCount: 36, debitCount: 142 },
  { month: 'Jul 2024', credits: 3800000, debits: 3500000, netCashFlow: 300000, creditCount: 32, debitCount: 128 },
  { month: 'Jun 2024', credits: 3200000, debits: 3800000, netCashFlow: -600000, creditCount: 28, debitCount: 145 },
  { month: 'May 2024', credits: 4100000, debits: 3700000, netCashFlow: 400000, creditCount: 34, debitCount: 138 },
  { month: 'Apr 2024', credits: 4400000, debits: 4000000, netCashFlow: 400000, creditCount: 38, debitCount: 155 },
  { month: 'Mar 2024', credits: 5800000, debits: 4200000, netCashFlow: 1600000, creditCount: 52, debitCount: 175 },
  { month: 'Feb 2024', credits: 3600000, debits: 3500000, netCashFlow: 100000, creditCount: 30, debitCount: 125 },
];

// Balance Behavior
export const mockBalanceBehavior: BalanceBehavior = {
  averageEODBalance: 1850000,
  lowestBalance: -250000,
  frequencyOfNegativeBalances: 3,
  overdraftUsage: {
    frequency: 8,
    averageDuration: 4,
    maxNegativeBalance: 250000,
  },
};

// Banking Red Flags
export const mockBankingRedFlags: BankingRedFlags = {
  frequentChequeBounces: false,
  negativeEODBalances: true,
  netCashOutflow: false,
  excessiveOverdraftDependence: false,
  details: [
    '3 instances of negative EOD balances observed in Jun 2024, Oct 2024',
    'Overdraft utilized 8 times during the analysis period',
    'All cheque bounce instances were recovered within 7 days',
  ],
};

// AI Banking Assessment
export const mockAIBankingAssessment: AIBankingAssessment = {
  financialDiscipline: 'Good - Consistent transaction patterns with regular credit inflows',
  liquidityStrength: 'Moderate - Average EOD balance of ₹18.5L with occasional negative instances',
  riskOfDefault: 'Low - Strong credit-to-debit ratio with minimal bounce history',
  creditworthiness: 'Positive - Overall healthy banking conduct supporting credit decision',
  riskLevel: 'Low Risk',
  summary: 'The banking analysis indicates a healthy operational profile with consistent transaction activity. The account demonstrates stable cash flow patterns with credits generally exceeding debits. While there are occasional instances of negative balances, these are short-lived and quickly recovered. The low cheque bounce rate and minimal EMI bounces indicate strong repayment discipline. Overall, the banking conduct supports a positive credit assessment.',
};

// Outward Cheque Bounce
export const mockOutwardChequeBounce: OutwardChequeBounce = {
  chequesDeposited: 156,
  chequesBounced: 4,
  bounceRate: 2.56,
  validMonths: 12,
  excludedMonths: 0,
};

// Inward Cheque Bounce
export const mockInwardChequeBounce: InwardChequeBounce = {
  chequesIssued: 89,
  chequesBounced: 2,
  bounceRate: 2.25,
};

// Banking EMI Bounce
export const mockBankingEMIBounce: BankingEMIBounce = {
  totalEmiBounces: 1,
  recencyOfBounces: '4 months ago',
  frequency: 'Occasional',
};

// Cash vs Non-Cash
export const mockCashVsNonCash: CashVsNonCash = {
  cashDepositPercentage: 12.5,
  cashWithdrawalPercentage: 8.2,
  cashDepositValue: 6562500,
  cashWithdrawalValue: 3952400,
};

// Monthly Balances
export const mockMonthlyBalances: MonthlyBalance[] = [
  { month: 'Jan 2025', averageBalance: 2100000, lowestBalance: 850000, closingBalance: 2250000 },
  { month: 'Dec 2024', averageBalance: 1950000, lowestBalance: 720000, closingBalance: 2100000 },
  { month: 'Nov 2024', averageBalance: 1800000, lowestBalance: 650000, closingBalance: 1850000 },
  { month: 'Oct 2024', averageBalance: 1650000, lowestBalance: -150000, closingBalance: 1500000 },
  { month: 'Sep 2024', averageBalance: 1900000, lowestBalance: 580000, closingBalance: 1950000 },
  { month: 'Aug 2024', averageBalance: 1750000, lowestBalance: 520000, closingBalance: 1800000 },
  { month: 'Jul 2024', averageBalance: 1600000, lowestBalance: 480000, closingBalance: 1650000 },
  { month: 'Jun 2024', averageBalance: 1200000, lowestBalance: -250000, closingBalance: 1100000 },
  { month: 'May 2024', averageBalance: 1550000, lowestBalance: 420000, closingBalance: 1600000 },
  { month: 'Apr 2024', averageBalance: 1680000, lowestBalance: 510000, closingBalance: 1720000 },
  { month: 'Mar 2024', averageBalance: 2200000, lowestBalance: 980000, closingBalance: 2350000 },
  { month: 'Feb 2024', averageBalance: 1420000, lowestBalance: 380000, closingBalance: 1480000 },
];
