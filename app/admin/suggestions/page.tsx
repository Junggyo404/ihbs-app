'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import StatusSelect from '@/components/admin/StatusSelect';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import {
  adminGetSuggestions,
  adminUpdateSuggestionStatus,
  adminDeleteSuggestion,
} from '@/lib/supabase/adminQueries';
import type { Suggestion, SuggestionStatus } from '@/types';
import { SUGGESTION_STATUS_LABELS, SUGGESTION_CATEGORY_LABELS } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

const statusOptions = Object.entries(SUGGESTION_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }));

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewTarget, setViewTarget] = useState<Suggestion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Suggestion | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await adminGetSuggestions();
    setSuggestions(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: SuggestionStatus) => {
    await adminUpdateSuggestionStatus(id, status);
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteSuggestion(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminHeader title="건의함 관리" />
      <main className="p-4 md:p-6 space-y-4">
        <h2 className="text-lg font-black text-gray-900">접수된 건의사항</h2>
        {loading ? <LoadingState /> : suggestions.length === 0 ? (
          <EmptyState title="접수된 건의사항이 없습니다" icon={<MessageCircle size={36} />} />
        ) : (
          <AdminTable
            data={suggestions}
            columns={[
              { key: 'nickname', label: '작성자', render: (s) => s.is_anonymous ? '익명' : s.nickname },
              { key: 'category', label: '유형', render: (s) => <Badge label={SUGGESTION_CATEGORY_LABELS[s.category]} /> },
              { key: 'content', label: '내용', render: (s) => <span className="text-xs text-gray-600 line-clamp-2 max-w-xs block">{s.content}</span> },
              { key: 'status', label: '상태', render: (s) => (
                <StatusSelect value={s.status} options={statusOptions} onChange={(v) => handleStatusChange(s.id, v as SuggestionStatus)} />
              )},
              { key: 'created_at', label: '접수일', render: (s) => <span className="text-xs text-gray-400">{formatDateTime(s.created_at)}</span> },
            ]}
            actions={(s) => (
              <div className="flex gap-1">
                <button onClick={() => setViewTarget(s)} className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-lg hover:bg-blue-50">상세</button>
                <button onClick={() => setDeleteTarget(s)} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50">삭제</button>
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
                <Badge label={SUGGESTION_CATEGORY_LABELS[viewTarget.category]} />
                <p className="font-bold text-gray-900 mt-2">{viewTarget.is_anonymous ? '익명' : viewTarget.nickname}</p>
                <p className="text-xs text-gray-400">{formatDateTime(viewTarget.created_at)}</p>
              </div>
              <StatusSelect value={viewTarget.status} options={statusOptions} onChange={(v) => { handleStatusChange(viewTarget.id, v as SuggestionStatus); setViewTarget({ ...viewTarget, status: v as SuggestionStatus }); }} />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap">{viewTarget.content}</div>
            {viewTarget.need_reply && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full" /> 답변 요청
                {viewTarget.contact_info && <span className="text-gray-500 ml-1">— {viewTarget.contact_info}</span>}
              </div>
            )}
            <Button variant="secondary" fullWidth onClick={() => setViewTarget(null)}>닫기</Button>
          </div>
        </div>
      )}

      <Modal open={!!deleteTarget} title="건의사항 삭제" description="이 건의사항을 삭제하시겠습니까?"
        confirmLabel="삭제" confirmVariant="danger" loading={deleting}
        onConfirm={handleDelete} onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
