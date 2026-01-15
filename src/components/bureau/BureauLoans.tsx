import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { Building2, User, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { BureauLoan, LoanSummary } from '@/types/bureau';

interface BureauLoansProps {
  commercialLoans: BureauLoan[];
  individualLoans: BureauLoan[];
  commercialSummary: LoanSummary;
  individualSummary: LoanSummary;
}

const formatAmount = (amount: number) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

function LoanSummaryCard({ summary, title }: { summary: LoanSummary; title: string }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          <div className="p-3 rounded-lg bg-secondary text-center">
            <p className="text-xs text-muted-foreground">Total Accounts</p>
            <p className="text-xl font-bold">{summary.totalAccounts}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary text-center">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-xl font-bold text-status-pass">{summary.activeAccounts}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary text-center">
            <p className="text-xs text-muted-foreground">Closed</p>
            <p className="text-xl font-bold">{summary.closedAccounts}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary text-center">
            <p className="text-xs text-muted-foreground">Sanctioned</p>
            <p className="text-lg font-bold">{formatAmount(summary.totalSanctionedAmount)}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary text-center">
            <p className="text-xs text-muted-foreground">Outstanding</p>
            <p className="text-lg font-bold">{formatAmount(summary.totalOutstandingAmount)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoansTable({ loans }: { loans: BureauLoan[] }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Product Type</TableHead>
              <TableHead className="text-muted-foreground">Loan Amount</TableHead>
              <TableHead className="text-muted-foreground">Outstanding</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan, index) => (
              <motion.tr
                key={loan.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-border hover:bg-secondary/50"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{loan.productType}</p>
                      {loan.sanctionedDate && (
                        <p className="text-xs text-muted-foreground">{loan.sanctionedDate}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatAmount(loan.loanAmount)}</TableCell>
                <TableCell className="font-medium">
                  {loan.outstandingAmount === 0 ? (
                    <span className="text-muted-foreground">₹0</span>
                  ) : (
                    formatAmount(loan.outstandingAmount)
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={loan.status === 'ACTIVE' 
                      ? 'bg-status-pass/10 text-status-pass border-status-pass' 
                      : 'bg-secondary text-muted-foreground'
                    }
                  >
                    {loan.status === 'ACTIVE' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {loan.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {loan.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{loan.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function BureauLoans({ commercialLoans, individualLoans, commercialSummary, individualSummary }: BureauLoansProps) {
  return (
    <Tabs defaultValue="commercial" className="space-y-6">
      <TabsList className="bg-secondary">
        <TabsTrigger value="commercial" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" /> Commercial ({commercialLoans.length})
        </TabsTrigger>
        <TabsTrigger value="individual" className="flex items-center gap-2">
          <User className="h-4 w-4" /> Individual ({individualLoans.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="commercial" className="space-y-6">
        <LoanSummaryCard summary={commercialSummary} title="Commercial Loan Summary" />
        <LoansTable loans={commercialLoans} />
      </TabsContent>

      <TabsContent value="individual" className="space-y-6">
        <LoanSummaryCard summary={individualSummary} title="Individual Loan Summary" />
        <LoansTable loans={individualLoans} />
      </TabsContent>
    </Tabs>
  );
}
