# Go ahead, Tuk Frontend

React, Vite, TypeScript 기반의 모바일 우선 고해 MVP입니다.

## 실행

```bash
npm install
npm run dev
```

`.env`에 API 주소를 설정합니다.

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## API

모든 요청은 `X-Device-Id` 헤더를 포함합니다. 디바이스 ID는 `localStorage`에
저장되며 없으면 `crypto.randomUUID()`로 생성됩니다.

- `GET /api/confessions`
- `GET /api/confessions/:confessionId`
- `POST /api/confessions`
- `PUT /api/confessions/:confessionId/reactions/:type`
- `DELETE /api/confessions/:confessionId/reactions/:type`

## 구조

- `src/shared/api`: 공통 HTTP 클라이언트
- `src/shared/storage`: 브라우저 저장소 접근 계층
- `src/features/confession/api`: 고해 API 및 TanStack Query 훅
- `src/features/confession/model`: 고해 타입과 모델 상수
- `src/features/confession/ui`: 고해 UI 컴포넌트
- `src/pages`: 라우트 페이지
