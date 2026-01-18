import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProposedTerms, FinancialHighlight } from '@/types/cam';
import { FileText, IndianRupee, Calendar, Percent, Shield, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProposedTermsCardProps {
  terms: ProposedTerms;
  financialHighlights: FinancialHighlight[];
}

export function ProposedTermsCard({ terms, financialHighlights }: ProposedTermsCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'average':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'average':
        return 'text-amber-600';
      default:
        return 'text-red-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Loan Terms */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Proposed Loan Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-1">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Applied Amount</p>
              </div>
              <p className="font-display text-lg font-bold text-foreground">{formatCurrency(terms.loanAmount)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <IndianRupee className="h-4 w-4 text-green-600" />
                <p className="text-xs text-green-600">Sanctioned Amount</p>
              </div>
              <p className="font-display text-lg font-bold text-green-600">{formatCurrency(terms.sanctionedAmount)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg border border-border">
              <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Tenure</p>
              <p className="font-semibold text-foreground">{terms.tenure} months</p>
            </div>
            <div className="text-center p-3 rounded-lg border border-border">
              <Percent className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Interest Rate</p>
              <p className="font-semibold text-foreground">{terms.interestRate}% p.a.</p>
            </div>
            <div className="text-center p-3 rounded-lg border border-border">
              <IndianRupee className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">EMI Amount</p>
              <p className="font-semibold text-foreground">{formatCurrency(terms.emiAmount)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between p-2 rounded bg-secondary/20">
              <span className="text-muted-foreground">Repayment Mode</span>
              <span className="font-medium text-foreground">{terms.repaymentMode}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-secondary/20">
              <span className="text-muted-foreground">Moratorium</span>
              <span className="font-medium text-foreground">{terms.moratoriumPeriod} months</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-secondary/20">
              <span className="text-muted-foreground">Processing Fee</span>
              <span className="font-medium text-foreground">{terms.processingFee}%</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-secondary/20">
              <span className="text-muted-foreground">LTV Ratio</span>
              <span className="font-medium text-foreground">{terms.ltvRatio}%</span>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground text-sm">Security Details</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{terms.securityType}</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Security Value</span>
              <span className="font-medium text-foreground">{formatCurrency(terms.securityValue)}</span>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="font-medium text-foreground text-sm mb-2">Key Covenants</p>
            <ul className="space-y-1">
              {terms.covenants.map((covenant, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {covenant}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Financial Highlights */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-primary" />
            Financial Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {financialHighlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(highlight.status)}
                  <div>
                    <p className="font-medium text-foreground text-sm">{highlight.metric}</p>
                    <p className="text-xs text-muted-foreground">Benchmark: {highlight.benchmark}</p>
                  </div>
                </div>
                <span className={`font-display font-bold ${getStatusColor(highlight.status)}`}>
                  {highlight.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-secondary/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Metrics Meeting Benchmark</span>
              <span className="font-bold text-foreground">
                {financialHighlights.filter((h) => h.status === 'good').length}/{financialHighlights.length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
