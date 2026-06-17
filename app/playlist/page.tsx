import Header from '@/components/layout/Header';
import BottomTabBar from '@/components/layout/BottomTabBar';
import PageContainer from '@/components/layout/PageContainer';
import PlaylistCard from '@/components/cards/PlaylistCard';
import SectionTitle from '@/components/common/SectionTitle';
import EmptyState from '@/components/common/EmptyState';
import { getAllPlaylists } from '@/lib/supabase/serverQueries';
import type { Playlist } from '@/types';
import { Music } from 'lucide-react';

function groupByDate(playlists: Playlist[]): Record<string, Playlist[]> {
  const grouped: Record<string, Playlist[]> = {};
  for (const p of playlists) {
    if (!grouped[p.broadcast_date]) grouped[p.broadcast_date] = [];
    grouped[p.broadcast_date].push(p);
  }
  return grouped;
}

export default async function PlaylistPage() {
  const playlists = await getAllPlaylists();
  const grouped = groupByDate(playlists);
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <Header title="플레이리스트" subtitle="점심방송 선곡 목록" />
      <PageContainer className="space-y-6 pt-5">
        {playlists.length === 0 ? (
          <EmptyState
            title="등록된 플레이리스트가 없습니다"
            description="아직 플레이리스트가 등록되지 않았습니다."
            icon={<Music size={40} />}
          />
        ) : (
          dates.map((date) => (
            <section key={date}>
              <SectionTitle
                title={new Date(date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}
                subtitle={grouped[date][0]?.broadcast_title}
                className="mb-3"
              />
              <div className="card-padded">
                {grouped[date].map((p, i) => (
                  <PlaylistCard key={p.id} playlist={p} index={i} />
                ))}
              </div>
            </section>
          ))
        )}
      </PageContainer>
      <BottomTabBar />
    </>
  );
}
