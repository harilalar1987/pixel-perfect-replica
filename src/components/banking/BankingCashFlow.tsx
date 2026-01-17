import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Wallet } from 'lucide-react';
import { CashFlowPattern, CashVsNonCash } from '@/types/banking';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Line } from 'recharts';

interface BankingCashFlowProps {
  cashFlowPatterns: CashFlowPattern[];
  cashVsNonCash: CashVsNonCash;
}

export function BankingCashFlow({ cashFlowPatterns, cashVsNonCash }: BankingCashFlowProps) {
  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatChartValue = (value: number) => {
    if (Math.abs(value) >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    }
    return value.toLocaleString('en-IN');
  };

  // Prepare chart data (reverse for chronological order)
  const chartData = [...cashFlowPatterns].reverse().map((pattern) => ({
    month: pattern.month.split(' ')[0],
    credits: pattern.credits / 100000,
    debits: pattern.debits / 100000,
    netCashFlow: pattern.netCashFlow / 100000,
  }));

  // Calculate totals
  const totalCredits = cashFlowPatterns.reduce((sum, p) => sum + p.credits, 0);
  const totalDebits = cashFlowPatterns.reduce((sum, p) => sum + p.debits, 0);
  const netCashFlow = totalCredits - totalDebits;
  const avgMonthlyCredits = totalCredits / cashFlowPatterns.length;
  const avgMonthlyDebits = totalDebits / cashFlowPatterns.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-xl font-display font-bold text-emerald-600">
                  {formatCurrency(totalCredits)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-xl font-display font-bold text-red-600">
                  {formatCurrency(totalDebits)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${netCashFlow >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <Activity className={`h-5 w-5 ${netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                <p className={`text-xl font-display font-bold ${netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(netCashFlow)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Monthly Credit</p>
                <p className="text-xl font-display font-bold text-primary">
                  {formatCurrency(avgMonthlyCredits)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="font-display">Monthly Cash Flow Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tickFormatter={(value) => `${value}L`}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toFixed(2)} L`, undefined]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="credits" fill="hsl(142, 76%, 36%)" name="Credits" radius={[4, 4, 0, 0]} />
                <Bar dataKey="debits" fill="hsl(0, 72%, 51%)" name="Debits" radius={[4, 4, 0, 0]} />
                <Line 
                  type="monotone" 
                  dataKey="netCashFlow" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  name="Net Cash Flow"
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cash vs Non-Cash + Monthly Table */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Cash vs Non-Cash Analysis */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Cash vs Digital Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cash Deposits</span>
                  <span className="font-medium">{cashVsNonCash.cashDepositPercentage}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${cashVsNonCash.cashDepositPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(cashVsNonCash.cashDepositValue)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Digital Deposits</span>
                  <span className="font-medium">{(100 - cashVsNonCash.cashDepositPercentage).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${100 - cashVsNonCash.cashDepositPercentage}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cash Withdrawals</span>
                    <span className="font-medium">{cashVsNonCash.cashWithdrawalPercentage}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${cashVsNonCash.cashWithdrawalPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(cashVsNonCash.cashWithdrawalValue)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Cash Flow Table */}
        <Card className="border-border bg-card shadow-card md:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-lg">Monthly Cash Flow Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Credits</TableHead>
                    <TableHead className="text-right">Debits</TableHead>
                    <TableHead className="text-right">Net Flow</TableHead>
                    <TableHead className="text-center">Txn Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashFlowPatterns.map((pattern, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{pattern.month}</TableCell>
                      <TableCell className="text-right text-emerald-600">
                        {formatCurrency(pattern.credits)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(pattern.debits)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant="outline"
                          className={pattern.netCashFlow >= 0 
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-600 border-red-500/20'
                          }
                        >
                          {pattern.netCashFlow >= 0 ? '+' : ''}{formatCurrency(pattern.netCashFlow)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs text-muted-foreground">
                          {pattern.creditCount} / {pattern.debitCount}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
