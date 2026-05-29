import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  right?: React.ReactNode;
  className?: string;
}

export default function Header({
  title,
  subtitle,
  showLogo = false,
  right,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100',
        className
      )}
    >
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {showLogo && (
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <div className="w-7 h-7 bg-[#1a3a6b] rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-black tracking-tight">IH</span>
              </div>
              <span className="text-[#1a3a6b] font-black text-base tracking-tight">IHBS</span>
            </Link>
          )}
          {!showLogo && title && (
            <div className="min-w-0">
              <h1 className="text-base font-bold text-gray-900 truncate">{title}</h1>
              {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
            </div>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </header>
  );
}
