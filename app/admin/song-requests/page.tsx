'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import StatusSelect from '@/components/admin/StatusSelect';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import {
  adminGetSongRequests,
  adminUpdateSongRequestStatus,
  adminDeleteSongRequest,
} from '@/lib/supabase/adminQueries';
import type { SongRequest, SongRequestStatus } from '@/types';
import { SONG_REQUEST_STATUS_LABELS } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Disc } from 'lucide-react';

const statusOptions = Object.entries(SONG_REQUEST_STATUS_LABELS).map(([value, label]) => ({ value, label }));

export default function AdminSongRequestsPage() {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewTarget, setViewTarget] = useState<SongRequest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SongRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await adminGetSongRequests();
    setRequests(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: SongRequestStatus) => {
    await adminUpdateSongRequestStatus(id, status);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteSongRequest(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminHeader title="신청곡 관리" />
      <main className="p-4 md:p-6 space-y-4">
        <h2 className="text-lg font-black text-gray-900">접수된 신청곡</h2>
        {loading ? <LoadingState /> : requests.length === 0 ? (
          <EmptyState title="접수된 신청곡이 없습니다" icon={<Disc size={36} />} />
        ) : (
          <AdminTable
            data={requests}
            columns={[
              { key: 'nickname', label: '신청자', render: (r) => r.is_anonymous ? '익명' : r.nickname },
              { key: 'song_title', label: '곡 제목' },
              { key: 'artist', label: '가수' },
              { key: 'status', label: '상태', render: (r) => (
                <StatusSelect
                  value={r.status}
                  options={statusOptions}
                  onChange={(v) => handleStatusChange(r.id, v as SongRequestStatus)}
                />
              )},
              { key: 'created_at', label: '접수일', render: (r) => <span className="text-xs text-gray-400">{formatDateTime(r.created_at)}</span> },
            ]}
            actions={(r) => (
              <div className="flex gap-1">
                <button onClick={() => setViewTarget(r)} className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">상세</button>
                <button onClick={() => setDeleteTarget(r)} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">삭제</button>
              </div>
            )}
          />
        )}
      </main>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-900">{viewTarget.song_title}</p>
                <p className="text-sm text-gray-500">{viewTarget.artist}</p>
                <p className="text-xs text-gray-400 mt-1">
                  신청: {viewTarget.is_anonymous ? '익명' : viewTarget.nickname} · {formatDateTime(viewTarget.created_at)}
                </p>
              </div>
              <StatusSelect
                value={viewTarget.status}
                options={statusOptions}
                onChange={(v) => {
                  handleStatusChange(viewTarget.id, v as SongRequestStatus);
                  setViewTarget({ ...viewTarget, status: v as SongRequestStatus });
                }}
              />
            </div>
            {viewTarget.message && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
                <p className="text-xs text-gray-400 mb-1">메시지</p>
                {viewTarget.message}
              </div>
            )}
            {viewTarget.contact_allowed && viewTarget.contact_info && (
              <p className="text-xs text-gray-500">연락처: <span className="font-medium">{viewTarget.contact_info}</span></p>
            )}
            <Button variant="secondary" fullWidth onClick={() => setViewTarget(null)}>닫기</Button>
          </div>
        </div>
      )}

      <Modal open={!!deleteTarget} title="신청곡 삭제"
        description="이 신청곡을 삭제하시겠습니까?"
        confirmLabel="삭제" confirmVariant="danger" loading={deleting}
        onConfirm={handleDelete} onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
