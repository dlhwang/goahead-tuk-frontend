# Build Instructions

## Prerequisites

- **Build Tool**: npm `10.9.3`, Vite `6.4.2`, TypeScript `5.7.3`
- **Runtime**: Node.js `v22.18.0`
- **Dependencies**: `package-lock.json`으로 잠긴 React/Vite application 및
  Vitest/Testing Library test harness dependencies
- **Environment Variables**: `VITE_API_BASE_URL` 필수. 현재 local
  environment는 HTTPS production backend origin을 사용한다.
- **System Requirements**: Windows PowerShell 환경과 Node/npm 실행 가능

## Build Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# .env.local 또는 실행 환경에 VITE_API_BASE_URL을 설정한다.
```

### 3. Build All Units

```bash
npm run build
```

### 4. Verify Build Success

- **Expected Output**: TypeScript build 성공 후 Vite production bundle 생성
- **Build Artifacts**: `dist/index.html`, `dist/assets/`
- **Observed Result (2026-05-27)**: 성공, 1644 modules transformed

## Troubleshooting

### Build Fails With Dependency Errors

- `npm install` 또는 lock file과 설치 상태의 불일치를 확인한다.
- registry 접근 또는 local npm cache 권한 오류가 있으면 승인된
  환경에서 dependency install을 재실행한다.

### Build Fails With Compilation Errors

- response 계약의 `selectedByMe` 필수 속성과 test source type error를
  우선 확인한다.
- 수정 후 `npm test`, `npm run lint`, `npm run build`를 다시 실행한다.
