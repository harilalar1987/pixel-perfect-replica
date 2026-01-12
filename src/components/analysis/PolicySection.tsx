import { Policy } from '@/types/loan';
import { PolicyCard } from './PolicyCard';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface PolicySectionProps {
  title: string;
  policies: Policy[];
}

export function PolicySection({ title, policies }: PolicySectionProps) {
  const passCount = policies.filter((p) => p.status === 'pass').length;
  const failCount = policies.filter((p) => p.status === 'fail').length;
  const naCount = policies.filter((p) => p.status === 'not-available').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-success">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">{passCount} Pass</span>
          </div>
          <div className="flex items-center gap-1.5 text-destructive">
            <XCircle className="h-4 w-4" />
            <span className="font-medium">{failCount} Fail</span>
          </div>
          {naCount > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">{naCount} N/A</span>
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-3">
        {policies.map((policy, index) => (
          <PolicyCard key={policy.id} policy={policy} index={index} />
        ))}
      </div>
    </div>
  );
}
