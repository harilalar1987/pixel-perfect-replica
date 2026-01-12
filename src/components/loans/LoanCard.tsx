import { LoanApplication } from '@/types/loan';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IndianRupee, Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface LoanCardProps {
  loan: LoanApplication;
  onClick: () => void;
}

const statusVariantMap: Record<string, 'draft' | 'under-review' | 'pre-approved' | 'approved' | 'rejected' | 'processing'> = {
  'Draft': 'draft',
  'Under Review': 'under-review',
  'Pre-Approved': 'pre-approved',
  'Approved': 'approved',
  'Rejected': 'rejected',
  'Processing': 'processing',
};

export function LoanCard({ loan, onClick }: LoanCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="group cursor-pointer border-border bg-card hover:shadow-elevated transition-all duration-300 overflow-hidden"
        onClick={onClick}
      >
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-start justify-between p-4 pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                  {getInitials(loan.customerName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                  {loan.customerName}
                </h3>
                <p className="text-xs text-muted-foreground">{loan.id}</p>
              </div>
            </div>
            <StatusBadge variant={statusVariantMap[loan.status]}>
              {loan.status}
            </StatusBadge>
          </div>

          {/* Body */}
          <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <span className="font-display font-semibold text-lg">
                  {formatAmount(loan.loanAmount)}
                </span>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                {loan.loanType}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span>{loan.assignedAnalyst}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{format(loan.updatedAt, 'dd MMM yyyy')}</span>
              </div>
            </div>
          </div>

          {/* Footer - hover reveal */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-muted-foreground">{loan.teamName}</span>
            <div className="flex items-center gap-1 text-xs font-medium text-accent">
              View Details
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
