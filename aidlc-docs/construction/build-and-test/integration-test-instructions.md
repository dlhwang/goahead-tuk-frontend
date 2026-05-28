# Integration Test Instructions

## Purpose

Frontend reaction UI와 external backend API의 response/mutation/header
계약을 확인한다.

## Test Scenarios

### Scenario 1: List And Detail Response Rendering

- **Description**: GET response의 count와 `selectedByMe`가 목록 및
  상세의 공통 UI에 표시되는지 확인한다.
- **Setup**: backend가 reactions와 `selectedByMe`를 제공하고 local
  frontend origin의 CORS 요청을 허용해야 한다.
- **Expected Results**: 세 반응 버튼이 항상 표시되며 누락 type은 `0`,
  서버 선택 type은 pressed 상태다.

### Scenario 2: Select And Deselect Mutation

- **Description**: 미선택 type은 PUT, 선택 type은 DELETE를 보내고
  성공 후 refetch 결과가 표시되는지 확인한다.
- **Setup**: backend mutation endpoint 및 `X-Device-Id` validation 필요
- **Expected Results**: 요청 처리 중 버튼이 잠기고 성공 후 서버
  response 기준 상태로 갱신된다.

## Execution Status

- Local browser로 application shell 및 데이터 조회 실패 UI를 확인했다.
- Local origin에서 external production API 결과를 수신하지 못해 실제
  GET/PUT/DELETE integration behavior는 검증하지 못했다.
- Backend/CORS 가능 환경에서 위 시나리오를 재실행해야 한다.

## Mandatory MVP Demo Smoke Evidence

MVP demo risk acceptance를 적용하려면 실제 Railway backend에 대해
다음 결과를 증빙해야 한다.

- 정상 `X-Device-Id`를 포함한 GET 반응 조회 성공
- 동일 device id로 PUT 선택 요청 성공 및 새 GET response 확인
- 동일 device id로 DELETE 해제 요청 성공 및 새 GET response 확인
- 실제 Vercel origin을 허용하고 다른 origin을 허용하지 않는
  production CORS 증빙
