// GST Entity Types
export interface GSTEntityDetails {
  gstin: string;
  legalName: string;
  tradeName: string;
  pan: string;
}

// GST AI Summary Types
export interface GSTTurnoverAnalysis {
  totalTurnover: number;
  peakMonth: string;
  lowestMonth: string;
  yoyGrowth: number;
  currentPeriod: string;
  previousPeriod: string;
}

export interface GSTAISummary {
  turnoverAnalysis: GSTTurnoverAnalysis;
  strengths: string[];
  overallAssessment: string;
}

// Revenue & ITC Analysis Types
export interface RevenueComparison {
  gstr1Revenue: number;
  gstr3bRevenue: number;
  variancePercentage: number;
}

export interface ITCComparison {
  gstr3bITC: number;
  gstr2aITC: number;
  variancePercentage: number;
  analysisPeriod: string;
}

// Annual Summary Types
export interface AnnualGrossAnalysis {
  currentPeriodRevenue: number;
  previousPeriodRevenue: number;
  yoyRevenueGrowth: number;
  currentPeriodPurchases: number;
  previousPeriodPurchases: number;
}

export interface AnnualNetAnalysis {
  netRevenue: number;
  netPurchases: number;
  yoyNetChange: number;
}

// Filing Analysis Types
export interface FilingDelay {
  year: number;
  months: { [key: string]: number }; // Month -> delay days
}

// Parties Analysis Types
export interface TopParty {
  name: string;
  pan: string;
  invoiceValue: number;
  sharePercentage: number;
}

export interface CommonParty {
  name: string;
  salesSharePercentage: number;
  customerInvoiceValue: number;
  supplierInvoiceValue: number;
  totalInvoices: number;
}
