import type { Playlist } from '@/types';
import { Music, ExternalLink } from 'lucide-react';

interface PlaylistCardProps {
  playlist: Playlist;
  index?: number;
}

export default function PlaylistCard({ playlist, index }: PlaylistCardProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-[#1a3a6b]/10 flex items-center justify-center shrink-0">
        {index != null ? (
          <span className="text-xs font-bold text-[#1a3a6b]">{index + 1}</span>
        ) : (
          <Music size={16} className="text-[#1a3a6b]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{playlist.song_title}</p>
            <p className="text-xs text-gray-500 truncate">{playlist.artist}</p>
          </div>
          {playlist.external_url && (
            <a
              href={playlist.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-blue-500 hover:text-blue-700 transition-colors"
              aria-label="외부 링크"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
        {playlist.description && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{playlist.description}</p>
        )}
      </div>
    </div>
  );
}
