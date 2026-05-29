'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Radio, MessageSquare, Music, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: '홈', icon: Home },
  { href: '/broadcast', label: '방송', icon: Radio },
  { href: '/request', label: '사연·신청곡', icon: MessageSquare },
  { href: '/playlist', label: '플레이리스트', icon: Music },
  { href: '/suggestions', label: '건의함', icon: MessageCircle },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-pb">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-colors',
                isActive ? 'text-[#1a3a6b]' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={cn('text-[10px] font-medium', isActive ? 'font-semibold' : '')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
