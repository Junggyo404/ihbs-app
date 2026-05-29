import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  href?: string;
  icon?: React.ReactNode;
  accent?: boolean;
  className?: string;
}

export default function DashboardCard({
  title,
  value,
  description,
  href,
  icon,
  accent = false,
  className,
}: DashboardCardProps) {
  const content = (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2',
        accent && 'border-blue-200 bg-blue-50',
        href && 'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{title}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <p className={cn('text-2xl font-black', accent ? 'text-blue-700' : 'text-gray-900')}>
        {value}
      </p>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
