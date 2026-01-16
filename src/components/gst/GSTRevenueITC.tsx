import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, TrendingUp, TrendingDown, Receipt, IndianRupee } from 'lucide-react';
import { RevenueComparison, ITCComparison, AnnualGrossAnalysis, AnnualNetAnalysis } from '@/types/gst';
import { motion } from 'framer-motion';

interface GSTRevenueITCProps {
  revenueComparison: RevenueComparison;
  itcComparison: ITCComparison;
  grossAnalysis: AnnualGrossAnalysis;
  netAnalysis: AnnualNetAnalysis;
}

export function GSTRevenueITC({
  revenueComparison,
  itcComparison,
  grossAnalysis,
  netAnalysis,
}: GSTRevenueITCProps) {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const getVarianceColor = (variance: number) => {
    if (variance <= 2) return 'text-status-success';
    if (variance <= 5) return 'text-status-warning';
    return 'text-status-error';
  };

  const getVarianceBg = (variance: number) => {
    if (variance <= 2) return 'bg-status-success/10 border-status-success/20';
    if (variance <= 5) return 'bg-status-warning/10 border-status-warning/20';
    return 'bg-status-error/10 border-status-error/20';
  };

  return (
    <div className="space-y-6">
      {/* Revenue & ITC Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Comparison */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-border bg-card shadow-card h-full">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <ArrowUpDown className="h-5 w-5 text-primary" />
                Revenue Comparison (GSTR-1 vs GSTR-3B)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">GSTR-1 Revenue</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(revenueComparison.gstr1Revenue)}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">GSTR-3B Revenue</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(revenueComparison.gstr3bRevenue)}
                  </p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${getVarianceBg(revenueComparison.variancePercentage)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Variance</span>
                  <span className={`text-lg font-bold ${getVarianceColor(revenueComparison.variancePercentage)}`}>
                    {revenueComparison.variancePercentage}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {revenueComparison.variancePercentage <= 2
                    ? 'Good alignment between GSTR-1 and GSTR-3B'
                    : revenueComparison.variancePercentage <= 5
                    ? 'Minor variance detected - review recommended'
                    : 'High variance - requires investigation'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ITC Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-border bg-card shadow-card h-full">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <Receipt className="h-5 w-5 text-primary" />
                ITC Comparison (GSTR-3B vs GSTR-2A)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">GSTR-3B ITC</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(itcComparison.gstr3bITC)}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">GSTR-2A ITC</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(itcComparison.gstr2aITC)}
                  </p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${getVarianceBg(itcComparison.variancePercentage)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Variance</span>
                  <span className={`text-lg font-bold ${getVarianceColor(itcComparison.variancePercentage)}`}>
                    {itcComparison.variancePercentage}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Analysis Period: {itcComparison.analysisPeriod}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Annual Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gross Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border bg-card shadow-card h-full">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Annual Gross Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Revenue</p>
                  <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Current Period</p>
                      <p className="font-bold text-foreground">{formatCurrency(grossAnalysis.currentPeriodRevenue)}</p>
                    </div>
                    <div className="text-center">
                      <span className={`text-sm font-bold ${grossAnalysis.yoyRevenueGrowth >= 0 ? 'text-status-success' : 'text-status-error'}`}>
                        {grossAnalysis.yoyRevenueGrowth >= 0 ? '+' : ''}{grossAnalysis.yoyRevenueGrowth}%
                      </span>
                      <p className="text-xs text-muted-foreground">YoY Growth</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Previous Period</p>
                      <p className="font-bold text-foreground">{formatCurrency(grossAnalysis.previousPeriodRevenue)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Purchases</p>
                  <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Current Period</p>
                      <p className="font-bold text-foreground">{formatCurrency(grossAnalysis.currentPeriodPurchases)}</p>
                    </div>
                    <div className="w-12 h-0.5 bg-border" />
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Previous Period</p>
                      <p className="font-bold text-foreground">{formatCurrency(grossAnalysis.previousPeriodPurchases)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Net Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-card shadow-card h-full">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <IndianRupee className="h-5 w-5 text-primary" />
                Annual Net Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-status-success/10 border border-status-success/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Net Revenue</p>
                  <p className="text-xl font-bold text-status-success">
                    {formatCurrency(netAnalysis.netRevenue)}
                  </p>
                </div>
                <div className="bg-status-warning/10 border border-status-warning/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Net Purchases</p>
                  <p className="text-xl font-bold text-status-warning">
                    {formatCurrency(netAnalysis.netPurchases)}
                  </p>
                </div>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">YoY Net Change</span>
                  <div className="flex items-center gap-2">
                    {netAnalysis.yoyNetChange >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-status-success" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-status-error" />
                    )}
                    <span className={`text-lg font-bold ${
                      netAnalysis.yoyNetChange >= 0 ? 'text-status-success' : 'text-status-error'
                    }`}>
                      {netAnalysis.yoyNetChange >= 0 ? '+' : ''}{netAnalysis.yoyNetChange}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
