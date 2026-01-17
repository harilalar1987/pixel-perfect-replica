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
import { RoundTrippingAnalysis } from '@/types/fraud';
import { CheckCircle, AlertTriangle, RefreshCw, Link } from 'lucide-react';

interface RoundTrippingProps {
  data: RoundTrippingAnalysis;
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
    case 'None':
      return 'default';
    default:
      return 'default';
  }
};

const getTimeProximityColor = (proximity: string) => {
  switch (proximity) {
    case 'Short':
      return 'text-destructive';
    case 'Medium':
      return 'text-secondary';
    case 'Long':
      return 'text-muted-foreground';
    default:
      return 'text-foreground';
  }
};

const getConsistencyColor = (consistency: string) => {
  switch (consistency) {
    case 'High':
      return 'text-destructive';
    case 'Medium':
      return 'text-secondary';
    case 'Low':
      return 'text-muted-foreground';
    default:
      return 'text-foreground';
  }
};

export function RoundTripping({ data }: RoundTrippingProps) {
  const noClustersFound = !data.clustersFound || data.chains.length === 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${noClustersFound ? 'bg-green-100' : 'bg-destructive/10'}`}>
                {noClustersFound ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clusters Found</p>
                <p className="text-2xl font-bold text-foreground">
                  {data.clustersFound ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Chains</p>
                <p className="text-2xl font-bold text-foreground">{data.totalChains}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${data.riskLevel === 'None' ? 'bg-green-100' : 'bg-destructive/10'}`}>
                <AlertTriangle className={`h-5 w-5 ${data.riskLevel === 'None' ? 'text-green-500' : 'text-destructive'}`} />
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
            Round Tripping Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Round tripping refers to the practice of moving money in a circular pattern to create 
            artificial turnover or hide the true source/destination of funds. This analysis identifies 
            transaction chains where funds flow through multiple accounts and return to similar or 
            related parties within a short time frame.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">Short time proximity + High value consistency = High risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">No patterns detected = Normal transaction flow</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Message */}
      <Card className={`border-border shadow-card ${noClustersFound ? 'bg-green-50 border-green-200' : 'bg-destructive/5 border-destructive/30'}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {noClustersFound ? (
              <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-destructive flex-shrink-0" />
            )}
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${noClustersFound ? 'text-green-700' : 'text-destructive'}`}>
                {noClustersFound ? 'No Round Tripping Detected' : 'Round Tripping Patterns Identified'}
              </h3>
              <p className="text-sm text-foreground">{data.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chains Table - Only show if chains exist */}
      {data.chains.length > 0 && (
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Link className="h-5 w-5" />
              Identified Transaction Chains ({data.chains.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Chain ID</TableHead>
                    <TableHead className="font-semibold">Involved Accounts</TableHead>
                    <TableHead className="font-semibold">Counterparties</TableHead>
                    <TableHead className="font-semibold text-center">Chain Length</TableHead>
                    <TableHead className="font-semibold text-right">Avg. Transaction Value</TableHead>
                    <TableHead className="font-semibold text-center">Time Proximity</TableHead>
                    <TableHead className="font-semibold text-center">Value Consistency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.chains.map((chain) => (
                    <TableRow key={chain.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">{chain.id}</TableCell>
                      <TableCell className="text-foreground">
                        <div className="flex flex-wrap gap-1">
                          {chain.involvedAccounts.map((acc, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {acc}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        <div className="flex flex-wrap gap-1">
                          {chain.counterparties.map((cp, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {cp}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-foreground">{chain.chainLength}</TableCell>
                      <TableCell className="text-right text-foreground">{formatCurrency(chain.averageTransactionValue)}</TableCell>
                      <TableCell className={`text-center font-medium ${getTimeProximityColor(chain.timeProximity)}`}>
                        {chain.timeProximity}
                      </TableCell>
                      <TableCell className={`text-center font-medium ${getConsistencyColor(chain.valueConsistency)}`}>
                        {chain.valueConsistency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
