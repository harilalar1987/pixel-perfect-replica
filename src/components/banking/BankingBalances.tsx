import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingDown, AlertCircle, Clock } from 'lucide-react';
import { MonthlyBalance, BalanceBehavior } from '@/types/banking';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface BankingBalancesProps {
  monthlyBalances: MonthlyBalance[];
  balanceBehavior: BalanceBehavior;
}

export function BankingBalances({ monthlyBalances, balanceBehavior }: BankingBalancesProps) {
  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Prepare chart data (reverse for chronological order)
  const chartData = [...monthlyBalances].reverse().map((balance) => ({
    month: balance.month.split(' ')[0],
    average: balance.averageBalance / 100000,
    lowest: balance.lowestBalance / 100000,
    closing: balance.closingBalance / 100000,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg EOD Balance</p>
                <p className="text-xl font-display font-bold text-primary">
                  {formatCurrency(balanceBehavior.averageEODBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${balanceBehavior.lowestBalance < 0 ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                <TrendingDown className={`h-5 w-5 ${balanceBehavior.lowestBalance < 0 ? 'text-red-600' : 'text-amber-600'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lowest Balance</p>
                <p className={`text-xl font-display font-bold ${balanceBehavior.lowestBalance < 0 ? 'text-red-600' : 'text-amber-600'}`}>
                  {formatCurrency(balanceBehavior.lowestBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Negative Bal Days</p>
                <p className="text-xl font-display font-bold text-amber-600">
                  {balanceBehavior.frequencyOfNegativeBalances}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">OD Utilization</p>
                <p className="text-xl font-display font-bold text-purple-600">
                  {balanceBehavior.overdraftUsage?.frequency || 0} times
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdraft Usage Details */}
      {balanceBehavior.overdraftUsage && (
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Overdraft Usage Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Frequency of OD Usage</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  {balanceBehavior.overdraftUsage.frequency} times
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Avg Duration</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  {balanceBehavior.overdraftUsage.averageDuration} days
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Max Negative Balance</p>
                <p className="text-2xl font-display font-bold text-red-600">
                  -{formatCurrency(balanceBehavior.overdraftUsage.maxNegativeBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balance Chart */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="font-display">Monthly Balance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
                <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                <Area 
                  type="monotone" 
                  dataKey="average" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Average Balance"
                />
                <Area 
                  type="monotone" 
                  dataKey="closing" 
                  stroke="hsl(142, 76%, 36%)" 
                  fill="hsl(142, 76%, 36%)" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Closing Balance"
                />
                <Area 
                  type="monotone" 
                  dataKey="lowest" 
                  stroke="hsl(0, 72%, 51%)" 
                  fill="hsl(0, 72%, 51%)" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Lowest Balance"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Balance Table */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Monthly Balance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Average Balance</TableHead>
                <TableHead className="text-right">Lowest Balance</TableHead>
                <TableHead className="text-right">Closing Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyBalances.map((balance, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{balance.month}</TableCell>
                  <TableCell className="text-right text-primary">
                    {formatCurrency(balance.averageBalance)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant="outline"
                      className={balance.lowestBalance >= 0 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }
                    >
                      {formatCurrency(balance.lowestBalance)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-foreground font-medium">
                    {formatCurrency(balance.closingBalance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
