import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, CreditCard, MapPin, Calendar, Sparkles, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { BankAccount, TransactionSummary, BankingConductAnalysis, BankingRedFlags, AIBankingAssessment } from '@/types/banking';

interface BankingAccountOverviewProps {
  accounts: BankAccount[];
  transactionSummary: TransactionSummary;
  conductAnalysis: BankingConductAnalysis;
  redFlags: BankingRedFlags;
  aiAssessment: AIBankingAssessment;
}

export function BankingAccountOverview({
  accounts,
  transactionSummary,
  conductAnalysis,
  redFlags,
  aiAssessment,
}: BankingAccountOverviewProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'Low Risk':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Moderate Risk':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'High Risk':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Bank Accounts Table */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Bank Accounts Analyzed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Statement Period</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{account.maskedAccountNumber}</p>
                        <p className="text-xs text-muted-foreground">{account.accountName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{account.bankName}</p>
                    {account.ifscCode && (
                      <p className="text-xs text-muted-foreground">{account.ifscCode}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {account.accountType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {account.branchName && (
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {account.branchName}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {account.statementPeriod}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction Summary + Conduct Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Transaction Summary */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-sm text-muted-foreground mb-1">Total Credits</p>
                <p className="text-xl font-display font-bold text-emerald-600">
                  {formatCurrency(transactionSummary.totalCredits)}
                </p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-sm text-muted-foreground mb-1">Total Debits</p>
                <p className="text-xl font-display font-bold text-red-600">
                  {formatCurrency(transactionSummary.totalDebits)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                <p className="text-xl font-display font-bold text-foreground">
                  {transactionSummary.totalTransactions.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Analysis Period</p>
                <p className="text-xl font-display font-bold text-foreground">
                  {transactionSummary.analysisPeriods} Months
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conduct Analysis */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Banking Conduct Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Transaction Frequency</span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {conductAnalysis.transactionFrequency}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Credit/Debit Dominance</span>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  {conductAnalysis.creditDebitDominance}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Digital vs Cash</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  {conductAnalysis.digitalVsCash}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Usage Consistency</span>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                  {conductAnalysis.usageConsistency}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Red Flags + AI Assessment */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Red Flags */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Red Flag Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Frequent Cheque Bounces</span>
                {redFlags.frequentChequeBounces ? (
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Yes</Badge>
                ) : (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">No</Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Negative EOD Balances</span>
                {redFlags.negativeEODBalances ? (
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Yes</Badge>
                ) : (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">No</Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Net Cash Outflow</span>
                {redFlags.netCashOutflow ? (
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Yes</Badge>
                ) : (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">No</Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Excessive OD Dependence</span>
                {redFlags.excessiveOverdraftDependence ? (
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Yes</Badge>
                ) : (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">No</Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {redFlags.details.map((detail, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Assessment */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Banking Assessment
              <Badge className={getRiskBadgeVariant(aiAssessment.riskLevel)}>
                {aiAssessment.riskLevel}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Financial Discipline</p>
                <p className="text-sm font-medium">{aiAssessment.financialDiscipline}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Liquidity Strength</p>
                <p className="text-sm font-medium">{aiAssessment.liquidityStrength}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Risk of Default</p>
                <p className="text-sm font-medium">{aiAssessment.riskOfDefault}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Creditworthiness</p>
                <p className="text-sm font-medium">{aiAssessment.creditworthiness}</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{aiAssessment.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
