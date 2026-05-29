'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { adminGetProfiles, adminUpdateProfile } from '@/lib/supabase/adminQueries';
import type { Profile, UserRole, UserStatus } from '@/types';
import { Plus, Users } from 'lucide-react';

const roleOptions = [
  { value: 'staff', label: '방송국원' },
  { value: 'super_admin', label: '최고관리자' },
];
const statusOptions = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
];

export default function AdminMembersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: '', department: '', position: '', role: 'staff' as UserRole, status: 'active' as UserStatus });
  const [saving, setSaving] = useState(false);
  const [showCreateInfo, setShowCreateInfo] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await adminGetProfiles();
    setProfiles(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (p: Profile) => {
    setEditing(p);
    setForm({ name: p.name, department: p.department ?? '', position: p.position ?? '', role: p.role, status: p.status });
    setError('');
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!form.name.trim()) { setError('이름을 입력해주세요.'); return; }
    setSaving(true); setError('');
    try {
      await adminUpdateProfile(editing.id, form);
      setEditing(null);
      await load();
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminHeader title="방송국원 관리" />
      <main className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">방송국원 목록</h2>
            <p className="text-xs text-gray-500">최고관리자만 접근 가능한 페이지입니다</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowCreateInfo(true)}>
            <Plus size={15} /> 계정 추가
          </Button>
        </div>

        {loading ? <LoadingState /> : profiles.length === 0 ? (
          <EmptyState title="등록된 방송국원이 없습니다" icon={<Users size={36} />} />
        ) : (
          <AdminTable
            data={profiles}
            columns={[
              { key: 'student_id', label: '학번' },
              { key: 'name', label: '이름' },
              { key: 'department', label: '부서', render: (p) => p.department ?? '-' },
              { key: 'role', label: '권한', render: (p) => (
                <Badge label={p.role === 'super_admin' ? '최고관리자' : '방송국원'} status={p.role === 'super_admin' ? 'aired' : 'confirmed'} variant="status" />
              )},
              { key: 'status', label: '상태', render: (p) => (
                <Badge label={p.status === 'active' ? '활성' : '비활성'} status={p.status} variant="status" />
              )},
            ]}
            onEdit={openEdit}
          />
        )}

        {/* 계정 생성 안내 */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">방송국원 계정 생성 방법</p>
          <p className="text-xs text-blue-600">
            신규 방송국원 계정은 보안을 위해 Supabase 대시보드 또는 서버 API를 통해 생성합니다.
            자세한 방법은 <code className="bg-blue-100 px-1 rounded">docs/ADMIN_GUIDE.md</code>를 참고하세요.
          </p>
        </div>
      </main>

      {/* 수정 모달 */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900">방송국원 정보 수정</h3>
            <div className="bg-gray-50 rounded-xl px-4 py-2">
              <p className="text-xs text-gray-500">학번</p>
              <p className="font-semibold text-gray-800">{editing.student_id}</p>
            </div>
            <Input label="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="부서" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <Input label="역할/직책" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            <Select label="권한" options={roleOptions} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} />
            <Select label="상태" options={statusOptions} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as UserStatus })} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" fullWidth onClick={() => setEditing(null)} disabled={saving}>취소</Button>
              <Button fullWidth onClick={handleSave} loading={saving}>저장</Button>
            </div>
          </div>
        </div>
      )}

      {/* 계정 생성 안내 모달 */}
      {showCreateInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateInfo(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-3">
            <h3 className="font-bold text-gray-900">방송국원 계정 추가 안내</h3>
            <p className="text-sm text-gray-600">보안상의 이유로 방송국원 계정은 다음 방법으로 생성합니다:</p>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-4">
              <li>Supabase 대시보드 → Authentication → Users에서 직접 추가</li>
              <li>이메일 형식: <code className="bg-gray-100 px-1 rounded text-xs">학번@ihbs.local</code></li>
              <li>계정 생성 후 profiles 테이블에 정보 입력</li>
            </ol>
            <p className="text-xs text-gray-400">자세한 내용은 docs/ADMIN_GUIDE.md를 참고하세요.</p>
            <Button variant="secondary" fullWidth onClick={() => setShowCreateInfo(false)}>확인</Button>
          </div>
        </div>
      )}
    </>
  );
}
