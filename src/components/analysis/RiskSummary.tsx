import { RiskAssessment } from '@/types/loan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface RiskSummaryProps {
  assessment: RiskAssessment;
}

export function RiskSummary({ assessment }: RiskSummaryProps) {
  const getRiskColor = (category: string) => {
    switch (category) {
      case 'Low Risk':
        return 'text-success';
      case 'Medium Risk':
        return 'text-warning';
      case 'High Risk':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-success';
    if (score >= 40) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border bg-card overflow-hidden">
          <CardHeader className="gradient-primary text-primary-foreground pb-8">
            <CardTitle className="font-display text-lg">AI-Powered Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="relative -mt-6">
              <div className="bg-card rounded-xl border border-border p-6 shadow-elevated">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-display font-bold text-foreground">
                      {assessment.criteriaPassed}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                      <TrendingUp className="h-4 w-4 text-success" />
                      Criteria Passed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display font-bold text-foreground">
                      {assessment.criteriaFailed}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                      <TrendingDown className="h-4 w-4 text-destructive" />
                      Criteria Failed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display font-bold text-accent">
                      {assessment.overallRiskScore}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Risk Score</div>
                    <div className="mt-2">
                      <Progress
                        value={assessment.overallRiskScore}
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-display font-bold ${getRiskColor(assessment.riskCategory)}`}>
                      {assessment.riskCategory}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Risk Category</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full border-border bg-card border-l-4 border-l-success">
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {assessment.keyStrengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-success mt-2 shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Concerns */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="h-full border-border bg-card border-l-4 border-l-destructive">
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Key Concerns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {assessment.keyConcerns.map((concern, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border-border bg-card border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-4">
              {assessment.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3"
                >
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-accent text-accent-foreground text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center px-4">
        This AI Summary is generated based on predefined risk assessment criteria, incorporating bureau scores, 
        GST compliance behaviour, banking patterns, and cross-document consistency checks. It serves as an 
        initial pre-screening assessment to support faster and more informed lending decisions.
      </p>
    </div>
  );
}
