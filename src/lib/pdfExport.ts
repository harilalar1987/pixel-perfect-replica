import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CAMData } from '@/types/cam';
import { PersonalDiscussionData } from '@/types/personalDiscussion';
import {
  CommercialBureauSummary,
  IndividualBureauSummary,
  BureauLoan,
  LoanSummary,
} from '@/types/bureau';
import { GSTEntityDetails } from '@/types/gst';
import { BankAccount, TransactionSummary } from '@/types/banking';
import { LumpsumPatternAnalysis, RecurringPatternAnalysis, RoundTrippingAnalysis } from '@/types/fraud';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

interface ExportData {
  loanId: string;
  customerName: string;
  loanAmount: number;
  camData: CAMData;
  personalData: PersonalDiscussionData;
  commercialBureauSummary: CommercialBureauSummary;
  individualBureauSummary: IndividualBureauSummary;
  commercialLoans: BureauLoan[];
  individualLoans: BureauLoan[];
  commercialLoanSummary: LoanSummary;
  individualLoanSummary: LoanSummary;
  gstEntityDetails: GSTEntityDetails;
  bankAccounts: BankAccount[];
  transactionSummary: TransactionSummary;
  lumpsumPatterns: LumpsumPatternAnalysis;
  recurringPatterns: RecurringPatternAnalysis;
  roundTripping: RoundTrippingAnalysis;
}

export const generateLoanAnalysisPDF = (data: ExportData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  const addHeader = (title: string) => {
    doc.setFillColor(30, 64, 175); // Blue header
    doc.rect(0, yPos - 5, pageWidth, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, yPos + 3);
    doc.setTextColor(0, 0, 0);
    yPos += 15;
  };

  const addSubHeader = (title: string) => {
    doc.setFillColor(241, 245, 249); // Light gray
    doc.rect(14, yPos - 4, pageWidth - 28, 8, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text(title, 16, yPos + 1);
    doc.setTextColor(0, 0, 0);
    yPos += 10;
  };

  const checkPageBreak = (requiredSpace: number = 40) => {
    if (yPos > doc.internal.pageSize.getHeight() - requiredSpace) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Title Page
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 60, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Credit Assessment Memo', pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Comprehensive Loan Analysis Report', pageWidth / 2, 42, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  yPos = 80;

  // Executive Summary Box
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, yPos - 5, pageWidth - 28, 55, 3, 3, 'S');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 20, yPos + 5);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryData = [
    ['Application ID:', data.loanId],
    ['Customer Name:', data.customerName],
    ['Requested Amount:', formatCurrency(data.loanAmount)],
    ['Sanctioned Amount:', formatCurrency(data.camData.proposedTerms.sanctionedAmount)],
    ['Risk Grade:', `${data.camData.riskScoring.riskGrade} - ${data.camData.riskScoring.riskCategory}`],
    ['Recommendation:', data.camData.recommendation.decision],
  ];

  summaryData.forEach((row, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], 70, yPos);
    if (idx % 2 === 0 && idx < summaryData.length - 1) {
      doc.setFont('helvetica', 'bold');
      doc.text(summaryData[idx + 1][0], 115, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(summaryData[idx + 1][1], 160, yPos);
    }
    if (idx % 2 === 0) yPos += 8;
  });

  yPos += 20;

  // Risk Scoring Section
  addHeader('Risk Scoring Analysis');

  autoTable(doc, {
    startY: yPos,
    head: [['Category', 'Weight', 'Score', 'Max', 'Remarks']],
    body: data.camData.riskScoring.components.map((comp) => [
      comp.category,
      `${comp.weight}%`,
      comp.score.toString(),
      comp.maxScore.toString(),
      comp.remarks.substring(0, 50) + (comp.remarks.length > 50 ? '...' : ''),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175] },
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Risk Score: ${data.camData.riskScoring.totalScore}/${data.camData.riskScoring.maxTotalScore}`, 14, yPos);
  doc.text(`Risk Grade: ${data.camData.riskScoring.riskGrade} (${data.camData.riskScoring.riskCategory})`, 100, yPos);
  yPos += 15;

  checkPageBreak();

  // Proposed Loan Terms
  addHeader('Proposed Loan Terms');

  const termsData = [
    ['Sanctioned Amount', formatCurrency(data.camData.proposedTerms.sanctionedAmount)],
    ['Interest Rate', `${data.camData.proposedTerms.interestRate}% p.a.`],
    ['Tenure', `${data.camData.proposedTerms.tenure} months`],
    ['EMI Amount', formatCurrency(data.camData.proposedTerms.emiAmount)],
    ['Processing Fee', `${data.camData.proposedTerms.processingFee}%`],
    ['Moratorium', `${data.camData.proposedTerms.moratoriumPeriod} months`],
    ['Repayment Mode', data.camData.proposedTerms.repaymentMode],
    ['Security Type', data.camData.proposedTerms.securityType],
    ['Security Value', formatCurrency(data.camData.proposedTerms.securityValue)],
    ['LTV Ratio', `${data.camData.proposedTerms.ltvRatio}%`],
  ];

  autoTable(doc, {
    startY: yPos,
    body: termsData,
    theme: 'plain',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;
  checkPageBreak();

  // Financial Highlights
  addSubHeader('Financial Highlights');

  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value', 'Benchmark', 'Status']],
    body: data.camData.financialHighlights.map((h) => [h.metric, h.value, h.benchmark, h.status.toUpperCase()]),
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175] },
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 15;
  checkPageBreak();

  // Bureau Analysis
  doc.addPage();
  yPos = 20;
  addHeader('Credit Bureau Analysis');

  addSubHeader('Commercial Bureau Summary');
  autoTable(doc, {
    startY: yPos,
    body: [
      ['CMR Score', data.commercialBureauSummary.cmrScore.toString()],
      ['Interpretation', data.commercialBureauSummary.cmrInterpretation],
      ['Total Accounts', data.commercialBureauSummary.totalAccounts.toString()],
      ['Active Accounts', data.commercialBureauSummary.activeAccounts.toString()],
      ['Total Sanctioned', formatCurrency(data.commercialBureauSummary.totalSanctionedAmount)],
      ['Total Outstanding', formatCurrency(data.commercialBureauSummary.totalOutstandingAmount)],
    ],
    theme: 'plain',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;

  addSubHeader('Individual Bureau Summary');
  autoTable(doc, {
    startY: yPos,
    body: [
      ['Credit Score', data.individualBureauSummary.creditScore.toString()],
      ['Applicant', data.individualBureauSummary.applicantName],
      ['Total Accounts', data.individualBureauSummary.totalAccounts.toString()],
      ['Active Accounts', data.individualBureauSummary.activeAccounts.toString()],
      ['Overdue Accounts', data.individualBureauSummary.overdueAccounts.toString()],
      ['Has Write-offs', data.individualBureauSummary.hasWriteOffs ? 'Yes' : 'No'],
      ['Has Settlements', data.individualBureauSummary.hasSettlements ? 'Yes' : 'No'],
    ],
    theme: 'plain',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 15;
  checkPageBreak();

  // Existing Loans
  addSubHeader('Commercial Loans');
  autoTable(doc, {
    startY: yPos,
    head: [['Product Type', 'Loan Amount', 'Outstanding', 'Status', 'Lender']],
    body: data.commercialLoans.map((loan) => [
      loan.productType,
      formatCurrency(loan.loanAmount),
      formatCurrency(loan.outstandingAmount),
      loan.status,
      loan.lenderName,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175] },
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 15;
  checkPageBreak();

  // GST Analysis
  doc.addPage();
  yPos = 20;
  addHeader('GST Analysis');

  autoTable(doc, {
    startY: yPos,
    body: [
      ['GSTIN', data.gstEntityDetails.gstin],
      ['Legal Name', data.gstEntityDetails.legalName],
      ['Trade Name', data.gstEntityDetails.tradeName],
      ['PAN', data.gstEntityDetails.pan],
    ],
    theme: 'plain',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Banking Analysis
  addHeader('Banking Analysis');

  if (data.bankAccounts.length > 0) {
    const primaryAccount = data.bankAccounts[0];
    autoTable(doc, {
      startY: yPos,
      body: [
        ['Account Name', primaryAccount.accountName],
        ['Bank Name', primaryAccount.bankName],
        ['Account Type', primaryAccount.accountType],
        ['Account Number', primaryAccount.maskedAccountNumber],
        ['Total Credits', formatCurrency(data.transactionSummary.totalCredits)],
        ['Total Debits', formatCurrency(data.transactionSummary.totalDebits)],
        ['Total Transactions', data.transactionSummary.totalTransactions.toString()],
        ['Analysis Period', `${data.transactionSummary.analysisPeriods} months`],
      ],
      theme: 'plain',
      styles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
      margin: { left: 14, right: 14 },
    });
  }

  yPos = doc.lastAutoTable.finalY + 15;
  checkPageBreak();

  // Fraud Assessment
  addHeader('Fraud Assessment');

  addSubHeader('Lumpsum Patterns');
  autoTable(doc, {
    startY: yPos,
    body: [
      ['Total Clusters', data.lumpsumPatterns.totalClusters.toString()],
      ['Total Transactions', data.lumpsumPatterns.totalTransactions.toString()],
      ['Total Debit Amount', formatCurrency(data.lumpsumPatterns.totalDebitAmount)],
      ['Risk Level', data.lumpsumPatterns.riskLevel],
    ],
    theme: 'plain',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;

  addSubHeader('Recurring Patterns');
  autoTable(doc, {
    startY: yPos,
    body: [
      ['Total Clusters', data.recurringPatterns.totalClusters.toString()],
      ['Total Transactions', data.recurringPatterns.totalTransactions.toString()],
      ['Total Debit Exposure', formatCurrency(data.recurringPatterns.totalDebitExposure)],
      ['Risk Level', data.recurringPatterns.riskLevel],
    ],
    theme: 'plain',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;

  addSubHeader('Round Tripping');
  autoTable(doc, {
    startY: yPos,
    body: [
      ['Clusters Found', data.roundTripping.clustersFound ? 'Yes' : 'No'],
      ['Total Chains', data.roundTripping.totalChains.toString()],
      ['Risk Level', data.roundTripping.riskLevel],
    ],
    theme: 'plain',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 5;
  doc.setFontSize(8);
  const summaryLines = doc.splitTextToSize(data.roundTripping.summary, pageWidth - 28);
  doc.text(summaryLines, 14, yPos);
  yPos += summaryLines.length * 4 + 15;

  checkPageBreak();

  // Personal Discussion
  doc.addPage();
  yPos = 20;
  addHeader('Personal Discussion Summary');

  addSubHeader('Applicant Details');
  autoTable(doc, {
    startY: yPos,
    body: [
      ['Name', data.personalData.applicantDetails.name],
      ['Designation', data.personalData.applicantDetails.designation],
      ['Interview Date', formatDate(data.personalData.applicantDetails.interviewDate)],
      ['Interview Mode', data.personalData.applicantDetails.interviewMode],
      ['Interviewed By', data.personalData.applicantDetails.interviewedBy],
    ],
    theme: 'plain',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;

  addSubHeader('Business Details');
  autoTable(doc, {
    startY: yPos,
    body: [
      ['Business Name', data.personalData.businessDetails.businessName],
      ['Constitution', data.personalData.businessDetails.constitution],
      ['Years in Business', data.personalData.businessDetails.yearsInBusiness.toString()],
      ['Industry', data.personalData.businessDetails.industry],
      ['Employees', data.personalData.businessDetails.numberOfEmployees.toString()],
      ['Premises', data.personalData.businessDetails.businessPremises],
    ],
    theme: 'plain',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;

  addSubHeader('Character Assessment');
  autoTable(doc, {
    startY: yPos,
    body: [
      ['First Impression', data.personalData.characterAssessment.firstImpression],
      ['Communication', data.personalData.characterAssessment.communicationSkills],
      ['Transparency', data.personalData.characterAssessment.transparency],
      ['Business Knowledge', data.personalData.characterAssessment.businessKnowledge],
      ['Repayment Attitude', data.personalData.characterAssessment.attitudeToRepayment],
    ],
    theme: 'plain',
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Impression:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 5;
  const impressionLines = doc.splitTextToSize(data.personalData.characterAssessment.overallImpression, pageWidth - 28);
  doc.text(impressionLines, 14, yPos);
  yPos += impressionLines.length * 5 + 10;

  checkPageBreak();

  // Discussion Summary
  addSubHeader('Key Strengths');
  data.personalData.summary.strengths.forEach((s, idx) => {
    checkPageBreak(10);
    doc.setFontSize(8);
    doc.text(`${idx + 1}. ${s}`, 16, yPos);
    yPos += 5;
  });
  yPos += 5;

  addSubHeader('Key Concerns');
  data.personalData.summary.concerns.forEach((c, idx) => {
    checkPageBreak(10);
    doc.setFontSize(8);
    doc.text(`${idx + 1}. ${c}`, 16, yPos);
    yPos += 5;
  });
  yPos += 10;

  checkPageBreak();

  // Final Recommendation
  doc.addPage();
  yPos = 20;
  addHeader('Final Recommendation');

  // Decision Box
  const decisionColor = data.camData.recommendation.decision === 'Approve' 
    ? [34, 197, 94] 
    : data.camData.recommendation.decision === 'Reject' 
      ? [239, 68, 68] 
      : [234, 179, 8];
  
  doc.setFillColor(decisionColor[0], decisionColor[1], decisionColor[2]);
  doc.roundedRect(14, yPos, pageWidth - 28, 15, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Decision: ${data.camData.recommendation.decision.toUpperCase()}`, pageWidth / 2, yPos + 10, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPos += 25;

  // Rationale
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Rationale:', 14, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const rationaleLines = doc.splitTextToSize(data.camData.recommendation.rationale, pageWidth - 28);
  doc.text(rationaleLines, 14, yPos);
  yPos += rationaleLines.length * 4 + 10;

  // Conditions
  addSubHeader('Conditions for Approval');
  data.camData.recommendation.conditions.forEach((c, idx) => {
    checkPageBreak(10);
    doc.setFontSize(8);
    const conditionLines = doc.splitTextToSize(`${idx + 1}. ${c}`, pageWidth - 32);
    doc.text(conditionLines, 16, yPos);
    yPos += conditionLines.length * 4 + 2;
  });
  yPos += 5;

  // Mitigants
  addSubHeader('Risk Mitigants');
  data.camData.recommendation.mitigants.forEach((m, idx) => {
    checkPageBreak(10);
    doc.setFontSize(8);
    const mitigantLines = doc.splitTextToSize(`${idx + 1}. ${m}`, pageWidth - 32);
    doc.text(mitigantLines, 16, yPos);
    yPos += mitigantLines.length * 4 + 2;
  });

  yPos += 15;
  checkPageBreak();

  // Approval Workflow
  addSubHeader('Approval Workflow Status');
  autoTable(doc, {
    startY: yPos,
    head: [['Stage', 'Role', 'Name', 'Status', 'Date']],
    body: data.camData.approvalWorkflow.steps.map((step) => [
      step.id,
      step.role,
      step.name,
      step.status.toUpperCase(),
      step.timestamp ? formatDate(step.timestamp) : 'Pending',
    ]),
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175] },
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 20;

  // Signature Section
  checkPageBreak(50);
  doc.setDrawColor(200, 200, 200);
  doc.line(14, yPos, 80, yPos);
  doc.line(pageWidth - 80, yPos, pageWidth - 14, yPos);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  yPos += 5;
  doc.text(data.camData.recommendation.analystName, 14, yPos);
  doc.text('Approving Authority', pageWidth - 80, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text(data.camData.recommendation.analystDesignation, 14, yPos);
  doc.text(`Date: ${formatDate(data.camData.recommendation.recommendationDate)}`, 14, yPos + 5);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated on ${formatDate(new Date())} | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text('Confidential - For Internal Use Only', pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' });
  }

  // Save the PDF
  doc.save(`Loan_Analysis_${data.loanId}_${formatDate(new Date()).replace(/\s/g, '_')}.pdf`);
};
