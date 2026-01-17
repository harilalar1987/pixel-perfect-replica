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
import { LumpsumPatternAnalysis } from '@/types/fraud';
import { DollarSign, Layers, Activity, AlertTriangle } from 'lucide-react';

interface LumpsumPatternsProps {
  data: LumpsumPatternAnalysis;
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

export function LumpsumPatterns({ data }: LumpsumPatternsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-sm text-muted-foreground">Total Debit Amount</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(data.totalDebitAmount)}</p>
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

      {/* Pattern Description */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Lumpsum Pattern Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This analysis identifies clusters of transactions with round-figure amounts that may indicate 
            structured cash movements or artificial transaction patterns. High rounded ratios (100%) 
            suggest intentional round-figure transactions which warrant further investigation.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">High Risk: 100% rounded + high volume</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span className="text-muted-foreground">Medium Risk: Recurring pattern</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
              <span className="text-muted-foreground">Low Risk: Normal transaction flow</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clusters Table */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Identified Clusters ({data.clusters.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Cluster ID</TableHead>
                  <TableHead className="font-semibold">Merchant Name</TableHead>
                  <TableHead className="font-semibold text-center">Transaction Count</TableHead>
                  <TableHead className="font-semibold text-center">Rounded Ratio</TableHead>
                  <TableHead className="font-semibold text-right">Total Debit</TableHead>
                  <TableHead className="font-semibold text-right">Total Credit</TableHead>
                  <TableHead className="font-semibold text-center">Pattern Type</TableHead>
                  <TableHead className="font-semibold text-center">Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.clusters.map((cluster) => (
                  <TableRow key={cluster.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">{cluster.id}</TableCell>
                    <TableCell className="text-foreground">{cluster.merchantName}</TableCell>
                    <TableCell className="text-center text-foreground">{cluster.transactionCount}</TableCell>
                    <TableCell className="text-center">
                      <span className={cluster.roundedRatio === 100 ? 'text-destructive font-semibold' : 'text-foreground'}>
                        {cluster.roundedRatio}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(cluster.totalDebitValue)}</TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(cluster.totalCreditValue)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{cluster.patternType}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getRiskBadgeVariant(cluster.riskLevel)}>
                        {cluster.riskLevel}
                      </Badge>
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
