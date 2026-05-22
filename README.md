# Go ahead, Tuk Frontend

React, Vite, TypeScript 기반의 모바일 우선 고해 MVP 프론트엔드입니다.

## 실행

```bash
npm install
npm run dev
```

로컬 개발에서는 `.env.local`에 backend API base URL을 설정합니다. base URL은
backend context path인 `/tuk`까지 포함합니다.

```bash
VITE_API_BASE_URL=http://localhost:8080/tuk
```

## Vercel 배포

Vercel Project Settings > Environment Variables에 다음 값을 등록합니다.

```bash
VITE_API_BASE_URL=https://goahead-tuk-backend-production.up.railway.app/tuk
```

`VITE_API_BASE_URL`은 브라우저에 노출되는 배포 설정값입니다. DB 비밀번호,
JWT secret, Railway token, 외부 API secret key 같은 비밀값은 프론트 환경변수에
추가하지 않습니다.

## CORS 메모

Vercel 배포 도메인은 Railway 백엔드의 CORS allowed origin에 추가해야 합니다.
백엔드 CORS 구현과 운영 설정은 이 프론트 저장소에서 수정하지 않습니다.

## API

모든 요청은 공통 API client가 `X-Device-Id` 헤더를 포함합니다. device id는
`localStorage`에 저장하고, 값이 없으면 `crypto.randomUUID()`로 생성합니다.

- `GET /api/confessions`
- `GET /api/confessions/:confessionId`
- `POST /api/confessions`

## 구조

- `src/shared/api`: 공통 HTTP client와 API error type
- `src/shared/storage`: 브라우저 저장소 접근 계층
- `src/features/confession/api`: confession API와 TanStack Query hook
- `src/features/confession/model`: confession type과 model 상수
- `src/features/confession/ui`: confession UI component
- `src/pages`: route page
