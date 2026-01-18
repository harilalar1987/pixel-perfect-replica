import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewNote, FinancialDiscussion, CharacterAssessment } from '@/types/personalDiscussion';
import { MessageSquare, TrendingUp, TrendingDown, Minus, Clock, IndianRupee, CreditCard, Landmark, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface InterviewNotesProps {
  notes: InterviewNote[];
  financials: FinancialDiscussion;
  character: CharacterAssessment;
}

export function InterviewNotes({ notes, financials, character }: InterviewNotesProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getRiskIcon = (indicator: string) => {
    switch (indicator) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-amber-500" />;
    }
  };

  const getRiskBadgeVariant = (indicator: string) => {
    switch (indicator) {
      case 'positive':
        return 'default';
      case 'negative':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Business: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      Financial: 'bg-green-500/10 text-green-600 border-green-500/20',
      Character: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      Collateral: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      Capacity: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
      General: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    };
    return colors[category] || colors.General;
  };

  const getAssessmentColor = (level: string) => {
    switch (level) {
      case 'Excellent':
      case 'Expert':
      case 'High':
      case 'Committed':
        return 'text-green-600';
      case 'Good':
      case 'Confident':
      case 'Medium':
        return 'text-blue-600';
      case 'Average':
      case 'Basic':
      case 'Uncertain':
        return 'text-amber-600';
      default:
        return 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Discussion Summary */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-primary" />
            Financial Discussion Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground">Current Turnover</p>
              <p className="font-display text-lg font-bold text-foreground">{formatCurrency(financials.currentTurnover)}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground">Projected Growth</p>
              <p className="font-display text-lg font-bold text-green-600">+{financials.projectedGrowth}%</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground">Profit Margin</p>
              <p className="font-display text-lg font-bold text-foreground">{financials.profitMargin}%</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground">Existing Loans</p>
              <p className="font-display text-lg font-bold text-foreground">{formatCurrency(financials.existingLoans)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Proposed EMI</p>
                <p className="font-medium text-foreground">{formatCurrency(financials.proposedEMI)}/month</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <Landmark className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Banking Relationship</p>
                <p className="font-medium text-foreground text-sm">{financials.bankingRelationship}</p>
              </div>
            </div>
            {financials.otherIncome && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <IndianRupee className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Other Income</p>
                  <p className="font-medium text-foreground text-sm">{financials.otherIncome}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Character Assessment */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Character Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">First Impression</p>
              <p className={`font-semibold ${getAssessmentColor(character.firstImpression)}`}>
                {character.firstImpression}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Communication</p>
              <p className={`font-semibold ${getAssessmentColor(character.communicationSkills)}`}>
                {character.communicationSkills}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Transparency</p>
              <p className={`font-semibold ${getAssessmentColor(character.transparency)}`}>
                {character.transparency}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Business Knowledge</p>
              <p className={`font-semibold ${getAssessmentColor(character.businessKnowledge)}`}>
                {character.businessKnowledge}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Repayment Attitude</p>
              <p className={`font-semibold ${getAssessmentColor(character.attitudeToRepayment)}`}>
                {character.attitudeToRepayment}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-sm text-muted-foreground font-medium mb-1">Overall Impression</p>
            <p className="text-foreground">{character.overallImpression}</p>
          </div>
        </CardContent>
      </Card>

      {/* Interview Notes */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Interview Notes ({notes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getCategoryColor(note.category)}>
                      {note.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(note.timestamp), 'HH:mm')}
                    </div>
                  </div>
                  <Badge variant={getRiskBadgeVariant(note.riskIndicator)} className="flex items-center gap-1">
                    {getRiskIcon(note.riskIndicator)}
                    {note.riskIndicator.charAt(0).toUpperCase() + note.riskIndicator.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Question</p>
                    <p className="text-foreground font-medium">{note.question}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Response</p>
                    <p className="text-foreground text-sm">{note.response}</p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Analyst Observation</p>
                    <p className="text-muted-foreground text-sm italic">{note.observation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
