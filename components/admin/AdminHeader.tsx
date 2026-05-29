'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, Home } from 'lucide-react';
import { signOut } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Radio, FileText, Music, MessageSquare,
  Disc, MessageCircle, Bell, Users, Settings,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/admin/schedules', label: '방송 스케줄', icon: Radio },
  { href: '/admin/scripts', label: '대본 관리', icon: FileText },
  { href: '/admin/playlists', label: '플레이리스트', icon: Music },
  { href: '/admin/stories', label: '사연', icon: MessageSquare },
  { href: '/admin/song-requests', label: '신청곡', icon: Disc },
  { href: '/admin/suggestions', label: '건의함', icon: MessageCircle },
  { href: '/admin/notices', label: '공지 관리', icon: Bell },
  { href: '/admin/members', label: '방송국원 관리', icon: Users },
  { href: '/admin/settings', label: '설정', icon: Settings },
];

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  return (
    <>
      <header className="lg:pl-56 sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="h-14 px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="메뉴 열기"
            >
              <Menu size={20} />
            </button>
            {title && <h1 className="font-bold text-gray-900 text-sm">{title}</h1>}
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home size={13} />
            학생 화면
          </Link>
        </div>
      </header>

      {/* 모바일 드로어 */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#1a3a6b] text-white flex flex-col shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#1a3a6b] text-xs font-black">IH</span>
                </div>
                <span className="font-black text-sm">IHBS 관리자</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-3 overflow-y-auto">
              <ul className="space-y-0.5">
                {navItems.map(({ href, label, icon: Icon, exact }) => {
                  const isActive = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors',
                          isActive
                            ? 'bg-white/20 text-white font-semibold'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        <Icon size={16} />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="p-3 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
