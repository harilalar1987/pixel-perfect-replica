import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
} from 'lucide-react';
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

export default function LoanAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState('pre-approval');
  const [activeSubTab, setActiveSubTab] = useState('bureau-analysis');
  const [activeBureauSubTab, setActiveBureauSubTab] = useState('summary');

  // Find loan by ID (fallback to first loan)
  const loan = mockLoans.find((l) => l.id === id) || mockLoans[0];

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Crore`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

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
                  <p className="text-primary-foreground/70 text-sm">{loan.id}</p>
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

          {/* Other Tabs - Placeholder */}
          {['gst', 'banking', 'fraud', 'personal', 'cam'].map((tabId) => (
            <TabsContent key={tabId} value={tabId}>
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-display">
                    {mainTabs.find((t) => t.id === tabId)?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-16 text-center">
                    <div className="h-16 w-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                      {(() => {
                        const Icon = mainTabs.find((t) => t.id === tabId)?.icon || FileText;
                        return <Icon className="h-8 w-8 text-muted-foreground" />;
                      })()}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {mainTabs.find((t) => t.id === tabId)?.label} Analysis
                    </h3>
                    <p className="text-muted-foreground">
                      Detailed analysis will be available here once documents are processed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
