import type { Broadcast } from '@/types';
import { BROADCAST_STATUS_LABELS, DAY_OF_WEEK_LABELS } from '@/types';
import Badge from '@/components/common/Badge';
import { formatTime } from '@/lib/utils';
import { Clock, User, Mic } from 'lucide-react';

interface BroadcastCardProps {
  broadcast: Broadcast;
}

export default function BroadcastCard({ broadcast }: BroadcastCardProps) {
  const isOnAir = broadcast.status === 'on_air';

  return (
    <div
      className={`bg-white rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md ${
        isOnAir ? 'border-green-300 bg-green-50' : 'border-gray-100'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {isOnAir && (
            <span className="flex items-center gap-1 text-green-600 text-xs font-bold shrink-0">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              ON AIR
            </span>
          )}
          <h3 className="font-bold text-gray-900 text-sm truncate">{broadcast.title}</h3>
        </div>
        <Badge
          label={BROADCAST_STATUS_LABELS[broadcast.status]}
          status={broadcast.status}
          variant="status"
        />
      </div>

      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="shrink-0" />
          <span>
            {broadcast.broadcast_date
              ? broadcast.broadcast_date
              : DAY_OF_WEEK_LABELS[broadcast.day_of_week] + '요일'}{' '}
            {formatTime(broadcast.broadcast_time)}
            {broadcast.end_time && ` ~ ${formatTime(broadcast.end_time)}`}
          </span>
        </div>
        {broadcast.host && (
          <div className="flex items-center gap-1.5">
            <User size={13} className="shrink-0" />
            <span>{broadcast.host}</span>
          </div>
        )}
        {broadcast.corner_name && (
          <div className="flex items-center gap-1.5">
            <Mic size={13} className="shrink-0" />
            <span>{broadcast.corner_name}</span>
          </div>
        )}
      </div>

      {broadcast.description && (
        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{broadcast.description}</p>
      )}
    </div>
  );
}
