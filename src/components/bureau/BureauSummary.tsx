import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Building2, User, TrendingUp, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { CommercialBureauSummary, IndividualBureauSummary, AIBureauInsights } from '@/types/bureau';

interface BureauSummaryProps {
  commercial: CommercialBureauSummary;
  individual: IndividualBureauSummary;
  aiInsights: AIBureauInsights;
}

const formatAmount = (amount: number) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export function BureauSummary({ commercial, individual, aiInsights }: BureauSummaryProps) {
  return (
    <Tabs defaultValue="commercial" className="space-y-6">
      <TabsList className="bg-secondary">
        <TabsTrigger value="commercial" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" /> Commercial
        </TabsTrigger>
        <TabsTrigger value="individual" className="flex items-center gap-2">
          <User className="h-4 w-4" /> Individual
        </TabsTrigger>
      </TabsList>

      <TabsContent value="commercial" className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* CMR Score Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Commercial Bureau Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-status-pass/10 border-4 border-status-pass flex items-center justify-center">
                    <span className="text-2xl font-bold text-status-pass">CMR-{commercial.cmrScore}</span>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-status-pass/10 text-status-pass border-status-pass">
                      {commercial.cmrInterpretation}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">CMR-1 to CMR-3 → Strong profile</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Overview */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Company Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-sm text-muted-foreground">Total Accounts</p>
                    <p className="text-xl font-bold">{commercial.totalAccounts}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-sm text-muted-foreground">Active Accounts</p>
                    <p className="text-xl font-bold">{commercial.activeAccounts}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-sm text-muted-foreground">Sanctioned</p>
                    <p className="text-lg font-bold">{formatAmount(commercial.totalSanctionedAmount)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-sm text-muted-foreground">Outstanding</p>
                    <p className="text-lg font-bold">{formatAmount(commercial.totalOutstandingAmount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                AI-Generated Commercial Bureau Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{commercial.aiSummary}</p>
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>

      <TabsContent value="individual" className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Individual Score */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Individual Bureau Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-status-pass/10 border-4 border-status-pass flex items-center justify-center">
                  <span className="text-2xl font-bold text-status-pass">{individual.creditScore || 'N/A'}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Score Range: {individual.scoreRange}</p>
                  <p className="text-sm font-medium mt-1">{individual.applicantName}</p>
                  <p className="text-xs text-muted-foreground">DOB: {individual.dateOfBirth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Account Summary */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Individual Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-secondary text-center">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{individual.totalAccounts}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary text-center">
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-xl font-bold">{individual.activeAccounts}</p>
                </div>
                <div className="p-3 rounded-lg bg-status-fail/10 text-center">
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-xl font-bold text-status-fail">{individual.overdueAccounts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Indicators */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bureau Status Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className={!individual.hasDisputes ? 'bg-status-pass/10 text-status-pass' : 'bg-status-fail/10 text-status-fail'}>
                {!individual.hasDisputes ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {individual.hasDisputes ? 'Disputes Found' : 'No Disputes'}
              </Badge>
              <Badge variant="outline" className={!individual.hasWriteOffs ? 'bg-status-pass/10 text-status-pass' : 'bg-status-fail/10 text-status-fail'}>
                {!individual.hasWriteOffs ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {individual.hasWriteOffs ? 'Write-offs Found' : 'No Write-offs'}
              </Badge>
              <Badge variant="outline" className={!individual.hasSettlements ? 'bg-status-pass/10 text-status-pass' : 'bg-status-fail/10 text-status-fail'}>
                {!individual.hasSettlements ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {individual.hasSettlements ? 'Settlements Found' : 'No Settlements'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-status-pass" /> AI-Identified Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiInsights.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-status-pass mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-fail" /> AI-Detected Red Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiInsights.redFlags.map((f, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-status-fail mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Overall Assessment */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              AI Overall Assessment
              <Badge className={aiInsights.riskCategory === 'Low Risk' ? 'bg-status-pass' : aiInsights.riskCategory === 'Moderate Risk' ? 'bg-status-warning' : 'bg-status-fail'}>
                {aiInsights.riskCategory}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{aiInsights.overallAssessment}</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
