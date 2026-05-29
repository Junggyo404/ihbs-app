import type { AppSetting } from '@/types';

export const fallbackSettings: AppSetting[] = [
  {
    id: 'fs-1',
    key: 'station_name',
    value: 'IHBS',
    description: '방송국 이름',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fs-2',
    key: 'station_description',
    value: '우리 학교 공식 방송국',
    description: '방송국 소개 문구',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fs-3',
    key: 'lunch_broadcast_time',
    value: '12:00',
    description: '점심방송 기본 시간',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fs-4',
    key: 'contact_email',
    value: 'ihbs@university.ac.kr',
    description: '방송국 대표 이메일',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fs-5',
    key: 'welcome_message',
    value: '안녕하세요, IHBS 방송국입니다.',
    description: '앱 환영 문구',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
