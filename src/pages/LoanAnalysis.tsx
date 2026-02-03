import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoan } from '@/hooks/useLoans';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { PolicySection } from '@/components/analysis/PolicySection';
import { RiskSummary } from '@/components/analysis/RiskSummary';
import { BureauSummary } from '@/components/bureau/BureauSummary';
import { BureauLoans } from '@/components/bureau/BureauLoans';
import { BureauEnquiries } from '@/components/bureau/BureauEnquiries';
import { BureauRelationships } from '@/components/bureau/BureauRelationships';
import { PaymentDelays } from '@/components/bureau/PaymentDelays';
import { BureauBounceAnalysis } from '@/components/bureau/BureauBounceAnalysis';
import { BureauCashFlow } from '@/components/bureau/BureauCashFlow';
import { GSTEntityOverview } from '@/components/gst/GSTEntityOverview';
import { GSTRevenueITC } from '@/components/gst/GSTRevenueITC';
import { GSTFilingDelays } from '@/components/gst/GSTFilingDelays';
import { GSTParties } from '@/components/gst/GSTParties';
import { BankingAccountOverview } from '@/components/banking/BankingAccountOverview';
import { useBankStatements } from '@/hooks/useLoans';
import { BankingCashFlow } from '@/components/banking/BankingCashFlow';
import { BankingBalances } from '@/components/banking/BankingBalances';
import { BankingBounceAnalysis } from '@/components/banking/BankingBounceAnalysis';
import { LumpsumPatterns } from '@/components/fraud/LumpsumPatterns';
import { RecurringPatterns } from '@/components/fraud/RecurringPatterns';
import { RoundTripping } from '@/components/fraud/RoundTripping';
import { ApplicantDetailsCard } from '@/components/personal/ApplicantDetailsCard';
import { InterviewNotes } from '@/components/personal/InterviewNotes';
import { DiscussionSummaryCard } from '@/components/personal/DiscussionSummaryCard';
import { RiskScoringCard } from '@/components/cam/RiskScoringCard';
import { ProposedTermsCard } from '@/components/cam/ProposedTermsCard';
import { FinalRecommendationCard } from '@/components/cam/FinalRecommendationCard';
import {
  mockLoans,
  bureauCompanyPolicies,
  bureauOtherPolicies,
  bankingCompanyPolicies,
  bankingOtherPolicies,
  gstCompanyPolicies,
  gstOtherPolicies,
  crossDocPolicies,
  mockRiskAssessment,
} from '@/lib/mockData';
import {
  mockGSTEntityDetails,
  mockGSTAISummary,
  mockRevenueComparison,
  mockITCComparison,
  mockAnnualGrossAnalysis,
  mockAnnualNetAnalysis,
  mockFilingDelays,
  mockTopSuppliers,
  mockTopCustomers,
  mockCommonParties,
} from '@/lib/gstMockData';
import {
  mockBankAccounts,
  mockTransactionSummary,
  mockBankingConductAnalysis,
  mockCashFlowPatterns,
  mockBalanceBehavior,
  mockBankingRedFlags,
  mockAIBankingAssessment,
  mockOutwardChequeBounce,
  mockInwardChequeBounce,
  mockBankingEMIBounce,
  mockCashVsNonCash,
  mockMonthlyBalances,
} from '@/lib/bankingMockData';
import {
  mockLumpsumPatternAnalysis,
  mockRecurringPatternAnalysis,
  mockRoundTrippingAnalysis,
} from '@/lib/fraudMockData';
import { mockPersonalDiscussionData } from '@/lib/personalDiscussionMockData';
import { mockCAMData } from '@/lib/camMockData';
import {
  mockCommercialBureauSummary,
  mockIndividualBureauSummary,
  mockAIBureauInsights,
  mockCommercialLoans,
  mockIndividualLoans,
  mockCommercialLoanSummary,
  mockIndividualLoanSummary,
  mockBureauEnquiries,
  mockEnquiryMetrics,
  mockBureauRelationships,
  mockPaymentDelays,
  mockBureauBounceAnalysis,
  mockEMIBounceAnalysis,
} from '@/lib/bureauMockData';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  IndianRupee,
  User,
  Calendar,
  FileBarChart,
  Landmark,
  Receipt,
  Sparkles,
  MessageSquare,
  FileText,
  Shield,
  AlertTriangle,
  CreditCard,
  Search,
  Users,
  Clock,
  TrendingDown,
  Activity,
  Wallet,
  Layers,
  RefreshCw,
  GitBranch,
  Download,
} from 'lucide-react';
import { generateLoanAnalysisPDF } from '@/lib/pdfExport';
import { format } from 'date-fns';

const mainTabs = [
  { id: 'pre-approval', label: 'Pre-Approval', icon: Shield },
  { id: 'bureau', label: 'Bureau', icon: FileBarChart },
  { id: 'gst', label: 'GST', icon: Receipt },
  { id: 'banking', label: 'Banking', icon: Landmark },
  { id: 'fraud', label: 'Fraud Assessment', icon: AlertTriangle },
  { id: 'personal', label: 'Personal Discussion', icon: MessageSquare },
  { id: 'cam', label: 'Credit Assessment Memo', icon: FileText },
];

const preApprovalSubTabs = [
  { id: 'bureau-analysis', label: 'Bureau Analysis' },
  { id: 'banking-analysis', label: 'Banking Analysis' },
  { id: 'gst-analysis', label: 'GST Analysis' },
  { id: 'cross-doc', label: 'Cross Document Analysis' },
  { id: 'ai-summary', label: 'AI Summary' },
];

const bureauSubTabs = [
  { id: 'summary', label: 'Summary', icon: FileBarChart },
  { id: 'loans', label: 'Loans', icon: CreditCard },
  { id: 'enquiries', label: 'Enquiries', icon: Search },
  { id: 'relationships', label: 'Relationships', icon: Users },
  { id: 'payment-delays', label: 'Payment Delays', icon: Clock },
  { id: 'bounce-analysis', label: 'Bounce Analysis', icon: TrendingDown },
  { id: 'cash-flow', label: 'Cash Flow', icon: Activity },
];

const gstSubTabs = [
  { id: 'overview', label: 'Entity Overview', icon: Building2 },
  { id: 'revenue-itc', label: 'Revenue & ITC', icon: Receipt },
  { id: 'filing-delays', label: 'Filing Delays', icon: Clock },
  { id: 'parties', label: 'Suppliers & Customers', icon: Users },
];

const bankingSubTabs = [
  { id: 'overview', label: 'Account Overview', icon: Building2 },
  { id: 'cash-flow', label: 'Cash Flow', icon: Activity },
  { id: 'balances', label: 'Balance Analysis', icon: Wallet },
  { id: 'bounce', label: 'Bounce Analysis', icon: TrendingDown },
];

const fraudSubTabs = [
  { id: 'lumpsum', label: 'Lumpsum Patterns', icon: Layers },
  { id: 'recurring', label: 'Recurring Patterns', icon: Activity },
  { id: 'round-tripping', label: 'Round Tripping', icon: RefreshCw },
];

const personalSubTabs = [
  { id: 'applicant', label: 'Applicant Details', icon: User },
  { id: 'interview', label: 'Interview Notes', icon: MessageSquare },
  { id: 'summary', label: 'Discussion Summary', icon: FileText },
];

const camSubTabs = [
  { id: 'risk-scoring', label: 'Risk Scoring', icon: Shield },
  { id: 'loan-terms', label: 'Loan Terms', icon: FileText },
  { id: 'recommendation', label: 'Final Recommendation', icon: Sparkles },
];

export default function LoanAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = typeof window !== 'undefined' ? new URL(window.location.href) : null;
  const [activeMainTab, setActiveMainTab] = useState('pre-approval');
  const [activeSubTab, setActiveSubTab] = useState('bureau-analysis');
  const [activeBureauSubTab, setActiveBureauSubTab] = useState('summary');
  const [activeGSTSubTab, setActiveGSTSubTab] = useState('overview');
  const [activeBankingSubTab, setActiveBankingSubTab] = useState('overview');
  const [activeFraudSubTab, setActiveFraudSubTab] = useState('lumpsum');
  const [activePersonalSubTab, setActivePersonalSubTab] = useState('applicant');
  const [activeCAMSubTab, setActiveCAMSubTab] = useState('risk-scoring');

  // Prefer DB-backed loan (useLoan). Only fall back to mock data when BOTH the dev env flag
  // and an explicit query param are present (safe developer-only demo mode).
  // This prevents mock values (e.g. "Diamond Agencies") from appearing as real data in normal runs.
  const { data: dbLoan, isLoading: dbLoading } = useLoan(id);
  const envEnableMocks = import.meta.env.VITE_ENABLE_MOCKS === 'true';
  const enableMocks = envEnableMocks && Boolean(location && new URLSearchParams(location.search).get('demo'));

  const normalizeDbLoan = (l: any) => {
    if (!l) return null;
    return {
      id: l.id || l.application_id,
      customerName: l.customer_name || l.customerName || '—',
      loanAmount: l.loan_amount != null ? Number(l.loan_amount) : l.loanAmount || 0,
      loanType: l.loan_type || l.loanType || 'Working Capital',
      assignedAnalyst: l.profiles?.full_name || l.assigned_analyst_id || l.assignedAnalyst || '—',
      status: l.status || 'under-review',
      createdAt: l.created_at ? new Date(l.created_at) : l.createdAt,
      updatedAt: l.updated_at ? new Date(l.updated_at) : l.updatedAt,
      teamName: l.team || l.teamName,
    };
  };

  // Resolve priority: DB row -> mock (only if enabled) -> null
  const loanFromDb = normalizeDbLoan(dbLoan);
  const loanFromMock = enableMocks ? mockLoans.find((l) => l.id === id) || mockLoans[0] : null;
  const loan = loanFromDb ?? loanFromMock ?? null;

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Crore`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Loading / empty-state guards
  if (dbLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Loading loan…</p>
          </div>
        </main>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">No loan found</h2>
            <p className="mt-2 text-sm text-muted-foreground">There is no loan with that id in the database. To view demo data only (developer mode), set <code>VITE_ENABLE_MOCKS=true</code> in your <code>.env</code> and open this page with <code>?demo=true</code> in the URL.</p>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => window.history.back()}>Back</Button>
              <Button onClick={() => navigate('/new-application')} variant="secondary">Create new application</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Visible demo indicator when mock data is being used intentionally */}
        {loanFromMock && !loanFromDb && (
          <div className="mb-4 -ml-2">
            <div className="inline-flex items-center gap-3 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-amber-800 text-sm font-semibold">
              <svg width="12" height="12" viewBox="0 0 24 24" className="inline-block"><circle cx="12" cy="12" r="12" fill="#92400E"/></svg>
              DEMO DATA — not persisted (use <code className="font-mono">?demo=true</code> to enable)
            </div>
          </div>
        )}

        {/* Loan Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-border bg-card shadow-card overflow-hidden">
            <div className="gradient-primary p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-display text-2xl font-bold text-primary-foreground">
                      {loan.customerName}
                    </h1>
                    <StatusBadge variant="under-review" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                      {loan.status}
                    </StatusBadge>
                  </div>
                  <p className="sr-only">{loan.id}</p>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-primary-foreground">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-primary-foreground/70" />
                    <div>
                      <p className="text-xs text-primary-foreground/70">Loan Amount</p>
                      <p className="font-display font-bold">{formatAmount(loan.loanAmount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary-foreground/70" />
                    <div>
                      <p className="text-xs text-primary-foreground/70">Loan Type</p>
                      <p className="font-medium">{loan.loanType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary-foreground/70" />
                    <div>
                      <p className="text-xs text-primary-foreground/70">Analyst</p>
                      <p className="font-medium">{loan.assignedAnalyst}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary-foreground/70" />
                    <div>
                      <p className="text-xs text-primary-foreground/70">Last Updated</p>
                      <p className="font-medium">{format(loan.updatedAt, 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20"
                    onClick={() => {
                      generateLoanAnalysisPDF({
                        loanId: loan.id,
                        customerName: loan.customerName,
                        loanAmount: loan.loanAmount,
                        camData: mockCAMData,
                        personalData: mockPersonalDiscussionData,
                        commercialBureauSummary: mockCommercialBureauSummary,
                        individualBureauSummary: mockIndividualBureauSummary,
                        commercialLoans: mockCommercialLoans,
                        individualLoans: mockIndividualLoans,
                        commercialLoanSummary: mockCommercialLoanSummary,
                        individualLoanSummary: mockIndividualLoanSummary,
                        gstEntityDetails: mockGSTEntityDetails,
                        bankAccounts: mockBankAccounts,
                        transactionSummary: mockTransactionSummary,
                        lumpsumPatterns: mockLumpsumPatternAnalysis,
                        recurringPatterns: mockRecurringPatternAnalysis,
                        roundTripping: mockRoundTrippingAnalysis,
                      });
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="space-y-6">
          <TabsList className="bg-card border border-border p-1 h-auto flex-wrap">
            {mainTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:gradient-accent data-[state=active]:text-accent-foreground flex items-center gap-2 px-4 py-2"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Pre-Approval Content */}
          <TabsContent value="pre-approval" className="space-y-6">
            {/* Sub Tabs */}
            <Card className="border-border bg-card shadow-card">
              <CardContent className="p-2">
                <div className="flex flex-wrap gap-2">
                  {preApprovalSubTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeSubTab === tab.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveSubTab(tab.id)}
                      className={activeSubTab === tab.id ? 'gradient-accent text-accent-foreground' : ''}
                    >
                      {tab.id === 'ai-summary' && <Sparkles className="mr-1.5 h-4 w-4" />}
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sub Tab Content */}
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeSubTab === 'bureau-analysis' && (
                <div className="space-y-8">
                  <PolicySection title="Company Policies" policies={bureauCompanyPolicies} />
                  <PolicySection title="Other Policies" policies={bureauOtherPolicies} />
                </div>
              )}

              {activeSubTab === 'banking-analysis' && (
                <div className="space-y-8">
                  <PolicySection title="Company Policies" policies={bankingCompanyPolicies} />
                  <PolicySection title="Other Policies" policies={bankingOtherPolicies} />
                </div>
              )}

              {activeSubTab === 'gst-analysis' && (
                <div className="space-y-8">
                  <PolicySection title="Company Policies" policies={gstCompanyPolicies} />
                  <PolicySection title="Other Policies" policies={gstOtherPolicies} />
                </div>
              )}

              {activeSubTab === 'cross-doc' && (
                <PolicySection title="Cross Document Policies" policies={crossDocPolicies} />
              )}

              {activeSubTab === 'ai-summary' && (
                <RiskSummary assessment={mockRiskAssessment} />
              )}
            </motion.div>
          </TabsContent>

          {/* Bureau Tab Content */}
          <TabsContent value="bureau" className="space-y-6">
            {/* Bureau Sub Tabs */}
            <Card className="border-border bg-card shadow-card">
              <CardContent className="p-2">
                <div className="flex flex-wrap gap-2">
                  {bureauSubTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeBureauSubTab === tab.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveBureauSubTab(tab.id)}
                      className={activeBureauSubTab === tab.id ? 'gradient-accent text-accent-foreground' : ''}
                    >
                      <tab.icon className="mr-1.5 h-4 w-4" />
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bureau Sub Tab Content */}
            <motion.div
              key={activeBureauSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeBureauSubTab === 'summary' && (
                <BureauSummary
                  commercial={mockCommercialBureauSummary}
                  individual={mockIndividualBureauSummary}
                  aiInsights={mockAIBureauInsights}
                />
              )}

              {activeBureauSubTab === 'loans' && (
                <BureauLoans
                  commercialLoans={mockCommercialLoans}
                  individualLoans={mockIndividualLoans}
                  commercialSummary={mockCommercialLoanSummary}
                  individualSummary={mockIndividualLoanSummary}
                />
              )}

              {activeBureauSubTab === 'enquiries' && (
                <BureauEnquiries
                  enquiries={mockBureauEnquiries}
                  metrics={mockEnquiryMetrics}
                />
              )}

              {activeBureauSubTab === 'relationships' && (
                <BureauRelationships relationships={mockBureauRelationships} />
              )}

              {activeBureauSubTab === 'payment-delays' && (
                <PaymentDelays delays={mockPaymentDelays} />
              )}

              {activeBureauSubTab === 'bounce-analysis' && (
                <BureauBounceAnalysis
                  chequeBounce={mockBureauBounceAnalysis}
                  emiBounce={mockEMIBounceAnalysis}
                />
              )}

              {activeBureauSubTab === 'cash-flow' && (
                <BureauCashFlow />
              )}
            </motion.div>
          </TabsContent>

          {/* GST Tab Content */}
          <TabsContent value="gst" className="space-y-6">
            {/* GST Sub Tabs */}
            <Card className="border-border bg-card shadow-card">
              <CardContent className="p-2">
                <div className="flex flex-wrap gap-2">
                  {gstSubTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeGSTSubTab === tab.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveGSTSubTab(tab.id)}
                      className={activeGSTSubTab === tab.id ? 'gradient-accent text-accent-foreground' : ''}
                    >
                      <tab.icon className="mr-1.5 h-4 w-4" />
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* GST Sub Tab Content */}
            <motion.div
              key={activeGSTSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeGSTSubTab === 'overview' && (
                <GSTEntityOverview
                  entityDetails={mockGSTEntityDetails}
                  aiSummary={mockGSTAISummary}
                />
              )}

              {activeGSTSubTab === 'revenue-itc' && (
                <GSTRevenueITC
                  revenueComparison={mockRevenueComparison}
                  itcComparison={mockITCComparison}
                  grossAnalysis={mockAnnualGrossAnalysis}
                  netAnalysis={mockAnnualNetAnalysis}
                />
              )}

              {activeGSTSubTab === 'filing-delays' && (
                <GSTFilingDelays filingDelays={mockFilingDelays} />
              )}

              {activeGSTSubTab === 'parties' && (
                <GSTParties
                  topSuppliers={mockTopSuppliers}
                  topCustomers={mockTopCustomers}
                  commonParties={mockCommonParties}
                />
              )}
            </motion.div>
          </TabsContent>

          {/* Banking Tab Content */}
          <TabsContent value="banking" className="space-y-6">
            {/* Banking Sub Tabs */}
            <Card className="border-border bg-card shadow-card">
              <CardContent className="p-2">
                <div className="flex flex-wrap gap-2">
                  {bankingSubTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeBankingSubTab === tab.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveBankingSubTab(tab.id)}
                      className={activeBankingSubTab === tab.id ? 'gradient-accent text-accent-foreground' : ''}
                    >
                      <tab.icon className="mr-1.5 h-4 w-4" />
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Banking Sub Tab Content */}
            <motion.div
              key={activeBankingSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeBankingSubTab === 'overview' && (
                (() => {
                  const { data: dbStmts } = useBankStatements(id);

                  // If DB has parsed statements, prefer them over mocks
                  if (Array.isArray(dbStmts) && dbStmts.length > 0) {
                    const accounts = dbStmts.map((s: any) => ({
                      id: s.id,
                      maskedAccountNumber: s.account_mask || (s.account_number ? `XXXX${String(s.account_number).slice(-4)}` : '—'),
                      bankName: (s.meta && s.meta.bank_name) || '—',
                      accountType: 'Current Account' as const,
                      branchName: s.meta?.branch || undefined,
                      ifscCode: s.meta?.ifsc || undefined,
                      accountName: s.account_number || '—',
                      statementPeriod: s.statement_from && s.statement_to ? `${new Date(s.statement_from).toLocaleDateString()} - ${new Date(s.statement_to).toLocaleDateString()}` : '—',
                    }));

                    const allTx = (dbStmts || []).flatMap((s: any) => (s.bank_transactions || []));
                    const totalCredits = allTx.filter((t: any) => t.direction === 'credit').reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);
                    const totalDebits = allTx.filter((t: any) => t.direction === 'debit').reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);
                    const months = dbStmts.reduce((acc: Set<string>, s: any) => {
                      if (s.statement_from && s.statement_to) {
                        acc.add(`${s.statement_from}_${s.statement_to}`);
                      }
                      return acc;
                    }, new Set()).size || 6;

                    const transactionSummary = {
                      totalCredits,
                      totalDebits,
                      totalTransactions: allTx.length,
                      analysisPeriods: months,
                    };

                    return (
                      <BankingAccountOverview
                        accounts={accounts}
                        transactionSummary={transactionSummary}
                        conductAnalysis={mockBankingConductAnalysis}
                        redFlags={mockBankingRedFlags}
                        aiAssessment={mockAIBankingAssessment}
                      />
                    );
                  }

                  // fallback to mocks
                  return (
                    <BankingAccountOverview
                      accounts={mockBankAccounts}
                      transactionSummary={mockTransactionSummary}
                      conductAnalysis={mockBankingConductAnalysis}
                      redFlags={mockBankingRedFlags}
                      aiAssessment={mockAIBankingAssessment}
                    />
                  );
                })()
              )}

              {activeBankingSubTab === 'cash-flow' && (
                <BankingCashFlow
                  cashFlowPatterns={mockCashFlowPatterns}
                  cashVsNonCash={mockCashVsNonCash}
                />
              )}

              {activeBankingSubTab === 'balances' && (
                <BankingBalances
                  monthlyBalances={mockMonthlyBalances}
                  balanceBehavior={mockBalanceBehavior}
                />
              )}

              {activeBankingSubTab === 'bounce' && (
                <BankingBounceAnalysis
                  outwardBounce={mockOutwardChequeBounce}
                  inwardBounce={mockInwardChequeBounce}
                  emiBounce={mockBankingEMIBounce}
                />
              )}
            </motion.div>
          </TabsContent>

          {/* Fraud Assessment Tab Content */}
          <TabsContent value="fraud" className="space-y-6">
            {/* Fraud Sub Tabs */}
            <Card className="border-border bg-card shadow-card">
              <CardContent className="p-2">
                <div className="flex flex-wrap gap-2">
                  {fraudSubTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeFraudSubTab === tab.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveFraudSubTab(tab.id)}
                      className={activeFraudSubTab === tab.id ? 'gradient-accent text-accent-foreground' : ''}
                    >
                      <tab.icon className="mr-1.5 h-4 w-4" />
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fraud Sub Tab Content */}
            <motion.div
              key={activeFraudSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeFraudSubTab === 'lumpsum' && (
                <LumpsumPatterns data={mockLumpsumPatternAnalysis} />
              )}

              {activeFraudSubTab === 'recurring' && (
                <RecurringPatterns data={mockRecurringPatternAnalysis} />
              )}

              {activeFraudSubTab === 'round-tripping' && (
                <RoundTripping data={mockRoundTrippingAnalysis} />
              )}
            </motion.div>
          </TabsContent>

          {/* Personal Discussion Tab Content */}
          <TabsContent value="personal" className="space-y-6">
            {/* Personal Sub Tabs */}
            <Card className="border-border bg-card shadow-card">
              <CardContent className="p-2">
                <div className="flex flex-wrap gap-2">
                  {personalSubTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activePersonalSubTab === tab.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActivePersonalSubTab(tab.id)}
                      className={activePersonalSubTab === tab.id ? 'gradient-accent text-accent-foreground' : ''}
                    >
                      <tab.icon className="mr-1.5 h-4 w-4" />
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal Sub Tab Content */}
            <motion.div
              key={activePersonalSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activePersonalSubTab === 'applicant' && (
                <ApplicantDetailsCard
                  applicant={mockPersonalDiscussionData.applicantDetails}
                  business={mockPersonalDiscussionData.businessDetails}
                />
              )}

              {activePersonalSubTab === 'interview' && (
                <InterviewNotes
                  notes={mockPersonalDiscussionData.interviewNotes}
                  financials={mockPersonalDiscussionData.financialDiscussion}
                  character={mockPersonalDiscussionData.characterAssessment}
                />
              )}

              {activePersonalSubTab === 'summary' && (
                <DiscussionSummaryCard summary={mockPersonalDiscussionData.summary} />
              )}
            </motion.div>
          </TabsContent>

          {/* CAM Tab Content */}
          <TabsContent value="cam" className="space-y-6">
            {/* CAM Sub Tabs */}
            <Card className="border-border bg-card shadow-card">
              <CardContent className="p-2">
                <div className="flex flex-wrap gap-2">
                  {camSubTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeCAMSubTab === tab.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveCAMSubTab(tab.id)}
                      className={activeCAMSubTab === tab.id ? 'gradient-accent text-accent-foreground' : ''}
                    >
                      <tab.icon className="mr-1.5 h-4 w-4" />
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CAM Sub Tab Content */}
            <motion.div
              key={activeCAMSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeCAMSubTab === 'risk-scoring' && (
                <RiskScoringCard riskScoring={mockCAMData.riskScoring} />
              )}

              {activeCAMSubTab === 'loan-terms' && (
                <ProposedTermsCard
                  terms={mockCAMData.proposedTerms}
                  financialHighlights={mockCAMData.financialHighlights}
                />
              )}


              {activeCAMSubTab === 'recommendation' && (
                <FinalRecommendationCard recommendation={mockCAMData.recommendation} loanId={id} />
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
