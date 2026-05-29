'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import {
  adminGetNotices,
  adminCreateNotice,
  adminUpdateNotice,
  adminDeleteNotice,
} from '@/lib/supabase/adminQueries';
import type { Notice } from '@/types';
import { Plus, Bell } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const emptyForm = { title: '', content: '', category: '', author: '', is_public: true };

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await adminGetNotices();
    setNotices(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };
  const openEdit = (n: Notice) => {
    setEditing(n);
    setForm({ title: n.title, content: n.content, category: n.category ?? '', author: n.author ?? '', is_public: n.is_public });
    setError(''); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) { setError('제목과 내용을 입력해주세요.'); return; }
    setSaving(true); setError('');
    try {
      if (editing) {
        await adminUpdateNotice(editing.id, form);
      } else {
        await adminCreateNotice(form);
      }
      setShowForm(false);
      await load();
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteNotice(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminHeader title="공지 관리" />
      <main className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">공지 목록</h2>
          <Button size="sm" onClick={openCreate}><Plus size={15} /> 작성</Button>
        </div>

        {loading ? <LoadingState /> : notices.length === 0 ? (
          <EmptyState title="등록된 공지가 없습니다" icon={<Bell size={36} />}
            action={<Button size="sm" onClick={openCreate}><Plus size={14} /> 공지 작성</Button>}
          />
        ) : (
          <AdminTable
            data={notices}
            columns={[
              { key: 'title', label: '제목' },
              { key: 'category', label: '카테고리', render: (n) => n.category ?? '-' },
              { key: 'author', label: '작성자', render: (n) => n.author ?? '-' },
              { key: 'is_public', label: '공개', render: (n) => (
                <Badge label={n.is_public ? '공개' : '비공개'} status={n.is_public ? 'active' : 'inactive'} variant="status" />
              )},
              { key: 'created_at', label: '작성일', render: (n) => <span className="text-xs text-gray-400">{formatDate(n.created_at)}</span> },
            ]}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h3 className="font-bold text-gray-900">{editing ? '공지 수정' : '공지 작성'}</h3>
            <Input label="제목" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Textarea label="내용" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="카테고리" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="공지, 안내 등" />
              <Input label="작성자" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
              공개
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" fullWidth onClick={() => setShowForm(false)} disabled={saving}>취소</Button>
              <Button fullWidth onClick={handleSave} loading={saving}>저장</Button>
            </div>
          </div>
        </div>
      )}

      <Modal open={!!deleteTarget} title="공지 삭제"
        description={`"${deleteTarget?.title}" 공지를 삭제하시겠습니까?`}
        confirmLabel="삭제" confirmVariant="danger" loading={deleting}
        onConfirm={handleDelete} onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
