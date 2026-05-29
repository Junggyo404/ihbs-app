import { createClient } from './client';
import type { Broadcast, Playlist, Notice, AppSetting } from '@/types';
import {
  fallbackBroadcasts,
  fallbackPlaylists,
  fallbackNotices,
  fallbackSettings,
} from '@/data';

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co';

// 오늘의 방송 목록
export async function getTodayBroadcasts(): Promise<Broadcast[]> {
  if (!isSupabaseConfigured) return fallbackBroadcasts.slice(0, 3);

  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayDay = days[new Date().getDay()];

  const { data, error } = await supabase
    .from('broadcasts')
    .select('*')
    .or(`broadcast_date.eq.${today},day_of_week.eq.${todayDay}`)
    .order('broadcast_time', { ascending: true });

  if (error || !data) return fallbackBroadcasts.slice(0, 3);
  return data;
}

// 전체 방송 편성표
export async function getAllBroadcasts(): Promise<Broadcast[]> {
  if (!isSupabaseConfigured) return fallbackBroadcasts;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('broadcasts')
    .select('*')
    .order('day_of_week', { ascending: true })
    .order('broadcast_time', { ascending: true });

  if (error || !data) return fallbackBroadcasts;
  return data;
}

// 오늘의 플레이리스트
export async function getTodayPlaylists(): Promise<Playlist[]> {
  if (!isSupabaseConfigured) return fallbackPlaylists.slice(0, 5);

  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('broadcast_date', today)
    .order('display_order', { ascending: true });

  if (error || !data) return fallbackPlaylists.slice(0, 5);
  return data;
}

// 전체 플레이리스트 (최신 날짜 순)
export async function getAllPlaylists(): Promise<Playlist[]> {
  if (!isSupabaseConfigured) return fallbackPlaylists;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .order('broadcast_date', { ascending: false })
    .order('display_order', { ascending: true });

  if (error || !data) return fallbackPlaylists;
  return data;
}

// 공개 공지
export async function getPublicNotices(): Promise<Notice[]> {
  if (!isSupabaseConfigured) return fallbackNotices;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error || !data) return fallbackNotices;
  return data;
}

// 앱 설정
export async function getAppSettings(): Promise<Record<string, string>> {
  if (!isSupabaseConfigured) {
    return Object.fromEntries(fallbackSettings.map((s) => [s.key, s.value]));
  }

  const supabase = createClient();
  const { data, error } = await supabase.from('app_settings').select('*');

  if (error || !data) {
    return Object.fromEntries(fallbackSettings.map((s) => [s.key, s.value]));
  }
  return Object.fromEntries(data.map((s: AppSetting) => [s.key, s.value]));
}

// 사연 제출
export async function submitStory(payload: {
  nickname: string;
  is_anonymous: boolean;
  category: string;
  content: string;
  contact_allowed: boolean;
  contact_info?: string;
  privacy_agreed: boolean;
}) {
  if (!isSupabaseConfigured) {
    return { error: null };
  }

  const supabase = createClient();
  const { error } = await supabase.from('stories').insert([{ ...payload, status: 'pending' }]);
  return { error };
}

// 신청곡 제출
export async function submitSongRequest(payload: {
  nickname: string;
  is_anonymous: boolean;
  song_title: string;
  artist: string;
  message?: string;
  contact_allowed: boolean;
  contact_info?: string;
  privacy_agreed: boolean;
}) {
  if (!isSupabaseConfigured) {
    return { error: null };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('song_requests')
    .insert([{ ...payload, status: 'pending' }]);
  return { error };
}

// 건의함 제출
export async function submitSuggestion(payload: {
  nickname: string;
  is_anonymous: boolean;
  category: string;
  content: string;
  need_reply: boolean;
  contact_info?: string;
  privacy_agreed: boolean;
}) {
  if (!isSupabaseConfigured) {
    return { error: null };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('suggestions')
    .insert([{ ...payload, status: 'pending' }]);
  return { error };
}
