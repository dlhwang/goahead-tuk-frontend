# 코드 생성 요약

## 변경 내용

- `.env.example`은 `VITE_API_BASE_URL=` 키만 제공하도록 정리했다.
- `.gitignore`에 `.env.production`과 `.env.*.local`을 추가했다.
- shared HTTP client는 `VITE_API_BASE_URL`이 비어 있을 때 더 명확한 오류를
  던진다.
- confession API wrapper는 `/api/confessions` 경로 기준으로 공통 client를
  호출한다.
- README는 Vercel 운영 환경변수, 로컬 `.env.local`, Railway CORS allowed
  origin 메모, 프론트 secret 금지 메모를 설명한다.

## 유지한 동작

- backend base URL은 공통 client가 `import.meta.env.VITE_API_BASE_URL`에서
  읽는다.
- 공통 client가 `X-Device-Id` 헤더를 계속 주입한다.
- confession 작성 payload는 기존 호환성을 위해 `content`와 `mood`를 유지한다.

## 검증

```bash
npm run build
npm run lint
npx markdownlint-cli2 README.md \
  aidlc-docs/construction/plans/frontend-api-base-url-code-generation-plan.md
```

- `npm run build`: 성공.
- `npm run lint`: 성공.
- README와 코드 생성 계획 Markdown lint: 성공.
