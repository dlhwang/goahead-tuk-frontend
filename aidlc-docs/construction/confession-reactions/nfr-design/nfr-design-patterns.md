# `confession-reactions` NFR Design Patterns

## 설계 목표

이 설계는 서버가 제공하는 `selectedByMe`를 반응 선택 상태의 단일
기준으로 삼고, 실패에 안전한 사용자 경험과 최소 권한의 배포 보안
설정을 추가한다. 별도 전역 상태, optimistic cache patch, client
queue 또는 자동 retry 계층은 도입하지 않는다.

## Resilience Pattern

### Server-Authoritative Retryable Interaction

<!-- markdownlint-disable MD013 -->

| Concern | Pattern Decision | Design Consequence |
| ------- | ---------------- | ------------------ |
| Display state | response의 `selectedByMe`와 count만 표시 상태의 기준으로 사용한다. | `localStorage` 반응 선택 기록은 제거하거나 선택 판단에서 사용하지 않는다. |
| Mutation in progress | 동일한 `ReactionButtons` 내 세 버튼을 모두 disabled 처리한다. | 중복 선택/해제 요청을 방지하며 별도 queue를 만들지 않는다. |
| Mutation success | 목록과 상세 query를 invalidate하고 서버 응답을 다시 읽는다. | 두 화면의 count와 선택 표시를 서버 기준으로 수렴시킨다. |
| Mutation failure | 기존 response 표시를 유지하고 일반화된 한국어 alert를 표시한다. | rollback 코드나 자동 retry 없이 사용자가 명시적으로 재시도한다. |

<!-- markdownlint-enable MD013 -->

이 패턴은 오류 발생 시 성공처럼 보이는 상태를 만들지 않으며,
device id나 내부 오류 상세를 사용자에게 노출하지 않는다.

## Scalability And Abuse Boundary

Frontend는 하나의 interaction 영역에서 발생하는 동시 클릭을
`isPending`으로 억제한다. 요청 속도 제한, IP/device 기반 abuse
대응, burst 보호 또는 edge 차단은 browser에서 신뢰할 수 있게
보장할 수 없으므로 backend/edge 외부 증빙 대상으로 둔다.

<!-- markdownlint-disable MD013 -->

| Responsibility | Owner | Evidence |
| -------------- | ----- | -------- |
| 동일 UI 영역 중복 클릭 억제 | Frontend | button disabled component test |
| Public mutation rate limit | Backend / edge | 정책 또는 integration evidence |
| Abuse detection and blocking | Backend / operations | 운영 증빙 |

<!-- markdownlint-enable MD013 -->

## Performance And Consistency Pattern

### Refetch Over Optimistic Patch

- 기존 TanStack Query mutation 성공 callback에서 list/detail key를
  invalidate하는 패턴을 유지한다.
- optimistic count 업데이트, rollback store, 새로운 cache
  synchronization abstraction은 추가하지 않는다.
- 별도 latency SLA를 정의하지 않고 pending feedback와 서버 일관성을
  우선한다.
- 목록과 상세가 동시에 보이는 경우에도 각 query가 새 response를 받아
  동일한 표시 규칙으로 렌더링한다.

## Security Patterns

### Safe Client Identity Propagation

- 기존 device id 생성 및 재사용 경로를 유지하고 API 계층이
  `X-Device-Id` header를 전달한다.
- UI는 device id, response body 또는 내부 error detail을 오류
  메시지에 삽입하지 않는다.
- Backend는 device id 형식/길이, confession id 및 reaction type을
  검증하고 로그 마스킹을 제공해야 한다.

### Restrictive HTML Response Headers

`vercel.json`에 document 응답을 대상으로 다음 header 패턴을
구현한다. CSP의 production `connect-src` 값은 실제 배포 API origin이
확인된 후 확정하며 wildcard 연결을 허용하지 않는다.

<!-- markdownlint-disable MD013 -->

| Header Pattern | Design Value / Constraint | Validation |
| -------------- | ------------------------- | ---------- |
| `Content-Security-Policy` | 기본 origin을 제한하고 script/frame을 통제한다. `connect-src`는 `'self'`와 확인된 production API origin만 포함한다. | deployed/preview HTML header inspection |
| `Strict-Transport-Security` | production HTTPS에서 downgrade를 방지한다. | HTTPS response header inspection |
| `X-Content-Type-Options` | `nosniff`를 사용한다. | response header inspection |
| `X-Frame-Options` | embedding 요구가 없으므로 `DENY`를 사용한다. | response header inspection |
| `Referrer-Policy` | 필요한 navigation을 유지하면서 referrer 노출을 제한한다. | response header inspection |

<!-- markdownlint-enable MD013 -->

로컬 예시 API URL은 production CSP 허용 목록에 자동 포함하지 않는다.
Production API origin이 제공되지 않으면 CSP 구현 및 배포 header 확인은
미검증 완료 조건으로 남긴다.

## Security Evidence Gate

Frontend 구현과 자동 테스트 결과 외에도 다음 외부 조건이 확인되어야
보안 완료를 주장할 수 있다.

<!-- markdownlint-disable MD013 -->

| External Evidence | Required Confirmation |
| ----------------- | --------------------- |
| Transport | frontend/API production traffic이 HTTPS/TLS로 제공되는지 확인 |
| API validation | `X-Device-Id`, `confessionId`, `type` 허용값과 크기 검증 |
| Abuse prevention | 공개 PUT/DELETE endpoint의 rate limiting 또는 동등 보호 |
| CORS | production frontend origin에 제한된 허용 정책 |
| Logging | device id와 요청 식별 정보가 마스킹되거나 민감하게 노출되지 않음 |
| Mutation audit | reaction 변경 요청의 필요한 감사/관측 정책 존재 |

<!-- markdownlint-enable MD013 -->

## Test And Verification Pattern

### Pure Invariant Verification

- `normalizeConfessionReactions()`를 순수 helper로 두고 `Vitest`와
  `fast-check`로 검증한다.
- generator는 유효 type의 부분집합 및 순열, non-negative count,
  boolean `selectedByMe`를 생성한다.
- property는 세 type 완전성/고정 순서, 누락 기본값, 입력 값 보존을
  검증한다.
- failure output의 seed/path를 보존해 동일 counterexample을 재실행할
  수 있어야 한다.

### Component Interaction Verification

- 필요한 test harness는 `@testing-library/react`,
  `@testing-library/jest-dom`, `jsdom`을 사용한다.
- `ReactionButtons`는 `aria-pressed`, stable `data-testid`, mutation
  pending 중 전체 disabled, 실패 시 `role="alert"`를 검증한다.
- 선택/해제 요청의 PUT/DELETE 분기는 query/API 계층 test 또는 mock
  interaction test로 확인한다.

## Traceability

<!-- markdownlint-disable MD013 -->

| Requirement | Pattern |
| ----------- | ------- |
| NFR-U-01, NFR-U-02 | Accessible button state and safe alert component test |
| NFR-R-01, NFR-R-02 | Server-authoritative retryable interaction, pending lock |
| NFR-M-01 | Pure normalization helper and retained feature boundaries |
| NFR-P-01 | Refetch over optimistic patch |
| NFR-S-01 | Restrictive HTML response headers |
| NFR-S-02 | Security evidence gate |
| NFR-S-03 | Locked dependencies and audit verification |
| NFR-T-01 | Pure invariant and component interaction verification |

<!-- markdownlint-enable MD013 -->
