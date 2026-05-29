// ============================================================
// 사용자 / 권한
// ============================================================
export type UserRole = 'staff' | 'super_admin';
export type UserStatus = 'active' | 'inactive';

export interface Profile {
  id: string;
  auth_user_id: string;
  student_id: string;
  name: string;
  role: UserRole;
  department?: string;
  position?: string;
  status: UserStatus;
  show_profile: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 방송 편성
// ============================================================
export type BroadcastStatus = 'scheduled' | 'on_air' | 'completed' | 'cancelled';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  monday: '월',
  tuesday: '화',
  wednesday: '수',
  thursday: '목',
  friday: '금',
  saturday: '토',
  sunday: '일',
};

export const BROADCAST_STATUS_LABELS: Record<BroadcastStatus, string> = {
  scheduled: '예정',
  on_air: '진행 중',
  completed: '완료',
  cancelled: '휴방',
};

export interface Broadcast {
  id: string;
  title: string;
  day_of_week: DayOfWeek;
  broadcast_date?: string;
  broadcast_time: string;
  end_time?: string;
  host: string;
  corner_name?: string;
  description?: string;
  status: BroadcastStatus;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 대본
// ============================================================
export interface Script {
  id: string;
  title: string;
  broadcast_date?: string;
  corner_name?: string;
  writer?: string;
  script_content?: string;
  file_url?: string;
  is_public: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 플레이리스트
// ============================================================
export interface Playlist {
  id: string;
  broadcast_date: string;
  broadcast_title: string;
  song_title: string;
  artist: string;
  description?: string;
  host?: string;
  external_url?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 사연
// ============================================================
export type StoryCategory = 'story' | 'congratulation' | 'concern' | 'report' | 'other';
export type StoryStatus = 'pending' | 'confirmed' | 'aired' | 'held';

export const STORY_CATEGORY_LABELS: Record<StoryCategory, string> = {
  story: '사연',
  congratulation: '축하',
  concern: '고민',
  report: '제보',
  other: '기타',
};

export const STORY_STATUS_LABELS: Record<StoryStatus, string> = {
  pending: '미확인',
  confirmed: '확인 완료',
  aired: '방송 반영',
  held: '보류',
};

export interface Story {
  id: string;
  nickname: string;
  is_anonymous: boolean;
  category: StoryCategory;
  content: string;
  contact_allowed: boolean;
  contact_info?: string;
  privacy_agreed: boolean;
  status: StoryStatus;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 신청곡
// ============================================================
export type SongRequestStatus = 'pending' | 'confirmed' | 'selected' | 'held';

export const SONG_REQUEST_STATUS_LABELS: Record<SongRequestStatus, string> = {
  pending: '미확인',
  confirmed: '확인 완료',
  selected: '선곡 완료',
  held: '보류',
};

export interface SongRequest {
  id: string;
  nickname: string;
  is_anonymous: boolean;
  song_title: string;
  artist: string;
  message?: string;
  contact_allowed: boolean;
  contact_info?: string;
  privacy_agreed: boolean;
  status: SongRequestStatus;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 건의함
// ============================================================
export type SuggestionCategory = 'broadcast' | 'music' | 'presentation' | 'system' | 'other';
export type SuggestionStatus = 'pending' | 'reviewing' | 'resolved' | 'held';

export const SUGGESTION_CATEGORY_LABELS: Record<SuggestionCategory, string> = {
  broadcast: '방송 관련',
  music: '선곡 관련',
  presentation: '진행 관련',
  system: '시스템 관련',
  other: '기타',
};

export const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
  pending: '미확인',
  reviewing: '검토 중',
  resolved: '처리 완료',
  held: '보류',
};

export interface Suggestion {
  id: string;
  nickname: string;
  is_anonymous: boolean;
  category: SuggestionCategory;
  content: string;
  need_reply: boolean;
  contact_info?: string;
  privacy_agreed: boolean;
  status: SuggestionStatus;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 공지
// ============================================================
export interface Notice {
  id: string;
  title: string;
  content: string;
  category?: string;
  author?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 앱 설정
// ============================================================
export interface AppSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 공통 유틸
// ============================================================
export interface SelectOption {
  value: string;
  label: string;
}

export interface AdminUser {
  id: string;
  student_id: string;
  name: string;
  role: UserRole;
  department?: string;
  position?: string;
  status: UserStatus;
}
