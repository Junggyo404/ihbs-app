import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 경로는 바로 통과
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // 로그인 페이지는 통과
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Supabase 미설정 시 개발 모드 허용
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://your-project-id.supabase.co') {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 프로필 및 권한 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('auth_user_id', user.id)
    .single();

  if (!profile || profile.status !== 'active' || !['staff', 'super_admin'].includes(profile.role)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // /admin/members는 super_admin만 접근 가능
  if (pathname.startsWith('/admin/members') && profile.role !== 'super_admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
