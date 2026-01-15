import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Calendar, Building2, User } from 'lucide-react';
import { BureauEnquiry, EnquiryMetrics } from '@/types/bureau';

interface BureauEnquiriesProps {
  enquiries: BureauEnquiry[];
  metrics: EnquiryMetrics;
}

const formatAmount = (amount: number) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export function BureauEnquiries({ enquiries, metrics }: BureauEnquiriesProps) {
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <Search className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{metrics.totalEnquiries}</p>
              <p className="text-xs text-muted-foreground">Total Enquiries</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-status-warning">{metrics.last30Days}</p>
              <p className="text-xs text-muted-foreground">Last 30 Days</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{metrics.last90Days}</p>
              <p className="text-xs text-muted-foreground">Last 90 Days</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{metrics.last180Days}</p>
              <p className="text-xs text-muted-foreground">Last 6 Months</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{metrics.last12Months}</p>
              <p className="text-xs text-muted-foreground">Last 12 Months</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enquiries Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Credit Enquiry History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Credit Lender</TableHead>
                <TableHead className="text-muted-foreground">Enquiry Date</TableHead>
                <TableHead className="text-muted-foreground">Credit Type</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Applicant Type</TableHead>
                <TableHead className="text-muted-foreground">Bureau Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((enquiry, index) => (
                <motion.tr
                  key={enquiry.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-border hover:bg-secondary/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {enquiry.creditLender === 'Not Disclosed' ? (
                        <span className="text-muted-foreground italic">{enquiry.creditLender}</span>
                      ) : (
                        <span className="font-medium">{enquiry.creditLender}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {enquiry.enquiryDate}
                    </div>
                  </TableCell>
                  <TableCell>{enquiry.creditType}</TableCell>
                  <TableCell className="font-medium">{formatAmount(enquiry.enquiryAmount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={enquiry.applicantType === 'Commercial' 
                        ? 'bg-primary/10 text-primary border-primary' 
                        : 'bg-accent/10 text-accent-foreground'
                      }
                    >
                      {enquiry.applicantType === 'Commercial' ? (
                        <Building2 className="h-3 w-3 mr-1" />
                      ) : (
                        <User className="h-3 w-3 mr-1" />
                      )}
                      {enquiry.applicantType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {enquiry.bureauSource}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Risk Interpretation */}
      <Card className="border-border bg-card bg-status-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Search className="h-5 w-5 text-status-warning mt-0.5" />
            <div>
              <p className="font-medium text-sm">Enquiry Analysis</p>
              <p className="text-sm text-muted-foreground mt-1">
                {metrics.last30Days >= 3 
                  ? 'High enquiry activity detected in last 30 days. This may indicate active credit shopping or liquidity stress.'
                  : 'Enquiry activity within normal limits. No signs of excessive credit seeking behavior.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
