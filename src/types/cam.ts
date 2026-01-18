export interface RiskScoreComponent {
  category: string;
  weight: number;
  score: number;
  maxScore: number;
  remarks: string;
}

export interface RiskScoring {
  components: RiskScoreComponent[];
  totalScore: number;
  maxTotalScore: number;
  riskGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'Medium Risk' | 'High Risk' | 'Very High Risk';
}

export interface ProposedTerms {
  loanAmount: number;
  sanctionedAmount: number;
  tenure: number;
  interestRate: number;
  processingFee: number;
  emiAmount: number;
  repaymentMode: 'Monthly' | 'Quarterly' | 'Bullet';
  moratoriumPeriod: number;
  securityType: string;
  securityValue: number;
  ltvRatio: number;
  insuranceRequired: boolean;
  covenants: string[];
}

export interface FinancialHighlight {
  metric: string;
  value: string;
  benchmark: string;
  status: 'good' | 'average' | 'concern';
}

export interface ApprovalStep {
  id: string;
  role: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'on-hold';
  comments?: string;
  timestamp?: string;
  delegatedTo?: string;
}

export interface ApprovalWorkflow {
  currentStage: number;
  totalStages: number;
  steps: ApprovalStep[];
  urgencyLevel: 'Normal' | 'Priority' | 'Urgent';
  targetDate: string;
  slaStatus: 'Within SLA' | 'Approaching SLA' | 'Breached SLA';
}

export interface FinalRecommendation {
  decision: 'Approve' | 'Conditional Approve' | 'Reject' | 'Refer to Higher Authority';
  rationale: string;
  conditions: string[];
  mitigants: string[];
  analystName: string;
  analystDesignation: string;
  recommendationDate: string;
}

export interface CAMData {
  applicationId: string;
  customerName: string;
  riskScoring: RiskScoring;
  proposedTerms: ProposedTerms;
  financialHighlights: FinancialHighlight[];
  approvalWorkflow: ApprovalWorkflow;
  recommendation: FinalRecommendation;
}
