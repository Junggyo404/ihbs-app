import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function PageContainer({ children, className, noPadding = false }: PageContainerProps) {
  return (
    <main
      className={cn(
        'max-w-lg mx-auto pb-24 min-h-screen',
        !noPadding && 'px-4',
        className
      )}
    >
      {children}
    </main>
  );
}
