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
  adminGetScripts,
  adminCreateScript,
  adminUpdateScript,
  adminDeleteScript,
} from '@/lib/supabase/adminQueries';
import type { Script } from '@/types';
import { Plus, FileText } from 'lucide-react';

const emptyForm = {
  title: '',
  broadcast_date: '',
  corner_name: '',
  writer: '',
  script_content: '',
  file_url: '',
  is_public: false,
  notes: '',
};

export default function AdminScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Script | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Script | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await adminGetScripts();
    setScripts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };
  const openEdit = (s: Script) => {
    setEditing(s);
    setForm({
      title: s.title, broadcast_date: s.broadcast_date ?? '', corner_name: s.corner_name ?? '',
      writer: s.writer ?? '', script_content: s.script_content ?? '', file_url: s.file_url ?? '',
      is_public: s.is_public, notes: s.notes ?? '',
    });
    setError(''); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError('대본 제목을 입력해주세요.'); return; }
    setSaving(true); setError('');
    try {
      if (editing) {
        await adminUpdateScript(editing.id, form);
      } else {
        await adminCreateScript(form);
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
      await adminDeleteScript(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminHeader title="대본 관리" />
      <main className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">대본 목록</h2>
          <Button size="sm" onClick={openCreate}><Plus size={15} /> 추가</Button>
        </div>

        {loading ? <LoadingState /> : scripts.length === 0 ? (
          <EmptyState title="등록된 대본이 없습니다" icon={<FileText size={36} />}
            action={<Button size="sm" onClick={openCreate}><Plus size={14} /> 대본 추가</Button>}
          />
        ) : (
          <AdminTable
            data={scripts}
            columns={[
              { key: 'title', label: '제목' },
              { key: 'broadcast_date', label: '방송일', render: (s) => s.broadcast_date ?? '-' },
              { key: 'corner_name', label: '코너명', render: (s) => s.corner_name ?? '-' },
              { key: 'writer', label: '작성자', render: (s) => s.writer ?? '-' },
              {
                key: 'is_public', label: '공개', render: (s) => (
                  <Badge label={s.is_public ? '공개' : '비공개'} status={s.is_public ? 'active' : 'inactive'} variant="status" />
                ),
              },
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
            <h3 className="font-bold text-gray-900">{editing ? '대본 수정' : '대본 추가'}</h3>
            <Input label="제목" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="방송 날짜" type="date" value={form.broadcast_date} onChange={(e) => setForm({ ...form, broadcast_date: e.target.value })} />
              <Input label="코너명" value={form.corner_name} onChange={(e) => setForm({ ...form, corner_name: e.target.value })} />
            </div>
            <Input label="작성자" value={form.writer} onChange={(e) => setForm({ ...form, writer: e.target.value })} />
            <Textarea label="대본 내용" value={form.script_content} onChange={(e) => setForm({ ...form, script_content: e.target.value })} rows={8} placeholder="대본 텍스트를 입력하거나 파일 URL을 입력하세요" />
            <Input label="파일 URL" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="https://..." />
            <Textarea label="비고" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
              공개 여부
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" fullWidth onClick={() => setShowForm(false)} disabled={saving}>취소</Button>
              <Button fullWidth onClick={handleSave} loading={saving}>저장</Button>
            </div>
          </div>
        </div>
      )}

      <Modal open={!!deleteTarget} title="대본 삭제"
        description={`"${deleteTarget?.title}" 대본을 삭제하시겠습니까?`}
        confirmLabel="삭제" confirmVariant="danger" loading={deleting}
        onConfirm={handleDelete} onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
