# Supabase 데이터베이스 스키마

## 테이블 생성 SQL

아래 SQL을 Supabase 대시보드 → SQL Editor에서 순서대로 실행하세요.

---

### 1. profiles 테이블

```sql
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  student_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('staff', 'super_admin')),
  department TEXT,
  position TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  show_profile BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### 2. broadcasts 테이블

```sql
CREATE TABLE public.broadcasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  day_of_week TEXT NOT NULL DEFAULT 'monday'
    CHECK (day_of_week IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  broadcast_date DATE,
  broadcast_time TIME NOT NULL,
  end_time TIME,
  host TEXT NOT NULL DEFAULT '',
  corner_name TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'on_air', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### 3. scripts 테이블

```sql
CREATE TABLE public.scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  broadcast_date DATE,
  corner_name TEXT,
  writer TEXT,
  script_content TEXT,
  file_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### 4. playlists 테이블

```sql
CREATE TABLE public.playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_date DATE NOT NULL,
  broadcast_title TEXT NOT NULL DEFAULT '',
  song_title TEXT NOT NULL,
  artist TEXT NOT NULL,
  description TEXT,
  host TEXT,
  external_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### 5. stories 테이블

```sql
CREATE TABLE public.stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT 'story'
    CHECK (category IN ('story', 'congratulation', 'concern', 'report', 'other')),
  content TEXT NOT NULL,
  contact_allowed BOOLEAN NOT NULL DEFAULT false,
  contact_info TEXT,
  privacy_agreed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'aired', 'held')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### 6. song_requests 테이블

```sql
CREATE TABLE public.song_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  song_title TEXT NOT NULL,
  artist TEXT NOT NULL,
  message TEXT,
  contact_allowed BOOLEAN NOT NULL DEFAULT false,
  contact_info TEXT,
  privacy_agreed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'selected', 'held')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### 7. suggestions 테이블

```sql
CREATE TABLE public.suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT 'broadcast'
    CHECK (category IN ('broadcast', 'music', 'presentation', 'system', 'other')),
  content TEXT NOT NULL,
  need_reply BOOLEAN NOT NULL DEFAULT false,
  contact_info TEXT,
  privacy_agreed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewing', 'resolved', 'held')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### 8. notices 테이블

```sql
CREATE TABLE public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  author TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

### 9. app_settings 테이블

```sql
CREATE TABLE public.app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 기본 설정값 삽입
INSERT INTO public.app_settings (key, value, description) VALUES
  ('station_name', 'IHBS', '방송국 이름'),
  ('station_description', '우리 학교 공식 방송국', '방송국 소개 문구'),
  ('lunch_broadcast_time', '12:00', '점심방송 기본 시간'),
  ('contact_email', 'ihbs@university.ac.kr', '방송국 대표 이메일'),
  ('welcome_message', '안녕하세요, IHBS 방송국입니다.', '앱 환영 문구');
```

---

## updated_at 자동 갱신 트리거

```sql
-- 공통 함수 생성
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 각 테이블에 트리거 적용
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_broadcasts_updated_at
  BEFORE UPDATE ON public.broadcasts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_scripts_updated_at
  BEFORE UPDATE ON public.scripts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_song_requests_updated_at
  BEFORE UPDATE ON public.song_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_suggestions_updated_at
  BEFORE UPDATE ON public.suggestions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

---

## RLS (Row Level Security) 정책

### RLS 활성화

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
```

### profiles RLS

```sql
-- 본인 프로필 조회
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

-- staff/super_admin은 모든 프로필 조회
CREATE POLICY "profiles_select_staff" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid()
        AND p.role IN ('staff', 'super_admin')
        AND p.status = 'active'
    )
  );

-- super_admin만 프로필 수정
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid()
        AND p.role = 'super_admin'
        AND p.status = 'active'
    )
  );
```

### broadcasts, scripts, playlists, notices, app_settings RLS

```sql
-- 공개 데이터 조회 (모든 사용자)
CREATE POLICY "broadcasts_select_all" ON public.broadcasts FOR SELECT USING (true);
CREATE POLICY "playlists_select_all" ON public.playlists FOR SELECT USING (true);
CREATE POLICY "notices_select_public" ON public.notices FOR SELECT USING (is_public = true);
CREATE POLICY "app_settings_select_all" ON public.app_settings FOR SELECT USING (true);

-- scripts: 공개된 것만 조회
CREATE POLICY "scripts_select_public" ON public.scripts FOR SELECT USING (is_public = true);

-- staff/super_admin: 전체 조회 및 CRUD
CREATE POLICY "broadcasts_staff_all" ON public.broadcasts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.auth_user_id = auth.uid() AND p.role IN ('staff', 'super_admin') AND p.status = 'active')
  );

CREATE POLICY "scripts_staff_all" ON public.scripts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.auth_user_id = auth.uid() AND p.role IN ('staff', 'super_admin') AND p.status = 'active')
  );

CREATE POLICY "playlists_staff_all" ON public.playlists
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.auth_user_id = auth.uid() AND p.role IN ('staff', 'super_admin') AND p.status = 'active')
  );

CREATE POLICY "notices_staff_all" ON public.notices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.auth_user_id = auth.uid() AND p.role IN ('staff', 'super_admin') AND p.status = 'active')
  );

CREATE POLICY "app_settings_staff_all" ON public.app_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.auth_user_id = auth.uid() AND p.role IN ('staff', 'super_admin') AND p.status = 'active')
  );
```

### stories, song_requests, suggestions RLS

```sql
-- 일반 사용자: INSERT만 가능
CREATE POLICY "stories_insert_public" ON public.stories FOR INSERT WITH CHECK (true);
CREATE POLICY "song_requests_insert_public" ON public.song_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "suggestions_insert_public" ON public.suggestions FOR INSERT WITH CHECK (true);

-- staff/super_admin: 전체 조회 및 관리
CREATE POLICY "stories_staff_all" ON public.stories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.auth_user_id = auth.uid() AND p.role IN ('staff', 'super_admin') AND p.status = 'active')
  );

CREATE POLICY "song_requests_staff_all" ON public.song_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.auth_user_id = auth.uid() AND p.role IN ('staff', 'super_admin') AND p.status = 'active')
  );

CREATE POLICY "suggestions_staff_all" ON public.suggestions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.auth_user_id = auth.uid() AND p.role IN ('staff', 'super_admin') AND p.status = 'active')
  );
```
