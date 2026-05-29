# IHBS 방송국 PWA

IHBS 대학 방송국의 공식 웹앱 / PWA 프로젝트입니다.

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Database + Auth)
- **PWA** (manifest + service worker)

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local.example`을 복사하여 `.env.local`을 만들고 값을 입력합니다.

```bash
cp .env.local.example .env.local
```

`.env.local` 내용:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> Supabase 값 없이도 실행 가능합니다. 이 경우 개발용 fallback 데이터가 표시됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 4. 빌드

```bash
npm run build
npm run start
```

---

## Supabase 설정

1. Supabase 프로젝트 생성
2. `docs/SUPABASE_SCHEMA.md`의 SQL 실행 (테이블 생성)
3. RLS 정책 적용
4. `.env.local`에 URL/Key 입력
5. `docs/ADMIN_GUIDE.md`를 참고하여 최초 관리자 계정 생성

---

## 주요 URL

| 경로 | 설명 |
|------|------|
| `/` | 홈 (방송 편성표, 플레이리스트, 공지) |
| `/broadcast` | 방송 편성표 |
| `/request` | 사연 / 신청곡 보내기 |
| `/playlist` | 점심방송 플레이리스트 |
| `/suggestions` | 건의함 |
| `/admin/login` | 방송국원 로그인 |
| `/admin` | 관리자 대시보드 |

---

## 파일 구조

`docs/PROJECT_STRUCTURE.md` 참고

---

## 관리자 가이드

`docs/ADMIN_GUIDE.md` 참고

---

## 다음 개발 단계

`docs/NEXT_STEPS.md` 참고

---

## 모바일 홈 화면 추가 (PWA)

### iOS Safari
1. 브라우저 하단 공유 버튼 탭
2. "홈 화면에 추가" 선택

### Android Chrome
1. 브라우저 메뉴(⋮) 탭
2. "홈 화면에 추가" 선택

> 홈 화면에 추가하면 앱처럼 전체화면으로 실행됩니다.
