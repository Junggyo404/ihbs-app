import { cn, getStatusColor } from '@/lib/utils';

interface BadgeProps {
  label: string;
  status?: string;
  className?: string;
  variant?: 'default' | 'status';
}

export default function Badge({ label, status, className, variant = 'default' }: BadgeProps) {
  const colorClass = status ? getStatusColor(status) : 'bg-gray-100 text-gray-700';
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'status' ? colorClass : 'bg-blue-50 text-blue-700',
        className
      )}
    >
      {label}
    </span>
  );
}
