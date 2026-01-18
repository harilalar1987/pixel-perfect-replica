import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskScoring } from '@/types/cam';
import { Shield, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RiskScoringCardProps {
  riskScoring: RiskScoring;
}

export function RiskScoringCard({ riskScoring }: RiskScoringCardProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-500';
      case 'B':
        return 'bg-blue-500';
      case 'C':
        return 'bg-amber-500';
      case 'D':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Low Risk':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Moderate Risk':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Medium Risk':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'High Risk':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default:
        return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
  };

  const scorePercentage = (riskScoring.totalScore / riskScoring.maxTotalScore) * 100;

  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Risk Scoring Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center gap-6 p-4 rounded-lg bg-secondary/30">
          <div className={`h-20 w-20 rounded-full ${getGradeColor(riskScoring.riskGrade)} flex items-center justify-center`}>
            <span className="font-display text-3xl font-bold text-white">{riskScoring.riskGrade}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Overall Risk Score</span>
              <span className="font-display text-2xl font-bold text-foreground">
                {riskScoring.totalScore}/{riskScoring.maxTotalScore}
              </span>
            </div>
            <Progress value={scorePercentage} className="h-3 mb-2" />
            <Badge variant="outline" className={getCategoryBadge(riskScoring.riskCategory)}>
              {riskScoring.riskCategory}
            </Badge>
          </div>
        </div>

        {/* Score Components */}
        <div className="space-y-3">
          {riskScoring.components.map((component, index) => (
            <div key={index} className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{component.category}</span>
                  <Badge variant="secondary" className="text-xs">
                    Weight: {component.weight}%
                  </Badge>
                </div>
                <span className="font-display font-bold text-foreground">
                  {component.score}/{component.maxScore}
                </span>
              </div>
              <Progress value={(component.score / component.maxScore) * 100} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">{component.remarks}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
