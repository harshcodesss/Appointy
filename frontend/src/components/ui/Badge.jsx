const variants = {
  default: 'bg-surface-200 text-muted',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-secondary-50 text-secondary-600',
  danger: 'bg-red-50 text-accent-500',
  warning: 'bg-amber-50 text-amber-700',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

const statusMap = {
  pending: { variant: 'warning', label: 'Pending' },
  confirmed: { variant: 'primary', label: 'Confirmed' },
  completed: { variant: 'success', label: 'Completed' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
};

export function StatusBadge({ status }) {
  const config = statusMap[status] || statusMap.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
