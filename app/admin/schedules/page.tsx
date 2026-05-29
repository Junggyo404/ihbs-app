'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Textarea from '@/components/common/Textarea';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import {
  adminGetBroadcasts,
  adminCreateBroadcast,
  adminUpdateBroadcast,
  adminDeleteBroadcast,
} from '@/lib/supabase/adminQueries';
import type { Broadcast, BroadcastStatus, DayOfWeek } from '@/types';
import { BROADCAST_STATUS_LABELS, DAY_OF_WEEK_LABELS } from '@/types';
import { Plus, Radio } from 'lucide-react';

const dayOptions = Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => ({
  value,
  label: `${label}요일`,
}));
const statusOptions = Object.entries(BROADCAST_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const emptyForm = {
  title: '',
  day_of_week: 'monday' as DayOfWeek,
  broadcast_date: '',
  broadcast_time: '12:00',
  end_time: '',
  host: '',
  corner_name: '',
  description: '',
  status: 'scheduled' as BroadcastStatus,
};

export default function AdminSchedulesPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Broadcast | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Broadcast | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await adminGetBroadcasts();
    setBroadcasts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };
  const openEdit = (b: Broadcast) => {
    setEditing(b);
    setForm({
      title: b.title, day_of_week: b.day_of_week, broadcast_date: b.broadcast_date ?? '',
      broadcast_time: b.broadcast_time, end_time: b.end_time ?? '',
      host: b.host, corner_name: b.corner_name ?? '', description: b.description ?? '',
      status: b.status,
    });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError('방송 제목을 입력해주세요.'); return; }
    setSaving(true); setError('');
    try {
      if (editing) {
        await adminUpdateBroadcast(editing.id, form);
      } else {
        await adminCreateBroadcast(form);
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
      await adminDeleteBroadcast(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminHeader title="방송 스케줄 관리" />
      <main className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">방송 일정</h2>
          <Button size="sm" onClick={openCreate}>
            <Plus size={15} /> 추가
          </Button>
        </div>

        {loading ? (
          <LoadingState />
        ) : broadcasts.length === 0 ? (
          <EmptyState title="등록된 방송 일정이 없습니다" icon={<Radio size={36} />}
            action={<Button size="sm" onClick={openCreate}><Plus size={14} /> 일정 추가</Button>}
          />
        ) : (
          <AdminTable
            data={broadcasts}
            columns={[
              { key: 'title', label: '제목' },
              {
                key: 'day_of_week',
                label: '요일/날짜',
                render: (b) => b.broadcast_date
                  ? new Date(b.broadcast_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
                  : `${DAY_OF_WEEK_LABELS[b.day_of_week]}요일`,
              },
              { key: 'broadcast_time', label: '시간' },
              { key: 'host', label: '진행자' },
              {
                key: 'status',
                label: '상태',
                render: (b) => (
                  <Badge label={BROADCAST_STATUS_LABELS[b.status]} status={b.status} variant="status" />
                ),
              },
            ]}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </main>

      {/* 폼 모달 */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h3 className="font-bold text-gray-900">{editing ? '방송 일정 수정' : '방송 일정 추가'}</h3>
            <Input label="방송 제목" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Select label="요일" options={dayOptions} value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value as DayOfWeek })} />
            <Input label="방송 날짜 (특정일 지정 시)" type="date" value={form.broadcast_date} onChange={(e) => setForm({ ...form, broadcast_date: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="시작 시간" type="time" value={form.broadcast_time} onChange={(e) => setForm({ ...form, broadcast_time: e.target.value })} required />
              <Input label="종료 시간" type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
            </div>
            <Input label="진행자" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} />
            <Input label="코너명" value={form.corner_name} onChange={(e) => setForm({ ...form, corner_name: e.target.value })} />
            <Select label="상태" options={statusOptions} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BroadcastStatus })} />
            <Textarea label="설명" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" fullWidth onClick={() => setShowForm(false)} disabled={saving}>취소</Button>
              <Button fullWidth onClick={handleSave} loading={saving}>저장</Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={!!deleteTarget}
        title="방송 일정 삭제"
        description={`"${deleteTarget?.title}" 일정을 삭제하시겠습니까?`}
        confirmLabel="삭제"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
