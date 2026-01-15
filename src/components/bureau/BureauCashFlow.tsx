import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

interface CreditUtilization {
  averageUtilization: number;
  peakUtilization: number;
}

interface CashFlowSignals {
  stressIndicators: string[];
  positiveIndicators: string[];
  riskLevel: 'Stable' | 'Watchlist' | 'Stressed';
}

interface BureauCashFlowProps {
  utilization?: CreditUtilization;
  signals?: CashFlowSignals;
}

export function BureauCashFlow({ 
  utilization = { averageUtilization: 58, peakUtilization: 78 },
  signals = {
    stressIndicators: [
      'Rising DPD across 2 accounts in last quarter',
      'Increased reliance on short-term credit facilities',
    ],
    positiveIndicators: [
      'Consistent full repayments on secured loans',
      'No instances of 60+ DPD in last 24 months',
      'Stable credit utilization below 60%',
    ],
    riskLevel: 'Stable',
  }
}: BureauCashFlowProps) {
  const isHighUtilization = utilization.averageUtilization > 75;

  return (
    <div className="space-y-6">
      {/* Credit Utilization */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border bg-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Credit Utilization Behavior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Average Utilization</span>
                    <span className={`font-medium ${isHighUtilization ? 'text-status-fail' : 'text-status-pass'}`}>
                      {utilization.averageUtilization}%
                    </span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isHighUtilization ? 'bg-status-fail' : 'bg-status-pass'
                      }`}
                      style={{ width: `${utilization.averageUtilization}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Peak Utilization</span>
                    <span className="font-medium">{utilization.peakUtilization}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-status-warning rounded-full transition-all"
                      style={{ width: `${utilization.peakUtilization}%` }}
                    />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground pt-2">
                  {isHighUtilization 
                    ? 'Consistently high utilization indicates liquidity pressure and dependency on credit limits.'
                    : 'Low to moderate utilization indicates healthy credit management with adequate buffer.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Repayment Pattern */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border bg-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Repayment Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-status-pass/10 text-center">
                  <p className="text-2xl font-bold text-status-pass">85%</p>
                  <p className="text-xs text-muted-foreground">On-time Payments</p>
                </div>
                <div className="p-3 rounded-lg bg-status-warning/10 text-center">
                  <p className="text-2xl font-bold text-status-warning">12%</p>
                  <p className="text-xs text-muted-foreground">Minor Delays</p>
                </div>
                <div className="p-3 rounded-lg bg-status-pass/10 text-center">
                  <p className="text-2xl font-bold text-status-pass">78%</p>
                  <p className="text-xs text-muted-foreground">Full Repayments</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary text-center">
                  <p className="text-2xl font-bold">22%</p>
                  <p className="text-xs text-muted-foreground">Minimum Due Only</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Consistent full repayments indicate strong cash flow support. Minimum-only repayments on credit cards are within acceptable limits.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cash Stress Indicators */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-status-pass" />
              Positive Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {signals.positiveIndicators.map((indicator, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-status-pass mt-0.5 shrink-0" />
                  {indicator}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-status-warning" />
              Stress Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            {signals.stressIndicators.length > 0 ? (
              <ul className="space-y-2">
                {signals.stressIndicators.map((indicator, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-status-warning mt-0.5 shrink-0" />
                    {indicator}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No stress indicators detected.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Overall Assessment */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Bureau Cash Flow Assessment
            <Badge className={
              signals.riskLevel === 'Stable' ? 'bg-status-pass' :
              signals.riskLevel === 'Watchlist' ? 'bg-status-warning' : 'bg-status-fail'
            }>
              {signals.riskLevel}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {signals.riskLevel === 'Stable' 
              ? 'Credit utilization and repayment patterns indicate stable cash flow management. No signs of significant financial stress.'
              : signals.riskLevel === 'Watchlist'
              ? 'Some early warning indicators detected. Recommend close monitoring but no immediate action required.'
              : 'Multiple stress indicators present. High probability of repayment issues. Requires manual review.'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
