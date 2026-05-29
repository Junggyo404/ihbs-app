# 다음 개발 단계

## Phase 2: Supabase 연결 및 운영 준비

### 필수 작업
- [ ] Supabase 프로젝트 생성 및 `.env.local` 설정
- [ ] `docs/SUPABASE_SCHEMA.md`의 SQL로 테이블 생성
- [ ] RLS 정책 적용
- [ ] 최초 최고관리자 계정 생성 (`docs/ADMIN_GUIDE.md` 참조)
- [ ] 기본 방송 편성표 데이터 입력

### 권장 작업
- [ ] Supabase Storage 설정 (대본 파일 업로드용)
- [ ] 실제 IHBS 로고 PNG 아이콘으로 교체 (`public/icons/`)
- [ ] `public/manifest.json`의 아이콘 경로를 PNG로 업데이트
- [ ] 배포 환경에서 서비스 워커 동작 테스트

---

## Phase 3: 추가 기능 개발

### UX 개선
- [ ] 방송국원 비밀번호 변경 기능
- [ ] 관리자 페이지 검색/필터 기능
- [ ] 사연/건의사항 답변 기능
- [ ] 방송 스케줄 달력 뷰

### 기능 확장
- [ ] 대본 파일 직접 업로드 (Supabase Storage)
- [ ] 공지 홈 화면 표시 기능 (pinned 필드)
- [ ] 신청곡/사연 일괄 처리
- [ ] 관리자 활동 로그

### 성능
- [ ] ISR (Incremental Static Regeneration) 적용
- [ ] 이미지 최적화
- [ ] PWA 오프라인 지원 강화

---

## Phase 4: 운영 및 배포

- [ ] Vercel 또는 서버 배포 설정
- [ ] 커스텀 도메인 연결
- [ ] HTTPS 적용 확인 (PWA 필수)
- [ ] 학교 네트워크 접근 테스트
- [ ] 모바일 홈 화면 추가 가이드 작성 (학우 배포용)

---

## 현재 제한사항

| 항목 | 현재 상태 | 해결 방법 |
|------|-----------|-----------|
| 아이콘 | SVG 임시 아이콘 | 실제 PNG 아이콘으로 교체 |
| Supabase 미연결 | Fallback 데이터 사용 | .env.local 설정 후 실제 데이터 사용 |
| 대본 파일 업로드 | URL 입력 방식 | Supabase Storage 연동 |
| 방송국원 계정 생성 | Supabase 대시보드 수동 생성 | API Route 구현 가능 |
