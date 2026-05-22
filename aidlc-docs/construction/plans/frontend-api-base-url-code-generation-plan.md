# 프론트엔드 API Base URL 코드 생성 계획

이 문서는 이번 Code Generation 단계의 단일 기준이다.

## 단위 컨텍스트

- **Unit**: frontend API base URL integration.
- **대상 코드 위치**: workspace root의 `src/`, `.env.example`, `.gitignore`,
  `README.md`.
- **기존 경계**: confession feature API wrapper가 shared HTTP client에 요청을
  위임한다.
- **의존성**: shared HTTP client는 device id storage helper를 사용해
  `X-Device-Id`를 주입한다.
- **유지할 계약**: confession 작성 payload는 `content`와 `mood`를 유지한다.
- **신규 데이터 저장소**: 없음.

## 요구사항 추적

- `VITE_API_BASE_URL`에서 base URL을 읽고 값이 비면 명확한 오류를 낸다.
- base URL에는 `/tuk`까지 포함하고 feature API path는 `/api/...`로 넘긴다.
- `.env.example`과 `.gitignore`를 배포 기준에 맞춘다.
- README에 Vercel 환경변수, 로컬 `.env.local`, Railway CORS 메모를 남긴다.
- build 또는 lint 검증 결과를 요약한다.

## 실행 단계

- [x] Step 1. 환경변수 예시와 ignore 규칙을 수정한다.
  - `.env.example`을 `VITE_API_BASE_URL=` 예시로 정리한다.
  - `.gitignore`에 `.env.production`과 `.env.*.local`을 보강한다.
- [x] Step 2. 공통 API client와 confession API wrapper를 정리한다.
  - 기존 shared client가 base URL 오류와 `X-Device-Id` 흐름을 유지하는지
    확인한다.
  - confession API path를 `/api/confessions` 기준으로 변경한다.
  - 상세 조회 path도 같은 기준으로 유지한다.
- [x] Step 3. 배포 문서를 수정한다.
  - README에 Vercel 운영 변수 등록 예시를 추가한다.
  - 로컬 `.env.local` 예시와 CORS allowed origin 메모를 추가한다.
  - 비밀값을 프론트 환경변수에 두지 않는 메모를 남긴다.
- [x] Step 4. 변경 결과를 검증한다.
  - 가능한 npm 검증 명령을 실행한다.
  - AI-DLC 산출물과 변경 요약을 갱신한다.

## 산출물

- 수정 코드 및 설정:
  - `.env.example`
  - `.gitignore`
  - `src/shared/api/httpClient.ts` 또는 기존 명명에 맞는 shared API client
  - `src/features/confession/api/confessionApi.ts`
  - `README.md`
- 코드 생성 요약:
  - `aidlc-docs/construction/frontend-api-base-url/code/code-summary.md`
