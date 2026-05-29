'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import {
  adminGetPlaylists,
  adminCreatePlaylist,
  adminUpdatePlaylist,
  adminDeletePlaylist,
} from '@/lib/supabase/adminQueries';
import type { Playlist } from '@/types';
import { Plus, Music } from 'lucide-react';

const emptyForm = {
  broadcast_date: new Date().toISOString().split('T')[0],
  broadcast_title: '',
  song_title: '',
  artist: '',
  description: '',
  host: '',
  external_url: '',
  display_order: 1,
};

export default function AdminPlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Playlist | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Playlist | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await adminGetPlaylists();
    setPlaylists(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };
  const openEdit = (p: Playlist) => {
    setEditing(p);
    setForm({
      broadcast_date: p.broadcast_date, broadcast_title: p.broadcast_title,
      song_title: p.song_title, artist: p.artist, description: p.description ?? '',
      host: p.host ?? '', external_url: p.external_url ?? '', display_order: p.display_order,
    });
    setError(''); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.song_title.trim() || !form.artist.trim()) { setError('곡 제목과 가수명을 입력해주세요.'); return; }
    setSaving(true); setError('');
    try {
      if (editing) {
        await adminUpdatePlaylist(editing.id, form);
      } else {
        await adminCreatePlaylist(form);
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
      await adminDeletePlaylist(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminHeader title="플레이리스트 관리" />
      <main className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">플레이리스트</h2>
          <Button size="sm" onClick={openCreate}><Plus size={15} /> 추가</Button>
        </div>

        {loading ? <LoadingState /> : playlists.length === 0 ? (
          <EmptyState title="등록된 플레이리스트가 없습니다" icon={<Music size={36} />}
            action={<Button size="sm" onClick={openCreate}><Plus size={14} /> 곡 추가</Button>}
          />
        ) : (
          <AdminTable
            data={playlists}
            columns={[
              { key: 'broadcast_date', label: '날짜' },
              { key: 'broadcast_title', label: '방송 제목' },
              { key: 'song_title', label: '곡 제목' },
              { key: 'artist', label: '가수' },
              { key: 'display_order', label: '순서' },
            ]}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h3 className="font-bold text-gray-900">{editing ? '플레이리스트 수정' : '플레이리스트 추가'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input label="방송 날짜" type="date" value={form.broadcast_date} onChange={(e) => setForm({ ...form, broadcast_date: e.target.value })} required />
              <Input label="순서" type="number" value={String(form.display_order)} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 1 })} />
            </div>
            <Input label="방송 제목" value={form.broadcast_title} onChange={(e) => setForm({ ...form, broadcast_title: e.target.value })} />
            <Input label="곡 제목" value={form.song_title} onChange={(e) => setForm({ ...form, song_title: e.target.value })} required />
            <Input label="가수명" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} required />
            <Input label="방송 담당자" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} />
            <Textarea label="설명" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            <Input label="외부 링크" value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} placeholder="https://..." />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" fullWidth onClick={() => setShowForm(false)} disabled={saving}>취소</Button>
              <Button fullWidth onClick={handleSave} loading={saving}>저장</Button>
            </div>
          </div>
        </div>
      )}

      <Modal open={!!deleteTarget} title="곡 삭제"
        description={`"${deleteTarget?.song_title}" 곡을 삭제하시겠습니까?`}
        confirmLabel="삭제" confirmVariant="danger" loading={deleting}
        onConfirm={handleDelete} onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
