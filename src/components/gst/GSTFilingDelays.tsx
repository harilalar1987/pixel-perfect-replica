import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { FilingDelay } from '@/types/gst';
import { motion } from 'framer-motion';

interface GSTFilingDelaysProps {
  filingDelays: FilingDelay[];
}

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;

export function GSTFilingDelays({ filingDelays }: GSTFilingDelaysProps) {
  const getDelayStatus = (days: number) => {
    if (days === 0) return { color: 'bg-status-success', label: 'On-time', icon: CheckCircle };
    if (days <= 5) return { color: 'bg-status-warning', label: 'Minor Delay', icon: AlertCircle };
    return { color: 'bg-status-error', label: 'Major Delay', icon: XCircle };
  };

  const getDelayCell = (days: number) => {
    if (days === 0) {
      return (
        <div className="w-10 h-10 rounded-md bg-status-success/20 border border-status-success/30 flex items-center justify-center">
          <span className="text-xs font-medium text-status-success">0</span>
        </div>
      );
    }
    if (days <= 5) {
      return (
        <div className="w-10 h-10 rounded-md bg-status-warning/20 border border-status-warning/30 flex items-center justify-center">
          <span className="text-xs font-bold text-status-warning">{days}</span>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-md bg-status-error/20 border border-status-error/30 flex items-center justify-center">
        <span className="text-xs font-bold text-status-error">{days}</span>
      </div>
    );
  };

  // Calculate summary stats
  const totalFilings = filingDelays.reduce((acc, year) => {
    return acc + Object.values(year.months).filter(d => d !== undefined).length;
  }, 0);

  const onTimeFilings = filingDelays.reduce((acc, year) => {
    return acc + Object.values(year.months).filter(d => d === 0).length;
  }, 0);

  const minorDelays = filingDelays.reduce((acc, year) => {
    return acc + Object.values(year.months).filter(d => d > 0 && d <= 5).length;
  }, 0);

  const majorDelays = filingDelays.reduce((acc, year) => {
    return acc + Object.values(year.months).filter(d => d > 5).length;
  }, 0);

  const onTimeRate = totalFilings > 0 ? ((onTimeFilings / totalFilings) * 100).toFixed(1) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            GSTR-3B Filing Delays
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">{onTimeRate}%</p>
              <p className="text-sm text-muted-foreground">On-Time Rate</p>
            </div>
            <div className="bg-status-success/10 border border-status-success/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-status-success">{onTimeFilings}</p>
              <p className="text-sm text-muted-foreground">On-Time</p>
            </div>
            <div className="bg-status-warning/10 border border-status-warning/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-status-warning">{minorDelays}</p>
              <p className="text-sm text-muted-foreground">Minor Delays (1-5d)</p>
            </div>
            <div className="bg-status-error/10 border border-status-error/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-status-error">{majorDelays}</p>
              <p className="text-sm text-muted-foreground">Major Delays (6+d)</p>
            </div>
          </div>

          {/* Filing Timeline */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-muted-foreground py-3 px-2 w-20">Year</th>
                  {months.map((month) => (
                    <th key={month} className="text-center text-xs font-medium text-muted-foreground py-3 px-1">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filingDelays.map((yearData, index) => (
                  <motion.tr
                    key={yearData.year}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-border"
                  >
                    <td className="py-3 px-2">
                      <span className="font-bold text-foreground">{yearData.year}</span>
                    </td>
                    {months.map((month) => (
                      <td key={month} className="py-3 px-1">
                        <div className="flex justify-center">
                          {getDelayCell(yearData.months[month])}
                        </div>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-status-success/20 border border-status-success/30" />
              <span className="text-sm text-muted-foreground">On-Time (0 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-status-warning/20 border border-status-warning/30" />
              <span className="text-sm text-muted-foreground">Minor Delay (1-5 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-status-error/20 border border-status-error/30" />
              <span className="text-sm text-muted-foreground">Major Delay (6+ days)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
