# MVP Demo Conditional Risk Acceptance

## Decision

Frontend 보완과 자동 검증은 완료되었다. Security Full completion은
외부 backend 및 배포 증빙이 부족하므로 보류한다.

MVP demo 배포는 아래 최소 gate가 모두 확인된 경우에만
**Risk Accepted** 상태로 진행할 수 있다. 이 문서는 배포 승인 자체가
아니며, gate 충족 증빙이 아직 없는 현재 상태는 **Pending Evidence**다.

## Mandatory MVP Demo Gates

<!-- markdownlint-disable MD013 -->

| Gate | Required Evidence | Current Status | Deployment Impact |
| ---- | ----------------- | -------------- | ----------------- |
| RA-MVP-01 정상 device id 처리 | 정상적인 `X-Device-Id`를 포함한 reaction 요청에서 validation error가 발생하지 않는 smoke test 결과 | Pending Evidence | 미충족 시 demo 배포 불가 |
| RA-MVP-02 device id 로그 보호 | backend 또는 운영 로그에서 device id 원문이 기록되지 않음을 확인하는 증빙 | Pending Evidence | 미충족 시 demo 배포 불가 |
| RA-MVP-03 제한된 production CORS | 허용 origin이 실제 Vercel frontend origin으로 제한됨을 보여주는 config 또는 response 증빙 | Pending Evidence | 미충족 시 demo 배포 불가 |
| RA-MVP-04 Railway smoke test | 실제 Railway backend에 대한 reaction GET, PUT, DELETE 성공 결과와 `X-Device-Id` 사용 확인 | Pending Evidence | 미충족 시 demo 배포 불가 |

<!-- markdownlint-enable MD013 -->

## Accepted For MVP Only

네 mandatory gate가 모두 통과할 경우, 다음 미완료 항목은 MVP demo의
제한된 risk acceptance 하에서 배포 후속 gate로 남길 수 있다.
이는 Security Full 완료를 의미하지 않는다.

<!-- markdownlint-disable MD013 -->

| Follow-Up Gate | Required Before | Status |
| -------------- | --------------- | ------ |
| Rate limiting 고도화 또는 abuse protection 증빙 | Security Full completion | Deferred with risk acceptance |
| Production TLS 및 deployed security header 증빙 | Security Full completion | Deferred with risk acceptance |
| Mutation audit/observability 정책 증빙 | Security Full completion | Deferred with risk acceptance |

<!-- markdownlint-enable MD013 -->

## Evidence Recording Template

Mandatory gate를 확인할 때 다음 내용을 함께 기록한다.

- 검증 일시와 검증 환경 URL
- 사용한 frontend Vercel origin 및 Railway backend origin
- GET/PUT/DELETE request 결과와 상태 코드
- `X-Device-Id` validation 결과와 로그 마스킹 확인 방법
- CORS 허용/차단 response header 또는 configuration 증빙
- 실패 항목과 배포 중지 여부

## Completion Boundary

- **Frontend implementation and automated validation**: Complete.
- **MVP demo deployment authorization**: Conditional; blocked until
  `RA-MVP-01` through `RA-MVP-04` evidence is recorded as passed.
- **Security Full completion**: Deferred; remains incomplete until all
  external and follow-up gates are verified.
