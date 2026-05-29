import type { Notice } from '@/types';

export const fallbackNotices: Notice[] = [
  {
    id: 'fn-1',
    title: '점심방송 사연 신청 안내',
    content: '매주 목요일 점심방송 "학우 사연 라디오"에서 여러분의 사연을 소개합니다. 사연은 앱의 사연 보내기 메뉴를 통해 보내주세요.',
    category: '안내',
    author: 'IHBS',
    is_public: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fn-2',
    title: 'IHBS 방송국 소개',
    content: 'IHBS는 우리 학교의 공식 방송국입니다. 매일 점심시간에 다양한 음악과 정보를 전달합니다. 신청곡, 사연 제보는 앱을 통해 해주세요!',
    category: '공지',
    author: 'IHBS',
    is_public: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fn-3',
    title: '방송 편성 변경 안내',
    content: '학교 행사 일정에 따라 일부 방송이 변경될 수 있습니다. 자세한 내용은 방송 편성표를 확인해주세요.',
    category: '안내',
    author: 'IHBS',
    is_public: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
