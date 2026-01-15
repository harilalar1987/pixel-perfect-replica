// Bureau Summary Types
export interface CommercialBureauSummary {
  cmrScore: number;
  cmrInterpretation: 'Strong' | 'Moderate' | 'High Risk';
  totalAccounts: number;
  activeAccounts: number;
  totalSanctionedAmount: number;
  totalOutstandingAmount: number;
  aiSummary: string;
}

export interface IndividualBureauSummary {
  creditScore: number | null;
  scoreRange: string;
  applicantName: string;
  dateOfBirth: string;
  totalAccounts: number;
  totalSanctionedAmount: number;
  totalOutstandingAmount: number;
  activeAccounts: number;
  overdueAccounts: number;
  emailVariations: number;
  telephoneVariations: number;
  addressVariations: number;
  hasDisputes: boolean;
  hasWriteOffs: boolean;
  hasSettlements: boolean;
}

export interface AIBureauInsights {
  creditProfileAnalysis: string;
  paymentBehaviourInsights: string;
  riskAssessment: string;
  financialObligationsOverview: string;
  strengths: string[];
  redFlags: string[];
  overallAssessment: string;
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk';
}

// Bureau Loans Types
export interface BureauLoan {
  id: string;
  productType: string;
  loanAmount: number;
  outstandingAmount: number;
  status: 'ACTIVE' | 'CLOSED';
  tags: string[];
  sanctionedDate?: string;
  lenderName?: string;
}

export interface LoanSummary {
  totalAccounts: number;
  activeAccounts: number;
  closedAccounts: number;
  totalSanctionedAmount: number;
  totalOutstandingAmount: number;
}

// Bureau Enquiries Types
export interface BureauEnquiry {
  id: string;
  creditLender: string;
  enquiryDate: string;
  creditType: string;
  enquiryAmount: number;
  applicantType: 'Commercial' | 'Individual';
  bureauSource: string;
}

export interface EnquiryMetrics {
  totalEnquiries: number;
  last30Days: number;
  last90Days: number;
  last180Days: number;
  last12Months: number;
}

// Bureau Relationships Types
export interface BureauRelationship {
  id: string;
  fullName: string;
  status: 'Active' | 'Inactive';
  type: 'Resident Indian' | 'NRI' | 'N/A';
  dateOfBirth?: string;
  relationship: 'Proprietor' | 'Partner' | 'Director' | 'Individual' | 'Guarantor' | 'Others' | 'N/A';
  bureauDataAvailable: boolean;
}

// Payment Delays Types
export interface PaymentDelayRecord {
  year: number;
  months: { [key: string]: number | null }; // JAN, FEB, etc. with DPD value
}

export interface LoanPaymentDelay {
  id: string;
  loanType: string;
  loanAmount: number;
  sanctionedDate: string;
  delays: PaymentDelayRecord[];
}

// Bounce Analysis Types
export interface BounceAnalysis {
  chequesPresented: number;
  chequesBounced: number;
  bounceRate: number;
  timePeriod: string;
}

export interface EMIBounceAnalysis {
  totalEmiBounces: number;
  recencyOfLastBounce: string;
  frequency: 'Low' | 'Medium' | 'High';
  riskClassification: 'Low Risk' | 'Medium Risk' | 'High Risk';
}

// Cash Flow Analysis Types (Bureau-inferred)
export interface CreditUtilizationBehavior {
  averageUtilization: number;
  peakUtilization: number;
  interpretation: string;
}

export interface RepaymentPatternAnalysis {
  onTimePayments: number;
  delayedPayments: number;
  minimumDueOnly: number;
  fullRepayments: number;
}
