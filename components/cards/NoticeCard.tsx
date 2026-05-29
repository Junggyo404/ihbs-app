import type { Notice } from '@/types';
import { formatDate, truncate } from '@/lib/utils';
import { Bell } from 'lucide-react';

interface NoticeCardProps {
  notice: Notice;
}

export default function NoticeCard({ notice }: NoticeCardProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
        <Bell size={14} className="text-amber-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{notice.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
          {truncate(notice.content, 80)}
        </p>
        <p className="text-[10px] text-gray-300 mt-1">{formatDate(notice.created_at)}</p>
      </div>
    </div>
  );
}
