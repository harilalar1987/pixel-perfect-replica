import { Policy } from '@/types/loan';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { motion } from 'framer-motion';

interface PolicyCardProps {
  policy: Policy;
  index: number;
}

export function PolicyCard({ policy, index }: PolicyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <Card className="border-border bg-card hover:shadow-card transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground text-sm">{policy.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {policy.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Threshold:</span>
                  <span className="font-medium text-foreground">{policy.threshold}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Actual:</span>
                  <span className="font-medium text-foreground">
                    {policy.actualValue !== null ? String(policy.actualValue) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Source:</span>
                  <span className="text-muted-foreground">{policy.dataSource}</span>
                </div>
              </div>
            </div>
            <StatusBadge
              variant={policy.status === 'pass' ? 'pass' : policy.status === 'fail' ? 'fail' : 'not-available'}
            >
              {policy.status === 'pass' ? 'PASS' : policy.status === 'fail' ? 'FAIL' : 'N/A'}
            </StatusBadge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
