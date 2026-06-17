import Link from 'next/link';
import Header from '@/components/layout/Header';
import BottomTabBar from '@/components/layout/BottomTabBar';
import PageContainer from '@/components/layout/PageContainer';
import BroadcastCard from '@/components/cards/BroadcastCard';
import PlaylistCard from '@/components/cards/PlaylistCard';
import NoticeCard from '@/components/cards/NoticeCard';
import SectionTitle from '@/components/common/SectionTitle';
import {
  getTodayBroadcasts,
  getTodayPlaylists,
  getPublicNotices,
  getAppSettings,
} from '@/lib/supabase/serverQueries';
import { MessageSquare, Music, MessageCircle, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [broadcasts, playlists, notices, settings] = await Promise.all([
    getTodayBroadcasts(),
    getTodayPlaylists(),
    getPublicNotices(),
    getAppSettings(),
  ]);

  const stationName = settings.station_name ?? 'IHBS';
  const stationDescription = settings.station_description ?? '우리 학교 공식 방송국';

  return (
    <>
      <Header showLogo />
      <PageContainer className="space-y-6 pt-5">
        {/* 히어로 */}
        <section className="bg-[#1a3a6b] rounded-2xl p-5 text-white">
          <p className="text-xs text-white/60 font-medium mb-1">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
          <h1 className="text-xl font-black mb-0.5">{stationName}</h1>
          <p className="text-sm text-white/80">{stationDescription}</p>
        </section>

        {/* 빠른 접근 */}
        <section>
          <SectionTitle title="바로가기" className="mb-3" />
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                href: '/request',
                icon: MessageSquare,
                label: '사연',
                bg: 'bg-blue-50',
                color: 'text-blue-600',
              },
              {
                href: '/request',
                icon: Music,
                label: '신청곡',
                bg: 'bg-purple-50',
                color: 'text-purple-600',
              },
              {
                href: '/suggestions',
                icon: MessageCircle,
                label: '건의함',
                bg: 'bg-green-50',
                color: 'text-green-600',
              },
            ].map(({ href, icon: Icon, label, bg, color }) => (
              <Link
                key={label}
                href={href}
                className={`${bg} rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity`}
              >
                <Icon size={22} className={color} />
                <span className="text-xs font-semibold text-gray-700">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 오늘의 방송 */}
        {broadcasts.length > 0 && (
          <section>
            <SectionTitle
              title="오늘의 방송"
              action={
                <Link
                  href="/broadcast"
                  className="flex items-center gap-0.5 text-xs text-blue-600 font-medium"
                >
                  전체 <ChevronRight size={14} />
                </Link>
              }
              className="mb-3"
            />
            <div className="space-y-2.5">
              {broadcasts.slice(0, 3).map((b) => (
                <BroadcastCard key={b.id} broadcast={b} />
              ))}
            </div>
          </section>
        )}

        {/* 오늘의 플레이리스트 */}
        {playlists.length > 0 && (
          <section>
            <SectionTitle
              title="오늘의 플레이리스트"
              action={
                <Link
                  href="/playlist"
                  className="flex items-center gap-0.5 text-xs text-blue-600 font-medium"
                >
                  전체 <ChevronRight size={14} />
                </Link>
              }
              className="mb-3"
            />
            <div className="card-padded">
              {playlists.slice(0, 5).map((p, i) => (
                <PlaylistCard key={p.id} playlist={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* 공지 */}
        {notices.length > 0 && (
          <section className="pb-2">
            <SectionTitle title="공지 & 안내" className="mb-3" />
            <div className="card-padded">
              {notices.map((n) => (
                <NoticeCard key={n.id} notice={n} />
              ))}
            </div>
          </section>
        )}
      </PageContainer>
      <BottomTabBar />
    </>
  );
}
