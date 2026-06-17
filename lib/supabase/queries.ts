'use client';

import { createClient } from './client';

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co';

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
  if (error) console.error('[queries] submitStory error:', error.message);
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
  if (error) console.error('[queries] submitSongRequest error:', error.message);
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
  if (error) console.error('[queries] submitSuggestion error:', error.message);
  return { error };
}
