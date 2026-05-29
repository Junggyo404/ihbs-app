'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Radio, FileText, Music, MessageSquare,
  Disc, MessageCircle, Bell, Users, Settings, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

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

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-[#1a3a6b] text-white fixed left-0 top-0">
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#1a3a6b] text-xs font-black">IH</span>
          </div>
          <div>
            <p className="font-black text-base tracking-tight">IHBS</p>
            <p className="text-[10px] text-white/60">관리자</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
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
  );
}
