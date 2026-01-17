import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RecurringPatternAnalysis } from '@/types/fraud';
import { DollarSign, Layers, Activity, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RecurringPatternsProps {
  data: RecurringPatternAnalysis;
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

const getRiskBadgeVariant = (level: string) => {
  switch (level) {
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'secondary';
    case 'Low':
      return 'outline';
    default:
      return 'default';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'Positive':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'Negative':
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    case 'Variable':
      return <Minus className="h-4 w-4 text-secondary" />;
    default:
      return null;
  }
};

export function RecurringPatterns({ data }: RecurringPatternsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clusters</p>
                <p className="text-2xl font-bold text-foreground">{data.totalClusters}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold text-foreground">{data.totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Debit Amount</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(data.averageDebitAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Exposure</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(data.totalDebitExposure)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <Badge variant={getRiskBadgeVariant(data.riskLevel)} className="mt-1">
                  {data.riskLevel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Indicators */}
      {data.highRiskIndicators.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              High Risk Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.highRiskIndicators.map((indicator, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-destructive mt-1">•</span>
                  {indicator}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Pattern Description */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Recurring Pattern Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This analysis identifies recurring debit patterns to counterparties, particularly focused on 
            EMI payments, loan repayments, and regular outflows to financial institutions. High exposure 
            to NBFCs and finance companies may indicate existing debt burden.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Positive: Improving balance trend</span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-secondary" />
              <span className="text-muted-foreground">Variable: Fluctuating balance</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-muted-foreground">Negative: Declining balance trend</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clusters Table */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Recurring Debit Clusters ({data.clusters.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Cluster ID</TableHead>
                  <TableHead className="font-semibold">Counterparty Name</TableHead>
                  <TableHead className="font-semibold text-center">Transaction Count</TableHead>
                  <TableHead className="font-semibold text-right">Avg. Debit Amount</TableHead>
                  <TableHead className="font-semibold text-right">Total Exposure</TableHead>
                  <TableHead className="font-semibold text-center">Classification</TableHead>
                  <TableHead className="font-semibold text-center">Balance Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.clusters.map((cluster) => (
                  <TableRow key={cluster.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">{cluster.id}</TableCell>
                    <TableCell className="text-foreground">{cluster.counterpartyName}</TableCell>
                    <TableCell className="text-center text-foreground">{cluster.transactionCount}</TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(cluster.averageDebitAmount)}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{formatCurrency(cluster.totalDebitExposure)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{cluster.patternClassification}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getTrendIcon(cluster.runningBalanceTrend)}
                        <span className="text-sm text-foreground">{cluster.runningBalanceTrend}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
