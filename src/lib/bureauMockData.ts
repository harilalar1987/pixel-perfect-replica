import {
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

// Commercial Bureau Summary
export const mockCommercialBureauSummary: CommercialBureauSummary = {
  cmrScore: 3,
  cmrInterpretation: 'Strong',
  totalAccounts: 12,
  activeAccounts: 5,
  totalSanctionedAmount: 25000000,
  totalOutstandingAmount: 18500000,
  aiSummary: 'The commercial credit profile demonstrates strong credit discipline with a CMR-3 rating. The borrower maintains a healthy mix of secured and unsecured facilities with consistent repayment behaviour. No significant delinquencies observed in recent months. The outstanding to sanctioned ratio indicates moderate leverage with adequate headroom for additional credit.',
};

// Individual Bureau Summary
export const mockIndividualBureauSummary: IndividualBureauSummary = {
  creditScore: 742,
  scoreRange: '300-900',
  applicantName: 'Rishi Talwar',
  dateOfBirth: '15-Mar-1982',
  totalAccounts: 8,
  totalSanctionedAmount: 4500000,
  totalOutstandingAmount: 2100000,
  activeAccounts: 4,
  overdueAccounts: 1,
  emailVariations: 2,
  telephoneVariations: 3,
  addressVariations: 4,
  hasDisputes: false,
  hasWriteOffs: false,
  hasSettlements: false,
};

// AI Bureau Insights
export const mockAIBureauInsights: AIBureauInsights = {
  creditProfileAnalysis: 'The applicant holds 8 credit accounts with a balanced distribution between secured and unsecured facilities. 4 accounts are currently active while 4 have been successfully closed. The credit utilization pattern shows disciplined borrowing with 46% of sanctioned limits currently utilized.',
  paymentBehaviourInsights: 'Payment history indicates mostly on-time repayments with isolated minor delays in Q2 2024. No instances of 60+ DPD observed in the last 24 months. The delays appear to be operational in nature rather than indicative of financial stress.',
  riskAssessment: 'The applicant presents a moderate risk profile. Key concerns include 1 overdue account currently in 30+ DPD status and elevated enquiry activity in the last 90 days. However, the strong credit score and clean historical track record provide comfort.',
  financialObligationsOverview: 'Total sanctioned exposure stands at ₹45 Lakhs across 8 facilities. Current outstanding of ₹21 Lakhs represents 47% utilization. The exposure is distributed across 3 banks and 2 NBFCs, indicating diversified borrowing relationships.',
  strengths: [
    'Strong personal credit score of 742',
    'High proportion of closed accounts indicating repayment capability',
    'No write-offs, settlements or disputes on record',
    'Diversified lender relationships',
    'Consistent address and employment stability',
  ],
  redFlags: [
    '1 account currently in 30+ DPD status',
    'Recent payment delay in Q2 2024',
    'Elevated enquiry activity in last 90 days',
    'High address variations (4 variations reported)',
  ],
  overallAssessment: 'The applicant demonstrates a generally healthy credit profile with a score of 742. While there is one account currently showing minor delinquency, the overall repayment track record is positive. The high enquiry count in recent months warrants monitoring but does not pose immediate concern. Recommend proceeding with credit assessment subject to verification of the overdue account status.',
  riskCategory: 'Moderate Risk',
};

// Bureau Loans - Commercial
export const mockCommercialLoans: BureauLoan[] = [
  {
    id: 'CL001',
    productType: 'Business Loan – Unsecured',
    loanAmount: 5000000,
    outstandingAmount: 3200000,
    status: 'ACTIVE',
    tags: ['Not a Suit Filed Case', 'Open', 'Standard', 'Not Willful Defaulter'],
    sanctionedDate: '15-Jan-2023',
    lenderName: 'HDFC Bank',
  },
  {
    id: 'CL002',
    productType: 'Cash Credit',
    loanAmount: 10000000,
    outstandingAmount: 7500000,
    status: 'ACTIVE',
    tags: ['Open', 'Standard'],
    sanctionedDate: '01-Apr-2022',
    lenderName: 'ICICI Bank',
  },
  {
    id: 'CL003',
    productType: 'Overdraft',
    loanAmount: 3000000,
    outstandingAmount: 2100000,
    status: 'ACTIVE',
    tags: ['Open', 'Standard'],
    sanctionedDate: '20-Jul-2023',
    lenderName: 'Axis Bank',
  },
  {
    id: 'CL004',
    productType: 'Business Loan – Secured',
    loanAmount: 4000000,
    outstandingAmount: 0,
    status: 'CLOSED',
    tags: ['Closed', 'Not Willful Defaulter'],
    sanctionedDate: '10-Mar-2020',
    lenderName: 'SBI',
  },
  {
    id: 'CL005',
    productType: 'GECL Loan',
    loanAmount: 3000000,
    outstandingAmount: 1800000,
    status: 'ACTIVE',
    tags: ['Open', 'Standard', 'Priority Sector'],
    sanctionedDate: '15-Jun-2021',
    lenderName: 'HDFC Bank',
  },
];

// Bureau Loans - Individual
export const mockIndividualLoans: BureauLoan[] = [
  {
    id: 'IL001',
    productType: 'Housing Loan',
    loanAmount: 3500000,
    outstandingAmount: 2800000,
    status: 'ACTIVE',
    tags: ['Open', 'Standard', 'Secured'],
    sanctionedDate: '01-Feb-2019',
    lenderName: 'LIC Housing',
  },
  {
    id: 'IL002',
    productType: 'Credit Card',
    loanAmount: 200000,
    outstandingAmount: 45000,
    status: 'ACTIVE',
    tags: ['Open', 'Standard'],
    sanctionedDate: '15-Aug-2017',
    lenderName: 'HDFC Bank',
  },
  {
    id: 'IL003',
    productType: 'Auto Loan (Personal)',
    loanAmount: 800000,
    outstandingAmount: 0,
    status: 'CLOSED',
    tags: ['Closed', 'Fully Paid'],
    sanctionedDate: '20-Nov-2018',
    lenderName: 'HDFC Bank',
  },
];

// Loan Summary
export const mockCommercialLoanSummary: LoanSummary = {
  totalAccounts: 5,
  activeAccounts: 4,
  closedAccounts: 1,
  totalSanctionedAmount: 25000000,
  totalOutstandingAmount: 14600000,
};

export const mockIndividualLoanSummary: LoanSummary = {
  totalAccounts: 3,
  activeAccounts: 2,
  closedAccounts: 1,
  totalSanctionedAmount: 4500000,
  totalOutstandingAmount: 2845000,
};

// Bureau Enquiries
export const mockBureauEnquiries: BureauEnquiry[] = [
  {
    id: 'ENQ001',
    creditLender: 'HDFC Bank',
    enquiryDate: '15-Jan-2025',
    creditType: 'Business Loan – Unsecured',
    enquiryAmount: 5000000,
    applicantType: 'Commercial',
    bureauSource: 'Commercial Bureau',
  },
  {
    id: 'ENQ002',
    creditLender: 'Bajaj Finance',
    enquiryDate: '10-Jan-2025',
    creditType: 'Business Loan – General',
    enquiryAmount: 3000000,
    applicantType: 'Commercial',
    bureauSource: 'Commercial Bureau',
  },
  {
    id: 'ENQ003',
    creditLender: 'Not Disclosed',
    enquiryDate: '28-Dec-2024',
    creditType: 'Cash Credit',
    enquiryAmount: 8000000,
    applicantType: 'Commercial',
    bureauSource: 'Commercial Bureau',
  },
  {
    id: 'ENQ004',
    creditLender: 'ICICI Bank',
    enquiryDate: '15-Dec-2024',
    creditType: 'Personal Loan',
    enquiryAmount: 500000,
    applicantType: 'Individual',
    bureauSource: 'Consumer Bureau',
  },
  {
    id: 'ENQ005',
    creditLender: 'Axis Bank',
    enquiryDate: '01-Nov-2024',
    creditType: 'Property Loan',
    enquiryAmount: 10000000,
    applicantType: 'Commercial',
    bureauSource: 'Commercial Bureau',
  },
];

export const mockEnquiryMetrics: EnquiryMetrics = {
  totalEnquiries: 12,
  last30Days: 3,
  last90Days: 5,
  last180Days: 8,
  last12Months: 12,
};

// Bureau Relationships
export const mockBureauRelationships: BureauRelationship[] = [
  {
    id: 'REL001',
    fullName: 'Rishi Talwar S/O Chander Shekhar',
    status: 'Active',
    type: 'Resident Indian',
    dateOfBirth: '15-Mar-1982',
    relationship: 'Individual',
    bureauDataAvailable: true,
  },
  {
    id: 'REL002',
    fullName: 'Mr Rishi Talwar',
    status: 'Active',
    type: 'N/A',
    relationship: 'Proprietor',
    bureauDataAvailable: false,
  },
  {
    id: 'REL003',
    fullName: 'Devender Pal Malik',
    status: 'Active',
    type: 'N/A',
    relationship: 'Partner',
    bureauDataAvailable: false,
  },
  {
    id: 'REL004',
    fullName: 'Chander Shekher Shekhar',
    status: 'Active',
    type: 'N/A',
    relationship: 'Others',
    bureauDataAvailable: false,
  },
  {
    id: 'REL005',
    fullName: 'Pinki Talwar',
    status: 'Active',
    type: 'N/A',
    relationship: 'N/A',
    bureauDataAvailable: false,
  },
];

// Payment Delays
export const mockPaymentDelays: LoanPaymentDelay[] = [
  {
    id: 'PD001',
    loanType: 'Business Loan – Unsecured',
    loanAmount: 5000000,
    sanctionedDate: '15-Jan-2023',
    delays: [
      {
        year: 2025,
        months: { JAN: 0, FEB: null, MAR: null, APR: null, MAY: null, JUN: null, JUL: null, AUG: null, SEP: null, OCT: null, NOV: null, DEC: null },
      },
      {
        year: 2024,
        months: { JAN: 0, FEB: 0, MAR: 0, APR: 0, MAY: 3, JUN: 0, JUL: 0, AUG: 0, SEP: 0, OCT: 0, NOV: 0, DEC: 0 },
      },
      {
        year: 2023,
        months: { JAN: null, FEB: 0, MAR: 0, APR: 0, MAY: 0, JUN: 0, JUL: 0, AUG: 0, SEP: 0, OCT: 0, NOV: 0, DEC: 0 },
      },
    ],
  },
  {
    id: 'PD002',
    loanType: 'Credit Card',
    loanAmount: 200000,
    sanctionedDate: '15-Aug-2017',
    delays: [
      {
        year: 2025,
        months: { JAN: 0, FEB: null, MAR: null, APR: null, MAY: null, JUN: null, JUL: null, AUG: null, SEP: null, OCT: null, NOV: null, DEC: null },
      },
      {
        year: 2024,
        months: { JAN: 0, FEB: 0, MAR: 0, APR: 5, MAY: 15, JUN: 0, JUL: 0, AUG: 0, SEP: 0, OCT: 0, NOV: 0, DEC: 0 },
      },
      {
        year: 2023,
        months: { JAN: 0, FEB: 0, MAR: 0, APR: 0, MAY: 0, JUN: 0, JUL: 0, AUG: 0, SEP: 0, OCT: 0, NOV: 0, DEC: 0 },
      },
    ],
  },
  {
    id: 'PD003',
    loanType: 'Property Loan',
    loanAmount: 10000000,
    sanctionedDate: '01-Apr-2020',
    delays: [
      {
        year: 2025,
        months: { JAN: 0, FEB: null, MAR: null, APR: null, MAY: null, JUN: null, JUL: null, AUG: null, SEP: null, OCT: null, NOV: null, DEC: null },
      },
      {
        year: 2024,
        months: { JAN: 0, FEB: 0, MAR: 0, APR: 0, MAY: 0, JUN: 0, JUL: 0, AUG: 0, SEP: 0, OCT: 0, NOV: 0, DEC: 0 },
      },
      {
        year: 2023,
        months: { JAN: 0, FEB: 0, MAR: 0, APR: 0, MAY: 0, JUN: 0, JUL: 0, AUG: 0, SEP: 0, OCT: 0, NOV: 0, DEC: 0 },
      },
      {
        year: 2022,
        months: { JAN: 0, FEB: 0, MAR: 0, APR: 0, MAY: 0, JUN: 0, JUL: 0, AUG: 0, SEP: 0, OCT: 0, NOV: 0, DEC: 0 },
      },
    ],
  },
];

// Bounce Analysis
export const mockBureauBounceAnalysis: BounceAnalysis = {
  chequesPresented: 48,
  chequesBounced: 2,
  bounceRate: 4.17,
  timePeriod: 'Last 12 Months',
};

export const mockEMIBounceAnalysis: EMIBounceAnalysis = {
  totalEmiBounces: 1,
  recencyOfLastBounce: '3 months ago',
  frequency: 'Low',
  riskClassification: 'Low Risk',
};
