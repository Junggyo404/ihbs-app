import { createClient } from './client';
import type {
  Broadcast, Script, Playlist, Story, SongRequest,
  Suggestion, Notice, Profile,
} from '@/types';

// ── 방송 스케줄 ──────────────────────────────────────────────
export async function adminGetBroadcasts() {
  const supabase = createClient();
  return supabase.from('broadcasts').select('*').order('broadcast_date', { ascending: false });
}

export async function adminCreateBroadcast(data: Omit<Broadcast, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  return supabase.from('broadcasts').insert([data]).select().single();
}

export async function adminUpdateBroadcast(id: string, data: Partial<Broadcast>) {
  const supabase = createClient();
  return supabase
    .from('broadcasts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
}

export async function adminDeleteBroadcast(id: string) {
  const supabase = createClient();
  return supabase.from('broadcasts').delete().eq('id', id);
}

// ── 대본 ────────────────────────────────────────────────────
export async function adminGetScripts() {
  const supabase = createClient();
  return supabase.from('scripts').select('*').order('broadcast_date', { ascending: false });
}

export async function adminCreateScript(data: Omit<Script, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  return supabase.from('scripts').insert([data]).select().single();
}

export async function adminUpdateScript(id: string, data: Partial<Script>) {
  const supabase = createClient();
  return supabase
    .from('scripts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
}

export async function adminDeleteScript(id: string) {
  const supabase = createClient();
  return supabase.from('scripts').delete().eq('id', id);
}

// ── 플레이리스트 ─────────────────────────────────────────────
export async function adminGetPlaylists() {
  const supabase = createClient();
  return supabase
    .from('playlists')
    .select('*')
    .order('broadcast_date', { ascending: false })
    .order('display_order', { ascending: true });
}

export async function adminCreatePlaylist(data: Omit<Playlist, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  return supabase.from('playlists').insert([data]).select().single();
}

export async function adminUpdatePlaylist(id: string, data: Partial<Playlist>) {
  const supabase = createClient();
  return supabase
    .from('playlists')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
}

export async function adminDeletePlaylist(id: string) {
  const supabase = createClient();
  return supabase.from('playlists').delete().eq('id', id);
}

// ── 사연 ────────────────────────────────────────────────────
export async function adminGetStories() {
  const supabase = createClient();
  return supabase.from('stories').select('*').order('created_at', { ascending: false });
}

export async function adminUpdateStoryStatus(id: string, status: Story['status']) {
  const supabase = createClient();
  return supabase
    .from('stories')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export async function adminDeleteStory(id: string) {
  const supabase = createClient();
  return supabase.from('stories').delete().eq('id', id);
}

// ── 신청곡 ───────────────────────────────────────────────────
export async function adminGetSongRequests() {
  const supabase = createClient();
  return supabase.from('song_requests').select('*').order('created_at', { ascending: false });
}

export async function adminUpdateSongRequestStatus(id: string, status: SongRequest['status']) {
  const supabase = createClient();
  return supabase
    .from('song_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export async function adminDeleteSongRequest(id: string) {
  const supabase = createClient();
  return supabase.from('song_requests').delete().eq('id', id);
}

// ── 건의함 ───────────────────────────────────────────────────
export async function adminGetSuggestions() {
  const supabase = createClient();
  return supabase.from('suggestions').select('*').order('created_at', { ascending: false });
}

export async function adminUpdateSuggestionStatus(id: string, status: Suggestion['status']) {
  const supabase = createClient();
  return supabase
    .from('suggestions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export async function adminDeleteSuggestion(id: string) {
  const supabase = createClient();
  return supabase.from('suggestions').delete().eq('id', id);
}

// ── 공지 ────────────────────────────────────────────────────
export async function adminGetNotices() {
  const supabase = createClient();
  return supabase.from('notices').select('*').order('created_at', { ascending: false });
}

export async function adminCreateNotice(data: Omit<Notice, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  return supabase.from('notices').insert([data]).select().single();
}

export async function adminUpdateNotice(id: string, data: Partial<Notice>) {
  const supabase = createClient();
  return supabase
    .from('notices')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
}

export async function adminDeleteNotice(id: string) {
  const supabase = createClient();
  return supabase.from('notices').delete().eq('id', id);
}

// ── 방송국원 프로필 ──────────────────────────────────────────
export async function adminGetProfiles() {
  const supabase = createClient();
  return supabase.from('profiles').select('*').order('created_at', { ascending: false });
}

export async function adminUpdateProfile(id: string, data: Partial<Profile>) {
  const supabase = createClient();
  return supabase
    .from('profiles')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
}

// ── 앱 설정 ─────────────────────────────────────────────────
export async function adminGetSettings() {
  const supabase = createClient();
  return supabase.from('app_settings').select('*').order('key', { ascending: true });
}

export async function adminUpsertSetting(key: string, value: string) {
  const supabase = createClient();
  return supabase
    .from('app_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
}

// ── 대시보드 통계 ────────────────────────────────────────────
export async function adminGetDashboardStats() {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  const [
    { count: totalBroadcasts },
    { count: pendingStories },
    { count: pendingSongRequests },
    { count: pendingSuggestions },
    { count: totalScripts },
    { count: totalMembers },
    todayPlaylistResult,
  ] = await Promise.all([
    supabase.from('broadcasts').select('*', { count: 'exact', head: true }),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('song_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('scripts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase
      .from('playlists')
      .select('id')
      .eq('broadcast_date', today)
      .limit(1),
  ]);

  return {
    totalBroadcasts: totalBroadcasts ?? 0,
    pendingStories: pendingStories ?? 0,
    pendingSongRequests: pendingSongRequests ?? 0,
    pendingSuggestions: pendingSuggestions ?? 0,
    totalScripts: totalScripts ?? 0,
    totalMembers: totalMembers ?? 0,
    hasTodayPlaylist: (todayPlaylistResult.data?.length ?? 0) > 0,
  };
}
