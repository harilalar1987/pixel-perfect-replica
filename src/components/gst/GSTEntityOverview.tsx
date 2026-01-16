import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, FileText, CreditCard, Hash } from 'lucide-react';
import { GSTEntityDetails, GSTAISummary } from '@/types/gst';
import { motion } from 'framer-motion';

interface GSTEntityOverviewProps {
  entityDetails: GSTEntityDetails;
  aiSummary: GSTAISummary;
}

export function GSTEntityOverview({ entityDetails, aiSummary }: GSTEntityOverviewProps) {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Entity Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Entity Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Hash className="h-4 w-4" />
                  GSTIN
                </div>
                <p className="font-medium text-foreground font-mono">{entityDetails.gstin}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <FileText className="h-4 w-4" />
                  Legal Name
                </div>
                <p className="font-medium text-foreground">{entityDetails.legalName}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Building2 className="h-4 w-4" />
                  Trade Name
                </div>
                <p className="font-medium text-foreground">{entityDetails.tradeName}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <CreditCard className="h-4 w-4" />
                  PAN
                </div>
                <p className="font-medium text-foreground font-mono">{entityDetails.pan}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Generated GST Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border bg-card shadow-card overflow-hidden">
          <div className="gradient-accent p-4">
            <CardTitle className="font-display flex items-center gap-2 text-accent-foreground">
              <span className="text-lg">✨</span>
              AI-Generated GST Summary
            </CardTitle>
          </div>
          <CardContent className="p-6 space-y-6">
            {/* Turnover Analysis */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Turnover Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Turnover</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(aiSummary.turnoverAnalysis.totalTurnover)}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Peak Month</p>
                  <p className="text-lg font-semibold text-status-success">
                    {aiSummary.turnoverAnalysis.peakMonth}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Lowest Month</p>
                  <p className="text-lg font-semibold text-status-warning">
                    {aiSummary.turnoverAnalysis.lowestMonth}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">YoY Growth</p>
                  <p className={`text-xl font-bold ${
                    aiSummary.turnoverAnalysis.yoyGrowth >= 0 ? 'text-status-success' : 'text-status-error'
                  }`}>
                    {aiSummary.turnoverAnalysis.yoyGrowth >= 0 ? '+' : ''}{aiSummary.turnoverAnalysis.yoyGrowth}%
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                <span>Current Period: {aiSummary.turnoverAnalysis.currentPeriod}</span>
                <span>•</span>
                <span>Previous Period: {aiSummary.turnoverAnalysis.previousPeriod}</span>
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3">Key Strengths</h4>
              <ul className="space-y-2">
                {aiSummary.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-status-success mt-0.5">✓</span>
                    <span className="text-muted-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Overall Assessment */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-display font-semibold text-foreground mb-2">Overall Assessment</h4>
              <p className="text-muted-foreground leading-relaxed">{aiSummary.overallAssessment}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
