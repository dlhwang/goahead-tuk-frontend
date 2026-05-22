# 통합 검증 지침

## 목적

Vercel에서 제공되는 프론트엔드와 Railway backend base URL이 같은 API path 기준을
사용하는지 확인한다.

## 시나리오

### Scenario 1: confession 목록 조회

- **Setup**: `VITE_API_BASE_URL`을 `/tuk`까지 포함한 backend URL로 설정한다.
- **Steps**: confession 목록 화면을 열고 네트워크 요청을 확인한다.
- **Expected**: `GET /tuk/api/confessions` 요청이 backend로 전달된다.

### Scenario 2: confession 작성

- **Setup**: 작성 화면을 열고 backend가 CORS origin을 허용한 상태인지 확인한다.
- **Steps**: content와 mood를 입력해 작성 요청을 전송한다.
- **Expected**: `POST /tuk/api/confessions` 요청에 `X-Device-Id`가 포함되고,
  payload는 기존 작성 계약을 유지한다.

## 후속 점검

- Railway backend CORS allowed origin에 Vercel 배포 도메인이 등록되어야 한다.
- CORS 오류가 발생하면 프론트 저장소가 아니라 backend 운영 설정을 확인한다.
