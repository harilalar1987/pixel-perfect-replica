import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, Clock, FileCheck, Ban } from "lucide-react";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
  {
    variants: {
      variant: {
        pass: "bg-success/10 text-success border border-success/20",
        fail: "bg-destructive/10 text-destructive border border-destructive/20",
        "not-available": "bg-muted text-muted-foreground border border-border",
        draft: "bg-muted text-muted-foreground border border-border",
        "under-review": "bg-info/10 text-info border border-info/20",
        "pre-approved": "bg-warning/10 text-warning border border-warning/20",
        approved: "bg-success/10 text-success border border-success/20",
        rejected: "bg-destructive/10 text-destructive border border-destructive/20",
        processing: "bg-accent/10 text-accent border border-accent/20",
      },
    },
    defaultVariants: {
      variant: "draft",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  showIcon?: boolean;
}

const iconMap = {
  pass: CheckCircle2,
  fail: XCircle,
  "not-available": AlertCircle,
  draft: Clock,
  "under-review": Clock,
  "pre-approved": FileCheck,
  approved: CheckCircle2,
  rejected: Ban,
  processing: Clock,
};

export function StatusBadge({
  className,
  variant,
  showIcon = true,
  children,
  ...props
}: StatusBadgeProps) {
  const Icon = variant ? iconMap[variant] : null;

  return (
    <span className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {showIcon && Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
