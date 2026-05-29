'use client';

import { createClient } from './supabase/client';
import { studentIdToEmail } from './utils';
import type { Profile, UserRole } from '@/types';

export async function signIn(studentId: string, password: string) {
  const supabase = createClient();
  const email = studentIdToEmail(studentId);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error };

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', data.user.id)
    .single();

  return { user: data.user, profile, error: null };
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  return profile ?? null;
}

export async function checkRole(requiredRole: UserRole): Promise<boolean> {
  const profile = await getCurrentProfile();
  if (!profile) return false;
  if (profile.status !== 'active') return false;
  if (requiredRole === 'super_admin') return profile.role === 'super_admin';
  return profile.role === 'staff' || profile.role === 'super_admin';
}
