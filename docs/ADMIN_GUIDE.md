# IHBS 관리자 가이드

## 1. 최초 최고관리자 계정 생성

Supabase 인증은 email/password 기반이며, 내부적으로 `학번@ihbs.local` 형식의 이메일로 변환합니다.

### 단계별 절차

**Step 1. Supabase Authentication에서 사용자 생성**

1. Supabase 대시보드 → Authentication → Users
2. "Add user" 버튼 클릭
3. Email: `20231001@ihbs.local` (학번을 여기에 입력)
4. Password: 안전한 비밀번호 설정
5. "Create user" 클릭

**Step 2. profiles 테이블에 레코드 삽입**

SQL Editor에서 아래를 실행합니다. `auth_user_id`는 Step 1에서 생성된 UUID로 교체하세요.

```sql
INSERT INTO public.profiles (auth_user_id, student_id, name, role, department, status)
VALUES (
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',  -- Step 1의 user UUID
  '20231001',                               -- 학번
  '홍길동',                                  -- 이름
  'super_admin',                            -- 최초 최고관리자
  '방송국',
  'active'
);
```

**Step 3. 로그인 확인**

브라우저에서 `/admin/login` 접속 → 학번 + 비밀번호로 로그인

---

## 2. 방송국원 계정 추가 (최고관리자 전용)

최고관리자가 새 방송국원을 추가하는 방법은 위와 동일합니다. 단, `role`은 `staff`로 설정합니다.

```sql
INSERT INTO public.profiles (auth_user_id, student_id, name, role, department, status)
VALUES (
  'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
  '20241002',
  '김방송',
  'staff',
  '편성팀',
  'active'
);
```

> 계정 생성 시 비밀번호는 Supabase 대시보드에서 "Send password reset" 또는 임시 비밀번호를 직접 전달하세요.

---

## 3. 관리자 페이지 기능 안내

| 메뉴 | 경로 | 접근 권한 |
|------|------|-----------|
| 대시보드 | /admin | staff, super_admin |
| 방송 스케줄 | /admin/schedules | staff, super_admin |
| 대본 관리 | /admin/scripts | staff, super_admin |
| 플레이리스트 | /admin/playlists | staff, super_admin |
| 사연 관리 | /admin/stories | staff, super_admin |
| 신청곡 관리 | /admin/song-requests | staff, super_admin |
| 건의함 관리 | /admin/suggestions | staff, super_admin |
| 공지 관리 | /admin/notices | staff, super_admin |
| **방송국원 관리** | /admin/members | **super_admin 전용** |
| 설정 | /admin/settings | staff, super_admin |

---

## 4. 비밀번호 변경

방송국원이 비밀번호를 변경하려면:
- Supabase 대시보드 → Authentication → Users → 해당 사용자 → "Send password reset email"
- 또는 최고관리자가 직접 SQL로 변경 가능 (권장하지 않음)

---

## 5. 계정 비활성화

방송국원 탈퇴/휴학 시 계정 삭제 대신 비활성화를 권장합니다.

1. `/admin/members` 접속
2. 해당 방송국원 수정 버튼 클릭
3. 상태를 "비활성"으로 변경 → 저장

비활성화된 계정은 로그인할 수 없으며, 관리자 페이지에 접근 불가합니다.

---

## 6. 환경변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 아래 내용을 입력하세요:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용 API에서만 사용하며, 절대 클라이언트 코드에 노출하지 마세요.

---

## 7. Supabase RLS 적용

`docs/SUPABASE_SCHEMA.md`의 RLS 정책을 반드시 적용해야 데이터 보안이 보장됩니다.

일반 사용자는 사연/신청곡/건의함 제출만 가능하고, 관리 데이터에는 접근할 수 없습니다.
