import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinalRecommendation } from '@/types/cam';
import { Sparkles, CheckCircle2, AlertTriangle, Shield, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface FinalRecommendationCardProps {
  recommendation: FinalRecommendation;
}

export function FinalRecommendationCard({ recommendation }: FinalRecommendationCardProps) {
  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'Approve':
        return 'bg-green-500 text-white';
      case 'Conditional Approve':
        return 'bg-blue-500 text-white';
      case 'Reject':
        return 'bg-red-500 text-white';
      default:
        return 'bg-amber-500 text-white';
    }
  };

  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Final Recommendation
          </CardTitle>
          <Badge className={`${getDecisionBadge(recommendation.decision)} text-sm px-4 py-1`}>
            {recommendation.decision}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analyst Info */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{recommendation.analystName}</p>
              <p className="text-sm text-muted-foreground">{recommendation.analystDesignation}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(recommendation.recommendationDate), 'dd MMM yyyy')}
          </div>
        </div>

        {/* Rationale */}
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <h4 className="font-semibold text-foreground mb-2">Rationale</h4>
          <p className="text-sm text-foreground leading-relaxed">{recommendation.rationale}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conditions */}
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h4 className="font-semibold text-amber-600">Conditions for Approval</h4>
            </div>
            <ul className="space-y-2">
              {recommendation.conditions.map((condition, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-amber-600 font-medium mt-0.5">{index + 1}.</span>
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          {/* Mitigants */}
          <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-600">Risk Mitigants</h4>
            </div>
            <ul className="space-y-2">
              {recommendation.mitigants.map((mitigant, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  {mitigant}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
