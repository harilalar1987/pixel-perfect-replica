import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApprovalWorkflow } from '@/types/cam';
import { GitBranch, CheckCircle2, Clock, XCircle, PauseCircle, User, Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ApprovalWorkflowCardProps {
  workflow: ApprovalWorkflow;
}

export function ApprovalWorkflowCard({ workflow }: ApprovalWorkflowCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'on-hold':
        return <PauseCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'on-hold':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Urgent':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'Priority':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  const getSLABadge = (sla: string) => {
    switch (sla) {
      case 'Within SLA':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Approaching SLA':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
  };

  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Approval Workflow
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getUrgencyBadge(workflow.urgencyLevel)}>
              {workflow.urgencyLevel}
            </Badge>
            <Badge variant="outline" className={getSLABadge(workflow.slaStatus)}>
              {workflow.slaStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
          <div>
            <p className="text-sm text-muted-foreground">Approval Progress</p>
            <p className="font-display text-2xl font-bold text-foreground">
              Stage {workflow.currentStage} of {workflow.totalStages}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Target Date</p>
              <p className="font-medium text-foreground">{format(new Date(workflow.targetDate), 'dd MMM yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="relative">
          {workflow.steps.map((step, index) => (
            <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Connector Line */}
              {index < workflow.steps.length - 1 && (
                <div
                  className={`absolute left-[22px] top-[40px] w-0.5 h-[calc(100%-40px)] ${
                    step.status === 'approved' ? 'bg-green-500' : 'bg-border'
                  }`}
                />
              )}

              {/* Status Icon */}
              <div
                className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 ${
                  step.status === 'approved'
                    ? 'border-green-500 bg-green-500/10'
                    : step.status === 'pending'
                    ? 'border-border bg-background'
                    : step.status === 'rejected'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-amber-500 bg-amber-500/10'
                }`}
              >
                {getStatusIcon(step.status)}
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{step.role}</span>
                    <Badge variant="outline" className={getStatusBadge(step.status)}>
                      {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                    </Badge>
                  </div>
                  {step.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(step.timestamp), 'dd MMM yyyy, HH:mm')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="h-3 w-3" />
                  {step.name}
                </div>
                {step.comments && (
                  <div className="p-3 rounded-lg bg-secondary/30 text-sm text-foreground">
                    "{step.comments}"
                  </div>
                )}
                {step.status === 'pending' && index === workflow.currentStage && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    Awaiting approval
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
