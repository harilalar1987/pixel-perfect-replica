import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinalRecommendation } from '@/types/cam';
import { Sparkles, CheckCircle2, AlertTriangle, Shield, User, Calendar, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useCreateDecisionRpc, useLoanDecision, useLoan } from '@/hooks/useLoans';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FinalRecommendationCardProps {
  recommendation: FinalRecommendation;
  loanId?: string;
}

export function FinalRecommendationCard({ recommendation, loanId }: FinalRecommendationCardProps) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const createDecisionRpc = useCreateDecisionRpc();
  const { data: existingDecision } = useLoanDecision(loanId);
  // Check whether the loan exists in the DB (guard against demo/mock rows)
  const { data: dbLoan, isLoading: dbLoanLoading } = useLoan(loanId);
  const isPersisted = !!dbLoan;

  const [decision, setDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [comments, setComments] = useState('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [decisionDate, setDecisionDate] = useState<Date | null>(null);

  // Load existing decision if available
  useEffect(() => {
    if (existingDecision) {
      setDecision(existingDecision.decision as 'approved' | 'rejected');
      setComments(existingDecision.comments || '');
      setDecisionDate(new Date(existingDecision.decided_at));
    }
  }, [existingDecision]);

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

  const handleApprove = async () => {
    if (!profile) {
      // No authenticated user — behave like demo fallback
      setDecision('approved');
      setShowApproveDialog(false);
      setDecisionDate(new Date());
      toast.success('Loan application approved successfully!', {
        description: `Decision recorded on ${format(new Date(), 'dd MMM yyyy, HH:mm')}`,
      });
      return;
    }

    // If we don't have a DB row, behave as demo (buttons are normally disabled in this case)
    if (!dbLoan) {
      setDecision('approved');
      setShowApproveDialog(false);
      setDecisionDate(new Date());
      toast.success('Loan application approved (local demo)', {
        description: `This decision was not persisted because the loan is not in the database.`,
      });
      return;
    }

    const targetLoanId = dbLoan.id;

    try {
      // Atomic RPC: insert decision + update status
      await createDecisionRpc.mutateAsync({
        loan_id: targetLoanId,
        decision: 'approved',
        comments: comments || null,
        decided_by: profile.id,
      });

      setDecision('approved');
      setDecisionDate(new Date());
      setShowApproveDialog(false);
      toast.success('Loan application approved!', {
        description: `Saved to database (application_id: ${dbLoan.application_id}) on ${format(new Date(), 'dd MMM yyyy, HH:mm')}`,
      });
    } catch (error) {
      console.error('Error saving approval for', { targetLoanId, application_id: dbLoan?.application_id, error });
      const msg = (error as any)?.message || 'Unexpected error saving approval';
      toast.error('Failed to save approval', { description: msg });
    }
  };

  const handleReject = async () => {
    if (!profile) {
      // No authenticated user — demo fallback
      setDecision('rejected');
      setShowRejectDialog(false);
      setDecisionDate(new Date());
      toast.error('Loan application rejected', {
        description: `Decision recorded on ${format(new Date(), 'dd MMM yyyy, HH:mm')}`,
      });
      return;
    }

    if (!dbLoan) {
      setDecision('rejected');
      setShowRejectDialog(false);
      setDecisionDate(new Date());
      toast.error('Loan application rejected (local demo)', {
        description: `This decision was not persisted because the loan is not in the database.`,
      });
      return;
    }

    const targetLoanId = dbLoan.id;

    try {
      await createDecisionRpc.mutateAsync({
        loan_id: targetLoanId,
        decision: 'rejected',
        comments: comments || null,
        decided_by: profile.id,
      });

      setDecision('rejected');
      setDecisionDate(new Date());
      setShowRejectDialog(false);
      toast.error('Loan application rejected', {
        description: `Decision saved to database (application_id: ${dbLoan.application_id}) on ${format(new Date(), 'dd MMM yyyy, HH:mm')}`,
      });
    } catch (error) {
      console.error('Error saving rejection for', { targetLoanId, application_id: dbLoan?.application_id, error });
      const msg = (error as any)?.message || 'Unexpected error saving rejection';
      toast.error('Failed to save rejection', { description: msg });
    }
  };

  const isLoading = createDecisionRpc.isPending;

  return (
    <>
      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Final Recommendation
            </CardTitle>
            <div className="flex items-center gap-2">
              {decision !== 'pending' && (
                <Badge className={`${decision === 'approved' ? 'bg-green-500' : 'bg-red-500'} text-white text-sm px-4 py-1`}>
                  {decision === 'approved' ? 'Approved' : 'Rejected'}
                </Badge>
              )}
              <Badge className={`${getDecisionBadge(recommendation.decision)} text-sm px-4 py-1`}>
                {recommendation.decision}
              </Badge>
            </div>
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

          {/* Decision Section */}
          {decision === 'pending' ? (
            <div className="p-4 rounded-lg border border-border bg-secondary/20">
              {/* Demo/data guard */}
              {!isPersisted && !dbLoanLoading && (
                <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between">
                  <div className="text-sm">
                    This appears to be demo/mock data and is not persisted to the database — actions like <strong>Approve</strong> are disabled.
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => navigate('/new-application')}>
                      Create in DB
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">Your Decision</h4>
              </div>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add your comments or observations (optional)..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="min-h-[80px] bg-background"
                />
                <div className="flex items-center gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setShowApproveDialog(true)}
                    disabled={isLoading || !isPersisted}
                  >
                    <ThumbsUp className="mr-2 h-5 w-5" />
                    Approve
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isLoading || !isPersisted}
                  >
                    <ThumbsDown className="mr-2 h-5 w-5" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-lg border ${decision === 'approved' ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
              <div className="flex items-center gap-3">
                {decision === 'approved' ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
                <div>
                  <p className={`font-semibold ${decision === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                    {decision === 'approved' ? 'You have approved this application' : 'You have rejected this application'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Decision recorded on {decisionDate ? format(decisionDate, 'dd MMM yyyy, HH:mm') : format(new Date(), 'dd MMM yyyy, HH:mm')}
                  </p>
                  {comments && (
                    <p className="text-sm text-foreground mt-2">"{comments}"</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              Confirm Approval
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this loan application? This action will be recorded and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-green-600 hover:bg-green-700" 
              onClick={handleApprove}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Approve Application'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <ThumbsDown className="h-5 w-5" />
              Confirm Rejection
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this loan application? This action will be recorded and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700" 
              onClick={handleReject}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Reject Application'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
