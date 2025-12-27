import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Appointment statuses
  scheduled: { label: 'Scheduled', className: 'status-badge bg-primary/15 text-primary' },
  completed: { label: 'Completed', className: 'status-badge status-success' },
  cancelled: { label: 'Cancelled', className: 'status-badge status-error' },
  'no-show': { label: 'No Show', className: 'status-badge status-warning' },
  
  // Card statuses
  active: { label: 'Active', className: 'status-badge status-success' },
  expired: { label: 'Expired', className: 'status-badge status-error' },
  pending: { label: 'Pending', className: 'status-badge status-pending' },
  suspended: { label: 'Suspended', className: 'status-badge status-warning' },
  
  // Payment statuses
  approved: { label: 'Approved', className: 'status-badge status-success' },
  rejected: { label: 'Rejected', className: 'status-badge status-error' },
  'under-review': { label: 'Under Review', className: 'status-badge status-warning' },
  
  // Professional statuses
  inactive: { label: 'Inactive', className: 'status-badge status-pending' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'status-badge status-pending' };
  
  return (
    <span className={cn(config.className, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
