export interface ApplicantDetails {
  name: string;
  designation: string;
  phone: string;
  email: string;
  interviewDate: string;
  interviewMode: 'In-Person' | 'Video Call' | 'Phone Call';
  interviewedBy: string;
}

export interface BusinessDetails {
  businessName: string;
  constitution: string;
  yearsInBusiness: number;
  industry: string;
  productServices: string;
  numberOfEmployees: number;
  businessPremises: 'Owned' | 'Rented' | 'Leased';
  monthlyRent?: number;
  keyCustomers: string[];
  keySuppliers: string[];
}

export interface FinancialDiscussion {
  currentTurnover: number;
  projectedGrowth: number;
  profitMargin: number;
  existingLoans: number;
  proposedEMI: number;
  otherIncome?: string;
  bankingRelationship: string;
  creditCardUsage: 'Regular' | 'Occasional' | 'None';
}

export interface InterviewNote {
  id: string;
  category: 'Business' | 'Financial' | 'Character' | 'Collateral' | 'Capacity' | 'General';
  question: string;
  response: string;
  observation: string;
  riskIndicator: 'positive' | 'neutral' | 'negative';
  timestamp: string;
}

export interface CharacterAssessment {
  firstImpression: 'Excellent' | 'Good' | 'Average' | 'Below Average';
  communicationSkills: 'Excellent' | 'Good' | 'Average' | 'Below Average';
  transparency: 'High' | 'Medium' | 'Low';
  businessKnowledge: 'Expert' | 'Good' | 'Basic' | 'Limited';
  attitudeToRepayment: 'Committed' | 'Confident' | 'Uncertain' | 'Evasive';
  overallImpression: string;
}

export interface DiscussionSummary {
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  overallAssessment: 'Favorable' | 'Conditionally Favorable' | 'Unfavorable';
  confidenceScore: number;
  verificationRequired: string[];
}

export interface PersonalDiscussionData {
  applicantDetails: ApplicantDetails;
  businessDetails: BusinessDetails;
  financialDiscussion: FinancialDiscussion;
  interviewNotes: InterviewNote[];
  characterAssessment: CharacterAssessment;
  summary: DiscussionSummary;
}
