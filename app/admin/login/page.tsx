'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { signIn } from '@/lib/auth';

export default function AdminLoginPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !password.trim()) {
      setError('학번과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error: signInError } = await signIn(studentId.trim(), password);
      if (signInError) {
        setError('학번 또는 비밀번호가 올바르지 않습니다.');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1a3a6b] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-black text-xl tracking-tight">IH</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">IHBS</h1>
          <p className="text-sm text-gray-500 mt-1">방송국 관리자 로그인</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="학번"
              type="text"
              inputMode="numeric"
              placeholder="학번을 입력하세요"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              autoComplete="username"
            />
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
            )}
            <Button type="submit" fullWidth size="lg" loading={loading}>
              로그인
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          방송국원 계정이 없으신가요?{' '}
          <span className="text-gray-600">최고관리자에게 문의해주세요</span>
        </p>
      </div>
    </div>
  );
}
