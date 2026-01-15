import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Banknote } from 'lucide-react';
import { BounceAnalysis as BounceAnalysisType, EMIBounceAnalysis } from '@/types/bureau';

interface BureauBounceAnalysisProps {
  chequeBounce: BounceAnalysisType;
  emiBounce: EMIBounceAnalysis;
}

export function BureauBounceAnalysis({ chequeBounce, emiBounce }: BureauBounceAnalysisProps) {
  const isBounceRiskHigh = chequeBounce.bounceRate > 5;
  const isEmiRiskHigh = emiBounce.riskClassification === 'High Risk';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cheque Bounce */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border bg-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary" />
                Cheque Bounce Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-secondary text-center">
                  <p className="text-xs text-muted-foreground">Presented</p>
                  <p className="text-xl font-bold">{chequeBounce.chequesPresented}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary text-center">
                  <p className="text-xs text-muted-foreground">Bounced</p>
                  <p className="text-xl font-bold text-status-fail">{chequeBounce.chequesBounced}</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${isBounceRiskHigh ? 'bg-status-fail/10' : 'bg-status-pass/10'}`}>
                  <p className="text-xs text-muted-foreground">Bounce Rate</p>
                  <p className={`text-xl font-bold ${isBounceRiskHigh ? 'text-status-fail' : 'text-status-pass'}`}>
                    {chequeBounce.bounceRate.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isBounceRiskHigh ? (
                  <Badge className="bg-status-fail">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    High Bounce Rate
                  </Badge>
                ) : (
                  <Badge className="bg-status-pass">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">{chequeBounce.timePeriod}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                {isBounceRiskHigh 
                  ? 'Multiple bounces detected indicating high credit stress and weak cash management.'
                  : '0% bounce rate indicates strong repayment discipline with consistent payment behavior.'
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* EMI Bounce */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border bg-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-primary" />
                EMI Bounce Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-secondary text-center">
                  <p className="text-xs text-muted-foreground">Total Bounces</p>
                  <p className="text-xl font-bold">{emiBounce.totalEmiBounces}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary text-center">
                  <p className="text-xs text-muted-foreground">Last Bounce</p>
                  <p className="text-sm font-medium">{emiBounce.recencyOfLastBounce}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary text-center">
                  <p className="text-xs text-muted-foreground">Frequency</p>
                  <p className="text-lg font-medium">{emiBounce.frequency}</p>
                </div>
              </div>
              
              <Badge className={
                emiBounce.riskClassification === 'Low Risk' ? 'bg-status-pass' :
                emiBounce.riskClassification === 'Medium Risk' ? 'bg-status-warning' : 'bg-status-fail'
              }>
                {emiBounce.riskClassification === 'Low Risk' ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                )}
                {emiBounce.riskClassification}
              </Badge>
              
              <p className="text-sm text-muted-foreground mt-4">
                {emiBounce.totalEmiBounces === 0 
                  ? 'Zero EMI bounces indicate strong repayment behavior with no missed payments.'
                  : `${emiBounce.totalEmiBounces} EMI bounce(s) detected. ${emiBounce.frequency === 'Low' ? 'Monitor closely.' : 'High probability of delinquency escalation.'}`
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Overall Assessment */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Overall Bureau Bounce Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge className={
              !isBounceRiskHigh && !isEmiRiskHigh ? 'bg-status-pass' :
              isBounceRiskHigh && isEmiRiskHigh ? 'bg-status-fail' : 'bg-status-warning'
            }>
              {!isBounceRiskHigh && !isEmiRiskHigh ? 'Low Risk' :
               isBounceRiskHigh && isEmiRiskHigh ? 'High Risk' : 'Moderate Risk'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {!isBounceRiskHigh && !isEmiRiskHigh 
              ? 'The borrower demonstrates clean repayment history with minimal bounce events. Credit risk from bounce behavior is low.'
              : 'Bounce patterns indicate potential repayment stress. This should be factored into credit assessment and may require additional scrutiny.'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
