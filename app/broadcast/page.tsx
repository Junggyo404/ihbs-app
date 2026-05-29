import Header from '@/components/layout/Header';
import BottomTabBar from '@/components/layout/BottomTabBar';
import PageContainer from '@/components/layout/PageContainer';
import BroadcastCard from '@/components/cards/BroadcastCard';
import SectionTitle from '@/components/common/SectionTitle';
import EmptyState from '@/components/common/EmptyState';
import { getAllBroadcasts } from '@/lib/supabase/queries';
import type { Broadcast, DayOfWeek } from '@/types';
import { DAY_OF_WEEK_LABELS } from '@/types';
import { Radio } from 'lucide-react';

const DAY_ORDER: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

function groupByDay(broadcasts: Broadcast[]): Record<string, Broadcast[]> {
  const grouped: Record<string, Broadcast[]> = {};
  for (const b of broadcasts) {
    const key = b.broadcast_date ?? b.day_of_week;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  }
  return grouped;
}

export default async function BroadcastPage() {
  const broadcasts = await getAllBroadcasts();
  const grouped = groupByDay(broadcasts);

  const days = DAY_ORDER.filter((d) => grouped[d]);
  const datedBroadcasts = Object.keys(grouped).filter((k) => !DAY_ORDER.includes(k as DayOfWeek));

  return (
    <>
      <Header title="방송 편성표" subtitle="IHBS 방송 일정" />
      <PageContainer className="space-y-6 pt-5">
        {broadcasts.length === 0 ? (
          <EmptyState
            title="등록된 방송이 없습니다"
            description="아직 방송 편성표가 등록되지 않았습니다."
            icon={<Radio size={40} />}
          />
        ) : (
          <>
            {/* 날짜별 방송 */}
            {datedBroadcasts.sort().map((date) => (
              <section key={date}>
                <SectionTitle
                  title={new Date(date).toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short',
                  })}
                  className="mb-3"
                />
                <div className="space-y-2.5">
                  {grouped[date].map((b) => (
                    <BroadcastCard key={b.id} broadcast={b} />
                  ))}
                </div>
              </section>
            ))}

            {/* 요일별 정기 편성 */}
            {days.length > 0 && (
              <section>
                <SectionTitle title="정기 편성표" subtitle="매주 반복되는 방송" className="mb-3" />
                <div className="space-y-5">
                  {days.map((day) => (
                    <div key={day}>
                      <p className="text-xs font-bold text-[#1a3a6b] mb-2 flex items-center gap-1.5">
                        <span className="w-5 h-5 bg-[#1a3a6b] text-white rounded-full flex items-center justify-center text-[10px] font-black">
                          {DAY_OF_WEEK_LABELS[day]}
                        </span>
                        {DAY_OF_WEEK_LABELS[day]}요일
                      </p>
                      <div className="space-y-2">
                        {grouped[day].map((b) => (
                          <BroadcastCard key={b.id} broadcast={b} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </PageContainer>
      <BottomTabBar />
    </>
  );
}
