'use client';

import { useState } from 'react';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import { submitStory, submitSongRequest } from '@/lib/supabase/queries';
import type { SelectOption } from '@/types';
import { CheckCircle } from 'lucide-react';

const typeOptions: SelectOption[] = [
  { value: 'story', label: '사연' },
  { value: 'song_request', label: '신청곡' },
  { value: 'congratulation', label: '축하' },
  { value: 'concern', label: '고민' },
  { value: 'report', label: '제보' },
];

const storyTypeLabels: Record<string, string> = {
  story: '사연',
  congratulation: '축하',
  concern: '고민',
  report: '제보',
};

export default function StoryRequestForm() {
  const [type, setType] = useState('story');
  const [nickname, setNickname] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [content, setContent] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [contactAllowed, setContactAllowed] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isSongRequest = type === 'song_request';

  const reset = () => {
    setType('story'); setNickname(''); setIsAnonymous(false); setContent('');
    setSongTitle(''); setArtist(''); setContactAllowed(false);
    setContactInfo(''); setPrivacyAgreed(false); setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) { setError('개인정보 처리에 동의해주세요.'); return; }
    if (!content.trim() && !isSongRequest) { setError('내용을 입력해주세요.'); return; }
    if (isSongRequest && (!songTitle.trim() || !artist.trim())) {
      setError('곡 제목과 가수명을 입력해주세요.'); return;
    }

    setLoading(true);
    setError('');
    try {
      let result;
      if (isSongRequest) {
        result = await submitSongRequest({
          nickname: isAnonymous ? '익명' : nickname || '익명',
          is_anonymous: isAnonymous,
          song_title: songTitle,
          artist,
          message: content || undefined,
          contact_allowed: contactAllowed,
          contact_info: contactAllowed ? contactInfo : undefined,
          privacy_agreed: privacyAgreed,
        });
      } else {
        result = await submitStory({
          nickname: isAnonymous ? '익명' : nickname || '익명',
          is_anonymous: isAnonymous,
          category: type as 'story' | 'congratulation' | 'concern' | 'report' | 'other',
          content,
          contact_allowed: contactAllowed,
          contact_info: contactAllowed ? contactInfo : undefined,
          privacy_agreed: privacyAgreed,
        });
      }
      if (result.error) throw result.error;
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
          <p className="font-bold text-gray-900 text-lg">
            {isSongRequest ? '신청곡이 접수되었습니다!' : '사연이 접수되었습니다!'}
          </p>
          <p className="text-sm text-gray-500 mt-1">소중한 {isSongRequest ? '신청곡' : '사연'}을 보내주셔서 감사합니다.</p>
        </div>
        <Button variant="secondary" onClick={() => { reset(); setSubmitted(false); }}>
          다시 보내기
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="유형"
        options={typeOptions}
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      />

      <div className="flex items-center gap-2">
        <Input
          label="이름 / 닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="이름 또는 닉네임"
          disabled={isAnonymous}
          className="flex-1"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="w-4 h-4 rounded accent-blue-600"
        />
        익명으로 보내기
      </label>

      {isSongRequest ? (
        <>
          <Input
            label="곡 제목"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="신청하실 곡의 제목"
            required
          />
          <Input
            label="가수명"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="가수 또는 아티스트명"
            required
          />
          <Textarea
            label="메시지"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="DJ에게 전하고 싶은 말 (선택)"
            rows={3}
          />
        </>
      ) : (
        <Textarea
          label={`${storyTypeLabels[type] || '내용'}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 자유롭게 작성해주세요"
          required
          rows={5}
        />
      )}

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={contactAllowed}
            onChange={(e) => setContactAllowed(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600"
          />
          연락 받겠습니다
        </label>
        {contactAllowed && (
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
            개인정보 수집·이용에 동의합니다. 수집된 정보는 방송 운영 목적으로만 사용되며 방송 종료 후 즉시 파기됩니다.
            <span className="text-red-500 ml-0.5">*</span>
          </span>
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" fullWidth size="lg" loading={loading} disabled={!privacyAgreed}>
        {isSongRequest ? '신청곡 보내기' : '사연 보내기'}
      </Button>
    </form>
  );
}
