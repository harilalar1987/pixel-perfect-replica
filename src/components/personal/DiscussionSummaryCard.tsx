import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DiscussionSummary } from '@/types/personalDiscussion';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, ClipboardCheck, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DiscussionSummaryCardProps {
  summary: DiscussionSummary;
}

export function DiscussionSummaryCard({ summary }: DiscussionSummaryCardProps) {
  const getAssessmentColor = (assessment: string) => {
    switch (assessment) {
      case 'Favorable':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Conditionally Favorable':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Discussion Summary & Assessment
          </CardTitle>
          <Badge variant="outline" className={`${getAssessmentColor(summary.overallAssessment)} text-sm px-3 py-1`}>
            {summary.overallAssessment}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Confidence Score */}
        <div className="p-4 rounded-lg bg-secondary/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Confidence Score</span>
            <span className={`font-display text-2xl font-bold ${getConfidenceColor(summary.confidenceScore)}`}>
              {summary.confidenceScore}%
            </span>
          </div>
          <Progress value={summary.confidenceScore} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-600">Key Strengths</h4>
            </div>
            <ul className="space-y-2">
              {summary.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-green-600 mt-1">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Concerns */}
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h4 className="font-semibold text-amber-600">Key Concerns</h4>
            </div>
            <ul className="space-y-2">
              {summary.concerns.map((concern, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-amber-600 mt-1">•</span>
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-primary">Recommendations</h4>
          </div>
          <ul className="space-y-2">
            {summary.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-primary mt-1">{index + 1}.</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>

        {/* Verification Required */}
        <div className="p-4 rounded-lg border border-border bg-secondary/30">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-semibold text-foreground">Verification Required</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {summary.verificationRequired.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
