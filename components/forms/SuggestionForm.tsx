'use client';

import { useState } from 'react';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import { submitSuggestion } from '@/lib/supabase/queries';
import { SUGGESTION_CATEGORY_LABELS } from '@/types';
import { CheckCircle } from 'lucide-react';

const categoryOptions = Object.entries(SUGGESTION_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function SuggestionForm() {
  const [nickname, setNickname] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState('broadcast');
  const [content, setContent] = useState('');
  const [needReply, setNeedReply] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setNickname(''); setIsAnonymous(false); setCategory('broadcast');
    setContent(''); setNeedReply(false); setContactInfo('');
    setPrivacyAgreed(false); setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) { setError('개인정보 처리에 동의해주세요.'); return; }
    if (!content.trim()) { setError('건의 내용을 입력해주세요.'); return; }

    setLoading(true);
    setError('');
    try {
      const { error: submitError } = await submitSuggestion({
        nickname: isAnonymous ? '익명' : nickname || '익명',
        is_anonymous: isAnonymous,
        category: category as 'broadcast' | 'music' | 'presentation' | 'system' | 'other',
        content,
        need_reply: needReply,
        contact_info: needReply ? contactInfo : undefined,
        privacy_agreed: privacyAgreed,
      });
      if (submitError) throw submitError;
      setSubmitted(true);
    } catch {
      setError('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">건의사항이 접수되었습니다!</p>
          <p className="text-sm text-gray-500 mt-1">소중한 의견을 보내주셔서 감사합니다.</p>
        </div>
        <Button variant="secondary" onClick={() => { reset(); setSubmitted(false); }}>
          다시 작성하기
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="건의 유형"
        options={categoryOptions}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />

      <div>
        <Input
          label="이름 / 닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="이름 또는 닉네임"
          disabled={isAnonymous}
        />
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600"
          />
          익명으로 보내기
        </label>
      </div>

      <Textarea
        label="건의 내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="방송국에 전달하고 싶은 의견을 자유롭게 작성해주세요"
        required
        rows={5}
      />

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={needReply}
            onChange={(e) => setNeedReply(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600"
          />
          답변을 받고 싶습니다
        </label>
        {needReply && (
          <Input
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="연락처 또는 이메일"
          />
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-3">
        <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600 mt-0.5 shrink-0"
          />
          <span>
            개인정보 수집·이용에 동의합니다. 수집된 정보는 방송 운영 목적으로만 사용됩니다.
            <span className="text-red-500 ml-0.5">*</span>
          </span>
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" fullWidth size="lg" loading={loading} disabled={!privacyAgreed}>
        건의하기
      </Button>
    </form>
  );
}
