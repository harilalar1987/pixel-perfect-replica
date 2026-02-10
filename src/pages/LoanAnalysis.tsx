import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoan, useBankStatements } from '@/hooks/useLoans';
import { useBankingAnalytics } from '@/hooks/useBankingAnalytics';
import { useBureauAnalytics } from '@/hooks/useBureauAnalytics';
import { useGSTAnalytics } from '@/hooks/useGSTAnalytics';
import { useFraudAnalytics } from '@/hooks/useFraudAnalytics';
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
import { EmptyAnalysisState } from '@/components/EmptyAnalysisState';
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
  const [activeMainTab, setActiveMainTab] = useState('pre-approval');
  const [activeSubTab, setActiveSubTab] = useState('bureau-analysis');
  const [activeBureauSubTab, setActiveBureauSubTab] = useState('summary');
  const [activeGSTSubTab, setActiveGSTSubTab] = useState('overview');
  const [activeBankingSubTab, setActiveBankingSubTab] = useState('overview');
  const [activeFraudSubTab, setActiveFraudSubTab] = useState('lumpsum');
  const [activePersonalSubTab, setActivePersonalSubTab] = useState('applicant');
  const [activeCAMSubTab, setActiveCAMSubTab] = useState('risk-scoring');

  // DB hooks
  const { data: dbLoan, isLoading: dbLoading } = useLoan(id);
  const { data: dbBankStatements } = useBankStatements(id);
  
  // Analytics hooks - compute from real data
  const bankingAnalytics = useBankingAnalytics(dbBankStatements as any);
  const { data: bureauData } = useBureauAnalytics(id);
  const { data: gstData } = useGSTAnalytics(id);
  const fraudData = useFraudAnalytics(dbBankStatements as any);

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

  const loan = normalizeDbLoan(dbLoan);

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Crore`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

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
            <p className="mt-2 text-sm text-muted-foreground">
              There is no loan with that id in the database.
            </p>
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
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Loan Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
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
                        camData: null as any,
                        personalData: null as any,
                        commercialBureauSummary: bureauData?.commercialSummary || null as any,
                        individualBureauSummary: bureauData?.individualSummary || null as any,
                        commercialLoans: bureauData?.commercialLoans || [],
                        individualLoans: bureauData?.individualLoans || [],
                        commercialLoanSummary: bureauData?.commercialLoanSummary || null as any,
                        individualLoanSummary: bureauData?.individualLoanSummary || null as any,
                        gstEntityDetails: gstData?.entityDetails || null as any,
                        bankAccounts: bankingAnalytics?.accounts || [],
                        transactionSummary: bankingAnalytics?.transactionSummary || null as any,
                        lumpsumPatterns: fraudData?.lumpsumAnalysis || null as any,
                        recurringPatterns: fraudData?.recurringAnalysis || null as any,
                        roundTripping: fraudData?.roundTrippingAnalysis || null as any,
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

            <motion.div key={activeSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {activeSubTab === 'bureau-analysis' && (
                bureauData ? (
                  <EmptyAnalysisState module="Pre-Approval Bureau" description="Upload bureau reports to generate pre-approval policy checks." />
                ) : (
                  <EmptyAnalysisState module="Pre-Approval Bureau" description="Upload bureau reports to generate pre-approval policy checks." />
                )
              )}

              {activeSubTab === 'banking-analysis' && (
                bankingAnalytics ? (
                  <EmptyAnalysisState module="Pre-Approval Banking" description="Banking policy checks will be computed from uploaded bank statements. Upload bank statements in the Banking tab." />
                ) : (
                  <EmptyAnalysisState module="Pre-Approval Banking" description="Upload bank statements to generate pre-approval policy checks." />
                )
              )}

              {activeSubTab === 'gst-analysis' && (
                <EmptyAnalysisState module="Pre-Approval GST" description="Upload GST returns to generate pre-approval policy checks." />
              )}

              {activeSubTab === 'cross-doc' && (
                <EmptyAnalysisState module="Cross Document Analysis" description="Upload documents across multiple categories (Bureau, Banking, GST) to enable cross-document policy checks." />
              )}

              {activeSubTab === 'ai-summary' && (
                <EmptyAnalysisState module="AI Risk Summary" description="Once all documents are uploaded, the AI will generate a comprehensive risk summary." />
              )}
            </motion.div>
          </TabsContent>

          {/* Bureau Tab Content */}
          <TabsContent value="bureau" className="space-y-6">
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

            <motion.div key={activeBureauSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {!bureauData ? (
                <EmptyAnalysisState module="Bureau" description="Upload a CIBIL/Experian/CRIF bureau report (PDF) to see the full bureau analysis." />
              ) : (
                <>
                  {activeBureauSubTab === 'summary' && bureauData.commercialSummary && bureauData.individualSummary && bureauData.aiInsights && (
                    <BureauSummary
                      commercial={bureauData.commercialSummary}
                      individual={bureauData.individualSummary}
                      aiInsights={bureauData.aiInsights}
                    />
                  )}
                  {activeBureauSubTab === 'summary' && (!bureauData.commercialSummary || !bureauData.individualSummary || !bureauData.aiInsights) && (
                    <EmptyAnalysisState module="Bureau Summary" description="The uploaded bureau report did not contain enough data for summary analysis." />
                  )}

                  {activeBureauSubTab === 'loans' && (
                    <BureauLoans
                      commercialLoans={bureauData.commercialLoans}
                      individualLoans={bureauData.individualLoans}
                      commercialSummary={bureauData.commercialLoanSummary || { totalAccounts: 0, activeAccounts: 0, closedAccounts: 0, totalSanctionedAmount: 0, totalOutstandingAmount: 0 }}
                      individualSummary={bureauData.individualLoanSummary || { totalAccounts: 0, activeAccounts: 0, closedAccounts: 0, totalSanctionedAmount: 0, totalOutstandingAmount: 0 }}
                    />
                  )}

                  {activeBureauSubTab === 'enquiries' && (
                    <BureauEnquiries
                      enquiries={bureauData.enquiries}
                      metrics={bureauData.enquiryMetrics || { totalEnquiries: 0, last30Days: 0, last90Days: 0, last180Days: 0, last12Months: 0 }}
                    />
                  )}

                  {activeBureauSubTab === 'relationships' && (
                    <BureauRelationships relationships={bureauData.relationships} />
                  )}

                  {activeBureauSubTab === 'payment-delays' && (
                    <PaymentDelays delays={bureauData.paymentDelays} />
                  )}

                  {activeBureauSubTab === 'bounce-analysis' && bureauData.bounceAnalysis && bureauData.emiBounceAnalysis && (
                    <BureauBounceAnalysis
                      chequeBounce={bureauData.bounceAnalysis}
                      emiBounce={bureauData.emiBounceAnalysis}
                    />
                  )}
                  {activeBureauSubTab === 'bounce-analysis' && (!bureauData.bounceAnalysis || !bureauData.emiBounceAnalysis) && (
                    <EmptyAnalysisState module="Bureau Bounce Analysis" description="Bounce analysis data not available in the uploaded report." />
                  )}

                  {activeBureauSubTab === 'cash-flow' && <BureauCashFlow />}
                </>
              )}
            </motion.div>
          </TabsContent>

          {/* GST Tab Content */}
          <TabsContent value="gst" className="space-y-6">
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

            <motion.div key={activeGSTSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {!gstData ? (
                <EmptyAnalysisState module="GST" description="Upload GST returns (GSTR-1, GSTR-3B) as PDF or Excel to see the full GST analysis." />
              ) : (
                <>
                  {activeGSTSubTab === 'overview' && gstData.aiSummary && (
                    <GSTEntityOverview entityDetails={gstData.entityDetails} aiSummary={gstData.aiSummary} />
                  )}
                  {activeGSTSubTab === 'overview' && !gstData.aiSummary && (
                    <EmptyAnalysisState module="GST Entity Overview" description="AI summary not available. Re-upload GST documents for full analysis." />
                  )}

                  {activeGSTSubTab === 'revenue-itc' && (
                    <GSTRevenueITC
                      revenueComparison={gstData.revenueComparison}
                      itcComparison={gstData.itcComparison}
                      grossAnalysis={gstData.grossAnalysis}
                      netAnalysis={gstData.netAnalysis}
                    />
                  )}

                  {activeGSTSubTab === 'filing-delays' && (
                    gstData.filingDelays.length > 0 ? (
                      <GSTFilingDelays filingDelays={gstData.filingDelays} />
                    ) : (
                      <EmptyAnalysisState module="GST Filing Delays" description="Filing delay data not available in the uploaded documents." />
                    )
                  )}

                  {activeGSTSubTab === 'parties' && (
                    gstData.topSuppliers.length > 0 || gstData.topCustomers.length > 0 ? (
                      <GSTParties
                        topSuppliers={gstData.topSuppliers}
                        topCustomers={gstData.topCustomers}
                        commonParties={gstData.commonParties}
                      />
                    ) : (
                      <EmptyAnalysisState module="GST Parties" description="Supplier/customer data not available in the uploaded documents." />
                    )
                  )}
                </>
              )}
            </motion.div>
          </TabsContent>

          {/* Banking Tab Content */}
          <TabsContent value="banking" className="space-y-6">
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

            <motion.div key={activeBankingSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {!bankingAnalytics ? (
                <EmptyAnalysisState module="Banking" description="Upload bank statements (PDF, CSV, or XLSX) to see the full banking analysis computed from your transactions." />
              ) : (
                <>
                  {activeBankingSubTab === 'overview' && (
                    <BankingAccountOverview
                      accounts={bankingAnalytics.accounts}
                      transactionSummary={bankingAnalytics.transactionSummary}
                      conductAnalysis={bankingAnalytics.conductAnalysis}
                      redFlags={bankingAnalytics.redFlags}
                      aiAssessment={bankingAnalytics.aiAssessment}
                    />
                  )}

                  {activeBankingSubTab === 'cash-flow' && (
                    <BankingCashFlow
                      cashFlowPatterns={bankingAnalytics.cashFlowPatterns}
                      cashVsNonCash={bankingAnalytics.cashVsNonCash}
                    />
                  )}

                  {activeBankingSubTab === 'balances' && (
                    <BankingBalances
                      monthlyBalances={bankingAnalytics.monthlyBalances}
                      balanceBehavior={bankingAnalytics.balanceBehavior}
                    />
                  )}

                  {activeBankingSubTab === 'bounce' && (
                    <BankingBounceAnalysis
                      outwardBounce={bankingAnalytics.outwardChequeBounce}
                      inwardBounce={bankingAnalytics.inwardChequeBounce}
                      emiBounce={bankingAnalytics.bankingEMIBounce}
                    />
                  )}
                </>
              )}
            </motion.div>
          </TabsContent>

          {/* Fraud Assessment Tab Content */}
          <TabsContent value="fraud" className="space-y-6">
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

            <motion.div key={activeFraudSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {!fraudData ? (
                <EmptyAnalysisState module="Fraud Assessment" description="Upload bank statements to enable fraud pattern detection. Lumpsum, recurring, and round-tripping patterns are computed from transaction data." />
              ) : (
                <>
                  {activeFraudSubTab === 'lumpsum' && (
                    <LumpsumPatterns data={fraudData.lumpsumAnalysis} />
                  )}
                  {activeFraudSubTab === 'recurring' && (
                    <RecurringPatterns data={fraudData.recurringAnalysis} />
                  )}
                  {activeFraudSubTab === 'round-tripping' && (
                    <RoundTripping data={fraudData.roundTrippingAnalysis} />
                  )}
                </>
              )}
            </motion.div>
          </TabsContent>

          {/* Personal Discussion Tab Content */}
          <TabsContent value="personal" className="space-y-6">
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

            <motion.div key={activePersonalSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <EmptyAnalysisState module="Personal Discussion" description="Personal discussion data will be available once the interview is conducted and notes are uploaded or entered." />
            </motion.div>
          </TabsContent>

          {/* CAM Tab Content */}
          <TabsContent value="cam" className="space-y-6">
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

            <motion.div key={activeCAMSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {activeCAMSubTab === 'recommendation' ? (
                <FinalRecommendationCard recommendation={null as any} loanId={id} />
              ) : (
                <EmptyAnalysisState module="Credit Assessment Memo" description="The CAM will be auto-generated once all supporting documents (Bureau, Banking, GST) are uploaded and analyzed." />
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
