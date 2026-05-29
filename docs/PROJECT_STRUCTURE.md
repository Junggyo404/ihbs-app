# 프로젝트 구조

## 디렉터리 구조

```
ihbs-app/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃 (PWA 메타, SW 등록)
│   ├── page.tsx                 # 홈 화면
│   ├── globals.css              # 전역 CSS
│   ├── broadcast/page.tsx       # 방송 편성표
│   ├── request/page.tsx         # 사연 · 신청곡
│   ├── playlist/page.tsx        # 플레이리스트
│   ├── suggestions/page.tsx     # 건의함
│   └── admin/
│       ├── layout.tsx           # 관리자 레이아웃
│       ├── page.tsx             # 관리자 대시보드
│       ├── login/page.tsx       # 로그인
│       ├── schedules/page.tsx   # 방송 스케줄 관리
│       ├── scripts/page.tsx     # 대본 관리
│       ├── playlists/page.tsx   # 플레이리스트 관리
│       ├── stories/page.tsx     # 사연 관리
│       ├── song-requests/page.tsx # 신청곡 관리
│       ├── suggestions/page.tsx # 건의함 관리
│       ├── notices/page.tsx     # 공지 관리
│       ├── members/page.tsx     # 방송국원 관리 (super_admin 전용)
│       └── settings/page.tsx    # 설정
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # 일반 헤더
│   │   ├── BottomTabBar.tsx     # 하단 탭바
│   │   ├── PageContainer.tsx    # 페이지 컨테이너
│   │   └── ServiceWorkerRegistration.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── SectionTitle.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   └── Modal.tsx
│   ├── cards/
│   │   ├── BroadcastCard.tsx
│   │   ├── PlaylistCard.tsx
│   │   ├── DashboardCard.tsx
│   │   └── NoticeCard.tsx
│   ├── forms/
│   │   ├── StoryRequestForm.tsx # 사연/신청곡 통합 폼
│   │   └── SuggestionForm.tsx
│   └── admin/
│       ├── AdminSidebar.tsx     # 데스크톱 사이드바
│       ├── AdminHeader.tsx      # 모바일 헤더 + 드로어
│       ├── AdminTable.tsx       # 데이터 테이블
│       └── StatusSelect.tsx     # 상태 변경 드롭다운
│
├── data/                        # Fallback 개발용 데이터
│   ├── fallbackBroadcasts.ts
│   ├── fallbackPlaylists.ts
│   ├── fallbackNotices.ts
│   ├── fallbackSettings.ts
│   └── index.ts
│
├── types/
│   └── index.ts                 # 모든 TypeScript 타입 정의
│
├── lib/
│   ├── utils.ts                 # 공통 유틸리티
│   ├── auth.ts                  # 인증 유틸리티
│   └── supabase/
│       ├── client.ts            # 브라우저 클라이언트
│       ├── server.ts            # 서버 클라이언트
│       ├── queries.ts           # 공개 데이터 쿼리
│       └── adminQueries.ts      # 관리자 CRUD 쿼리
│
├── public/
│   ├── manifest.json            # PWA 매니페스트
│   ├── sw.js                    # 서비스 워커
│   └── icons/
│       ├── icon.svg
│       └── apple-touch-icon.svg
│
├── docs/
│   ├── PROJECT_STRUCTURE.md
│   ├── SUPABASE_SCHEMA.md
│   ├── ADMIN_GUIDE.md
│   └── NEXT_STEPS.md
│
├── middleware.ts                 # 관리자 라우트 보호
├── .env.local.example
└── README.md
```

## 권한 구조

| 역할 | 값 | 설명 |
|------|----|------|
| 일반 학우 | (로그인 없음) | 공개 페이지 접근, 사연/신청곡/건의함 제출 |
| 방송국원 | `staff` | 모든 관리자 기능 (계정 관리 제외) |
| 최고관리자 | `super_admin` | 모든 기능 + 방송국원 계정 관리 |

## 인증 방식

- Supabase Auth 기반 email/password
- 학번을 `학번@ihbs.local` 형식으로 내부 변환
- 화면에는 학번 입력 필드로 표시
- 미들웨어(`middleware.ts`)가 `/admin` 경로를 보호
- `profiles` 테이블에서 role/status 추가 검증
