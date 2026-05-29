'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardCard from '@/components/cards/DashboardCard';
import { adminGetDashboardStats } from '@/lib/supabase/adminQueries';
import { Radio, MessageSquare, Music, MessageCircle, FileText, Users, CalendarCheck } from 'lucide-react';

interface Stats {
  totalBroadcasts: number;
  pendingStories: number;
  pendingSongRequests: number;
  pendingSuggestions: number;
  totalScripts: number;
  totalMembers: number;
  hasTodayPlaylist: boolean;
}

const defaultStats: Stats = {
  totalBroadcasts: 0,
  pendingStories: 0,
  pendingSongRequests: 0,
  pendingSuggestions: 0,
  totalScripts: 0,
  totalMembers: 0,
  hasTodayPlaylist: false,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetDashboardStats()
      .then(setStats)
      .catch(() => setStats(defaultStats))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader title="대시보드" />
      <main className="p-4 md:p-6 space-y-6">
        <div>
          <h2 className="text-lg font-black text-gray-900">운영 현황</h2>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>

        {/* 미확인 항목 */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">미확인 항목</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <DashboardCard
              title="미확인 사연"
              value={loading ? '-' : stats.pendingStories}
              href="/admin/stories"
              icon={<MessageSquare size={18} />}
              accent={!loading && stats.pendingStories > 0}
            />
            <DashboardCard
              title="미확인 신청곡"
              value={loading ? '-' : stats.pendingSongRequests}
              href="/admin/song-requests"
              icon={<Music size={18} />}
              accent={!loading && stats.pendingSongRequests > 0}
            />
            <DashboardCard
              title="미확인 건의사항"
              value={loading ? '-' : stats.pendingSuggestions}
              href="/admin/suggestions"
              icon={<MessageCircle size={18} />}
              accent={!loading && stats.pendingSuggestions > 0}
            />
          </div>
        </div>

        {/* 등록 현황 */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">등록 현황</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <DashboardCard
              title="방송 일정"
              value={loading ? '-' : stats.totalBroadcasts}
              href="/admin/schedules"
              icon={<Radio size={18} />}
            />
            <DashboardCard
              title="등록 대본"
              value={loading ? '-' : stats.totalScripts}
              href="/admin/scripts"
              icon={<FileText size={18} />}
            />
            <DashboardCard
              title="방송국원"
              value={loading ? '-' : stats.totalMembers}
              href="/admin/members"
              icon={<Users size={18} />}
            />
            <DashboardCard
              title="오늘 플레이리스트"
              value={loading ? '-' : stats.hasTodayPlaylist ? '등록됨' : '미등록'}
              href="/admin/playlists"
              icon={<CalendarCheck size={18} />}
              accent={!loading && !stats.hasTodayPlaylist}
            />
          </div>
        </div>

        {/* 빠른 링크 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-bold text-gray-700 mb-3">빠른 작업</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/admin/schedules', label: '방송 일정 추가' },
              { href: '/admin/playlists', label: '플레이리스트 추가' },
              { href: '/admin/scripts', label: '대본 등록' },
              { href: '/admin/notices', label: '공지 작성' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-center py-2.5 px-3 rounded-xl border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-colors font-medium"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
