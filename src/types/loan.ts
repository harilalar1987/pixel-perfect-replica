export type LoanType =
  | 'Working Capital'
  | 'Equipment Finance'
  | 'Business Expansion'
  | 'Property Loan'
  | 'Personal Loan'
  | 'Credit Card'
  | 'Term Loan'
  | 'Overdraft'
  | 'Cash Credit';

export type LoanStatus =
  | 'Draft'
  | 'Under Review'
  | 'Pre-Approved'
  | 'Approved'
  | 'Rejected'
  | 'Processing';

export type PolicyStatus = 'pass' | 'fail' | 'not-available';

export interface Policy {
  id: string;
  name: string;
  description: string;
  threshold: string;
  actualValue: string | number | null;
  status: PolicyStatus;
  dataSource: string;
}

export interface PolicySection {
  title: string;
  policies: Policy[];
}

export interface LoanApplication {
  id: string;
  customerName: string;
  loanAmount: number;
  loanType: LoanType;
  anchorName?: string;
  anchorSuggestedAmount?: number;
  assignedAnalyst: string;
  status: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
  teamName: string;
}

export interface AnalysisTab {
  id: string;
  label: string;
  icon: string;
}

export interface RiskAssessment {
  criteriaPassed: number;
  criteriaFailed: number;
  overallRiskScore: number;
  riskCategory: 'Low Risk' | 'Medium Risk' | 'High Risk';
  keyStrengths: string[];
  keyConcerns: string[];
  recommendations: string[];
}
