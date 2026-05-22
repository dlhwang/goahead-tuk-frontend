# 빌드 지침

## 사전 조건

- **Build Tool**: npm과 Vite.
- **Dependencies**: `npm install`로 설치한 package dependencies.
- **Environment Variables**: `VITE_API_BASE_URL`.
- **System Requirements**: Node.js를 실행할 수 있는 로컬 환경.

## 빌드 단계

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

로컬 개발 예시는 `.env.local`에 둔다.

```bash
VITE_API_BASE_URL=http://localhost:8080/tuk
```

### 3. 프론트엔드 빌드

```bash
npm run build
```

### 4. 성공 확인

- **Expected Output**: TypeScript build와 Vite production build가 성공한다.
- **Build Artifacts**: `dist/`.
- **Common Warnings**: 현재 검증에서는 별도 경고를 확인하지 않았다.

## 문제 해결

### API base URL 누락

- **Cause**: `VITE_API_BASE_URL`이 build 또는 dev 환경에 없다.
- **Solution**: Vercel 또는 `.env.local`에 값을 등록하고 다시 실행한다.

### TypeScript 빌드 실패

- **Cause**: API wrapper 또는 타입 변경이 기존 feature 경계와 맞지 않는다.
- **Solution**: `src/shared/api`와 `src/features/confession/api` 변경을 확인하고
  `npm run build`를 다시 실행한다.
