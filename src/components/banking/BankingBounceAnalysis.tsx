import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle, Clock, CreditCard, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { OutwardChequeBounce, InwardChequeBounce, BankingEMIBounce } from '@/types/banking';

interface BankingBounceAnalysisProps {
  outwardBounce: OutwardChequeBounce;
  inwardBounce: InwardChequeBounce;
  emiBounce: BankingEMIBounce;
}

export function BankingBounceAnalysis({ outwardBounce, inwardBounce, emiBounce }: BankingBounceAnalysisProps) {
  const getBounceRateColor = (rate: number) => {
    if (rate <= 2) return 'text-emerald-600';
    if (rate <= 5) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBounceRateBadge = (rate: number) => {
    if (rate <= 2) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (rate <= 5) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  const getEMIFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'None':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Occasional':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Repeated':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ArrowUpCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outward Bounce Rate</p>
                <p className={`text-2xl font-display font-bold ${getBounceRateColor(outwardBounce.bounceRate)}`}>
                  {outwardBounce.bounceRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <ArrowDownCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inward Bounce Rate</p>
                <p className={`text-2xl font-display font-bold ${getBounceRateColor(inwardBounce.bounceRate)}`}>
                  {inwardBounce.bounceRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">EMI Bounce Frequency</p>
                <Badge className={getEMIFrequencyColor(emiBounce.frequency)}>
                  {emiBounce.frequency}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Outward Cheque Bounce */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-blue-600" />
              Outward Cheque Bounce
              <span className="text-xs text-muted-foreground font-normal">(Deposited Cheques)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Cheques Deposited</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  {outwardBounce.chequesDeposited}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Cheques Bounced</p>
                <p className="text-2xl font-display font-bold text-red-600">
                  {outwardBounce.chequesBounced}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <Badge className={getBounceRateBadge(outwardBounce.bounceRate)}>
                  {outwardBounce.bounceRate.toFixed(2)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm text-muted-foreground">Valid Months Analyzed</span>
                <span className="font-medium">{outwardBounce.validMonths}</span>
              </div>
              {outwardBounce.excludedMonths > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10">
                  <span className="text-sm text-amber-600">Excluded Months</span>
                  <span className="font-medium text-amber-600">{outwardBounce.excludedMonths}</span>
                </div>
              )}
            </div>

            {/* Visual Indicator */}
            <div className="mt-4 p-4 rounded-lg bg-secondary">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Bounce Rate</span>
                <span>{outwardBounce.bounceRate.toFixed(2)}%</span>
              </div>
              <div className="h-3 bg-background rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${outwardBounce.bounceRate <= 2 ? 'bg-emerald-500' : outwardBounce.bounceRate <= 5 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(outwardBounce.bounceRate * 10, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span className="text-emerald-600">≤2% Good</span>
                <span className="text-amber-600">≤5% Moderate</span>
                <span className="text-red-600">&gt;5% Poor</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inward Cheque Bounce */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-purple-600" />
              Inward Cheque Bounce
              <span className="text-xs text-muted-foreground font-normal">(Issued Cheques)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Cheques Issued</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  {inwardBounce.chequesIssued}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Cheques Bounced</p>
                <p className="text-2xl font-display font-bold text-red-600">
                  {inwardBounce.chequesBounced}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <Badge className={getBounceRateBadge(inwardBounce.bounceRate)}>
                  {inwardBounce.bounceRate.toFixed(2)}%
                </Badge>
              </div>
            </div>

            {/* Visual Indicator */}
            <div className="mt-4 p-4 rounded-lg bg-secondary">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Bounce Rate</span>
                <span>{inwardBounce.bounceRate.toFixed(2)}%</span>
              </div>
              <div className="h-3 bg-background rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${inwardBounce.bounceRate <= 2 ? 'bg-emerald-500' : inwardBounce.bounceRate <= 5 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(inwardBounce.bounceRate * 10, 100)}%` }}
                />
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="mt-4 p-4 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                {inwardBounce.bounceRate <= 2 ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-emerald-600">Low Risk</p>
                      <p className="text-xs text-muted-foreground">
                        Inward bounce rate is within acceptable limits indicating good payment discipline.
                      </p>
                    </div>
                  </>
                ) : inwardBounce.bounceRate <= 5 ? (
                  <>
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-600">Moderate Risk</p>
                      <p className="text-xs text-muted-foreground">
                        Inward bounce rate requires attention. Review payment patterns.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-600">High Risk</p>
                      <p className="text-xs text-muted-foreground">
                        High inward bounce rate indicates potential payment issues.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EMI Bounce Analysis */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-600" />
            EMI Bounce Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">Total EMI Bounces</p>
              <p className={`text-4xl font-display font-bold ${emiBounce.totalEmiBounces === 0 ? 'text-emerald-600' : emiBounce.totalEmiBounces <= 2 ? 'text-amber-600' : 'text-red-600'}`}>
                {emiBounce.totalEmiBounces}
              </p>
            </div>
            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">Recency of Bounces</p>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="text-lg font-medium">{emiBounce.recencyOfBounces}</p>
              </div>
            </div>
            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">Bounce Frequency</p>
              <Badge className={getEMIFrequencyColor(emiBounce.frequency)} variant="outline">
                {emiBounce.frequency}
              </Badge>
            </div>
          </div>

          {/* Assessment */}
          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-3">
              {emiBounce.frequency === 'None' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Excellent EMI Payment Discipline</p>
                    <p className="text-xs text-muted-foreground">
                      No EMI bounces recorded during the analysis period. This indicates strong repayment capability and financial discipline.
                    </p>
                  </div>
                </>
              ) : emiBounce.frequency === 'Occasional' ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Moderate EMI Payment Pattern</p>
                    <p className="text-xs text-muted-foreground">
                      Occasional EMI bounces observed. While not critical, monitoring is recommended. Last bounce: {emiBounce.recencyOfBounces}.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Concerning EMI Payment History</p>
                    <p className="text-xs text-muted-foreground">
                      Repeated EMI bounces indicate potential repayment stress. Detailed review of cash flow and obligations recommended.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
