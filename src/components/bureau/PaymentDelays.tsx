import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, CreditCard } from 'lucide-react';
import { LoanPaymentDelay } from '@/types/bureau';
import { cn } from '@/lib/utils';

interface PaymentDelaysProps {
  delays: LoanPaymentDelay[];
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const getDelayColor = (dpd: number | null) => {
  if (dpd === null) return 'bg-muted text-muted-foreground';
  if (dpd === 0) return 'bg-status-pass/20 text-status-pass';
  if (dpd <= 5) return 'bg-status-warning/20 text-status-warning';
  return 'bg-status-fail/20 text-status-fail';
};

const getDelayText = (dpd: number | null) => {
  if (dpd === null) return '–';
  if (dpd === 0) return '0';
  return `${dpd}`;
};

const formatAmount = (amount: number) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export function PaymentDelays({ delays }: PaymentDelaysProps) {
  return (
    <div className="space-y-6">
      {/* Legend */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            <p className="text-sm font-medium">Payment Delay Classification:</p>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-status-pass/20" />
              <span className="text-xs text-muted-foreground">No Delay (0 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-status-warning/20" />
              <span className="text-xs text-muted-foreground">Minor Delay (1-5 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-status-fail/20" />
              <span className="text-xs text-muted-foreground">Major Delay (6+ days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-muted" />
              <span className="text-xs text-muted-foreground">No Data</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Payment Delay Cards */}
      {delays.map((loan, loanIndex) => (
        <motion.div
          key={loan.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: loanIndex * 0.1 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{loan.loanType}</CardTitle>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Amount: <span className="font-medium text-foreground">{formatAmount(loan.loanAmount)}</span></span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Sanctioned: {loan.sanctionedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Payment Timeline Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-muted-foreground font-medium w-16">Year</th>
                      {MONTHS.map(month => (
                        <th key={month} className="p-2 text-center text-muted-foreground font-medium w-10">
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loan.delays.map((yearData, yearIndex) => (
                      <tr key={yearData.year} className="border-t border-border">
                        <td className="p-2 font-medium">{yearData.year}</td>
                        {MONTHS.map(month => {
                          const dpd = yearData.months[month];
                          return (
                            <td key={month} className="p-1 text-center">
                              <div
                                className={cn(
                                  'h-8 w-8 mx-auto rounded flex items-center justify-center font-medium text-xs',
                                  getDelayColor(dpd)
                                )}
                              >
                                {getDelayText(dpd)}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4">
                {(() => {
                  const allMonths = loan.delays.flatMap(y => Object.values(y.months));
                  const validMonths = allMonths.filter(v => v !== null) as number[];
                  const noDelays = validMonths.filter(v => v === 0).length;
                  const minorDelays = validMonths.filter(v => v > 0 && v <= 5).length;
                  const majorDelays = validMonths.filter(v => v > 5).length;
                  
                  return (
                    <>
                      <Badge variant="outline" className="bg-status-pass/10 text-status-pass">
                        {noDelays} months on-time
                      </Badge>
                      {minorDelays > 0 && (
                        <Badge variant="outline" className="bg-status-warning/10 text-status-warning">
                          {minorDelays} minor delays
                        </Badge>
                      )}
                      {majorDelays > 0 && (
                        <Badge variant="outline" className="bg-status-fail/10 text-status-fail">
                          {majorDelays} major delays
                        </Badge>
                      )}
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Risk Summary */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Payment Delay Risk Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The payment delays module shows loan-level repayment behavior over time. 
            Isolated minor delays may indicate temporary liquidity issues, while repeated major delays 
            suggest chronic repayment stress. This data directly feeds into credit risk scoring and policy checks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
