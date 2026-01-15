import {
  GSTEntityDetails,
  GSTAISummary,
  RevenueComparison,
  ITCComparison,
  AnnualGrossAnalysis,
  AnnualNetAnalysis,
  FilingDelay,
  TopParty,
  CommonParty,
} from '@/types/gst';

// GST Entity Details
export const mockGSTEntityDetails: GSTEntityDetails = {
  gstin: '06AABCD1234E1Z5',
  legalName: 'Diamond Agencies Private Limited',
  tradeName: 'Diamond Agencies',
  pan: 'AABCD1234E',
};

// GST AI Summary
export const mockGSTAISummary: GSTAISummary = {
  turnoverAnalysis: {
    totalTurnover: 42500000,
    peakMonth: 'March 2024 - ₹5.2 Cr',
    lowestMonth: 'June 2024 - ₹2.1 Cr',
    yoyGrowth: 18.5,
    currentPeriod: 'Aug 2024 – Jul 2025',
    previousPeriod: 'Aug 2023 – Jul 2024',
  },
  strengths: [
    'Consistent and timely GST filings with 95% on-time rate',
    'Strong monthly turnover averaging ₹3.5 Cr',
    'Positive YoY growth of 18.5% indicating business expansion',
    'Good ITC reconciliation with minimal variance',
  ],
  overallAssessment: 'The entity demonstrates strong GST compliance with timely filings and consistent revenue generation. The 18.5% YoY growth indicates healthy business expansion. ITC claims are well-aligned with GSTR-2A data, suggesting proper vendor management. Minor seasonality observed but within expected business cycles. Overall, the GST profile supports creditworthiness.',
};

// Revenue Comparison
export const mockRevenueComparison: RevenueComparison = {
  gstr1Revenue: 42500000,
  gstr3bRevenue: 41800000,
  variancePercentage: 1.65,
};

// ITC Comparison
export const mockITCComparison: ITCComparison = {
  gstr3bITC: 3200000,
  gstr2aITC: 3150000,
  variancePercentage: 1.59,
  analysisPeriod: 'Rolling 12 Months',
};

// Annual Analysis
export const mockAnnualGrossAnalysis: AnnualGrossAnalysis = {
  currentPeriodRevenue: 42500000,
  previousPeriodRevenue: 35800000,
  yoyRevenueGrowth: 18.72,
  currentPeriodPurchases: 32000000,
  previousPeriodPurchases: 27500000,
};

export const mockAnnualNetAnalysis: AnnualNetAnalysis = {
  netRevenue: 39800000,
  netPurchases: 29500000,
  yoyNetChange: 16.4,
};

// Filing Delays
export const mockFilingDelays: FilingDelay[] = [
  {
    year: 2025,
    months: { JAN: 0, FEB: 0, MAR: 0, APR: 0, MAY: 0, JUN: 0, JUL: 0, AUG: 0, SEP: 0, OCT: 0, NOV: 0, DEC: 0 },
  },
  {
    year: 2024,
    months: { JAN: 0, FEB: 0, MAR: 2, APR: 0, MAY: 0, JUN: 5, JUL: 0, AUG: 0, SEP: 0, OCT: 0, NOV: 0, DEC: 0 },
  },
  {
    year: 2023,
    months: { JAN: 0, FEB: 0, MAR: 0, APR: 0, MAY: 0, JUN: 0, JUL: 0, AUG: 0, SEP: 0, OCT: 3, NOV: 0, DEC: 0 },
  },
];

// Top Suppliers
export const mockTopSuppliers: TopParty[] = [
  { name: 'ABC Trading Co.', pan: 'AAACA1234B', invoiceValue: 8500000, sharePercentage: 26.5 },
  { name: 'XYZ Distributors', pan: 'AABCX5678D', invoiceValue: 6200000, sharePercentage: 19.4 },
  { name: 'Metro Supplies Ltd', pan: 'AADCM9012F', invoiceValue: 4800000, sharePercentage: 15.0 },
  { name: 'Prime Vendors Pvt Ltd', pan: 'AAECP3456H', invoiceValue: 3500000, sharePercentage: 10.9 },
  { name: 'National Traders', pan: 'AAFCN7890J', invoiceValue: 2800000, sharePercentage: 8.8 },
];

// Top Customers
export const mockTopCustomers: TopParty[] = [
  { name: 'Reliance Retail Ltd', pan: 'AABCR1234L', invoiceValue: 12000000, sharePercentage: 28.2 },
  { name: 'Future Group', pan: 'AABCF5678N', invoiceValue: 8500000, sharePercentage: 20.0 },
  { name: 'DMart Stores', pan: 'AABCD9012P', invoiceValue: 6200000, sharePercentage: 14.6 },
  { name: 'BigBasket India', pan: 'AABCB3456R', invoiceValue: 4100000, sharePercentage: 9.6 },
  { name: 'Amazon Seller Services', pan: 'AABCA7890T', invoiceValue: 3800000, sharePercentage: 8.9 },
];

// Common Parties
export const mockCommonParties: CommonParty[] = [
  {
    name: 'Metro Supplies Ltd',
    salesSharePercentage: 8.2,
    customerInvoiceValue: 3500000,
    supplierInvoiceValue: 4800000,
    totalInvoices: 45,
  },
  {
    name: 'National Traders',
    salesSharePercentage: 4.5,
    customerInvoiceValue: 1900000,
    supplierInvoiceValue: 2800000,
    totalInvoices: 28,
  },
];
