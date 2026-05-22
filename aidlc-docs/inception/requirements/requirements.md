# 요구사항

## 요청 분석

- **사용자 요청**: Vercel 배포 예정인 프론트엔드가 Railway 백엔드 API를
  환경별 base URL 설정으로 호출하도록 정리한다.
- **요청 유형**: 기존 API 연동 구조 개선과 배포 설정 보완.
- **범위 추정**: 공통 API 클라이언트, confession API wrapper, 환경변수 예시,
  Git ignore 규칙, README 문서.
- **복잡도 추정**: 단순. 기존 공통 HTTP client와 confession feature 경계를
  유지하면서 경로 기준과 배포 설정을 조정한다.

## 기능 요구사항

1. 프론트엔드는 API base URL을 `VITE_API_BASE_URL`에서 읽어야 한다.
2. `VITE_API_BASE_URL`은 API 서버의 고정 context path인 `/tuk`까지 포함하는
   기준으로 사용해야 한다.
3. feature API wrapper는 `/api/confessions`처럼 backend API path만 공통 API
   client에 전달해야 한다.
4. confession 목록 조회는 `GET /api/confessions` 경로를 사용해야 한다.
5. confession 작성은 `POST /api/confessions` 경로를 사용해야 한다.
6. confession 작성 요청은 공통 API client가 주입하는 `X-Device-Id` 헤더를
   포함해야 한다.
7. 기존 작성 기능 호환을 위해 작성 payload는 현재 UI가 수집하는 `content`와
   `mood`를 계속 포함한다.
8. base URL이 비어 있으면 공통 API client는 개발자가 원인을 파악할 수 있는
   명확한 오류를 던져야 한다.

## 설정 및 문서 요구사항

1. `.env.example`은 비밀값 없이 `VITE_API_BASE_URL=` 예시를 제공해야 한다.
2. `.gitignore`는 실제 환경변수 파일인 `.env`, `.env.local`,
   `.env.production`, `.env.*.local`을 무시해야 한다.
3. README는 Vercel Project Settings의 Environment Variables에서 운영
   `VITE_API_BASE_URL`을 등록하는 방법을 설명해야 한다.
4. README는 로컬 개발에서 `.env.local`에
   `VITE_API_BASE_URL=http://localhost:8080/tuk`를 설정하는 예시를
   포함해야 한다.
5. README는 Vercel 배포 도메인을 Railway 백엔드 CORS allowed origin에
   추가해야 한다는 메모를 포함해야 한다.

## 비기능 및 보안 요구사항

1. `VITE_API_BASE_URL`은 브라우저에 노출 가능한 배포 설정값으로만 사용한다.
2. DB 비밀번호, JWT secret, Railway token, 외부 API secret key 같은 비밀값은
   프론트 환경변수와 문서 예시에 추가하지 않는다.
3. 백엔드 CORS 정책은 이 프론트 저장소에서 수정하지 않고, 명시적 origin 허용이
   필요하다는 운영 메모만 남긴다.
4. 변경 범위는 기존 feature/shared 분리 구조를 유지하는 최소 변경으로 제한한다.
5. 가능한 검증 명령으로 build 또는 lint를 실행하고 결과를 기록한다.

## 범위 제외

- Railway 백엔드 CORS 구현 변경.
- Vercel 프로젝트 설정의 실제 등록 작업.
- 백엔드 API schema 변경.
- Security Baseline 중 프론트 설정 변경만으로 검증할 수 없는 인프라,
  로깅, 인증, 저장소 보안 항목의 구현 변경.

## 핵심 결정

- `VITE_API_BASE_URL`에는 `/tuk`까지 포함한다.
- confession API path는 `/api/confessions` 기준으로 통일한다.
- 작성 payload는 기존 기능 보존을 위해 `content`와 `mood`를 유지한다.
- Security Baseline 확장 규칙은 적용한다.
- Property-Based Testing 확장 규칙은 이번 변경에 적용하지 않는다.
