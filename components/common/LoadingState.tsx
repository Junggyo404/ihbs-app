import { cn } from '@/lib/utils';

interface LoadingStateProps {
  className?: string;
  label?: string;
}

export default function LoadingState({ className, label = '불러오는 중...' }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 gap-3', className)}>
      <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
