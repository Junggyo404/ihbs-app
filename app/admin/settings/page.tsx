'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import LoadingState from '@/components/common/LoadingState';
import { adminGetSettings, adminUpsertSetting } from '@/lib/supabase/adminQueries';
import { CheckCircle } from 'lucide-react';

const SETTING_LABELS: Record<string, string> = {
  station_name: '방송국 이름',
  station_description: '방송국 소개 문구',
  lunch_broadcast_time: '점심방송 기본 시간',
  contact_email: '대표 이메일',
  welcome_message: '앱 환영 문구',
};

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetSettings().then(({ data }) => {
      if (data) {
        setValues(Object.fromEntries(data.map((s) => [s.key, s.value])));
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key); setError(null);
    try {
      await adminUpsertSetting(key, values[key] ?? '');
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch {
      setError(`"${SETTING_LABELS[key] ?? key}" 저장에 실패했습니다.`);
    } finally {
      setSaving(null);
    }
  };

  const allKeys = [
    'station_name', 'station_description', 'lunch_broadcast_time',
    'contact_email', 'welcome_message',
  ];

  return (
    <>
      <AdminHeader title="설정" />
      <main className="p-4 md:p-6 space-y-4">
        <h2 className="text-lg font-black text-gray-900">방송국 기본 정보</h2>
        <p className="text-sm text-gray-500">앱에 표시되는 방송국 기본 정보를 관리합니다.</p>

        {loading ? (
          <LoadingState />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {allKeys.map((key) => (
              <div key={key} className="p-4 flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    label={SETTING_LABELS[key] ?? key}
                    value={values[key] ?? ''}
                    onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  />
                </div>
                <Button
                  size="sm"
                  variant={saved === key ? 'secondary' : 'primary'}
                  onClick={() => handleSave(key)}
                  loading={saving === key}
                  className="shrink-0 mb-0.5"
                >
                  {saved === key ? <><CheckCircle size={14} /> 저장됨</> : '저장'}
                </Button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-500">
          <p className="font-medium text-gray-700 mb-1">추가 설정 안내</p>
          <p>PWA 아이콘, 색상 등의 설정은 <code className="bg-gray-200 px-1 rounded text-xs">public/manifest.json</code>과 <code className="bg-gray-200 px-1 rounded text-xs">app/globals.css</code> 파일을 직접 수정해주세요.</p>
        </div>
      </main>
    </>
  );
}
