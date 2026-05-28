# `confession-reactions` NFR Requirements

## 범위 및 결정

이 문서는 고해 목록 및 상세 화면의 반응 표시와 선택/해제 기능에
적용되는 비기능 요구를 정의한다. 구현은 서버가 반환하는
`selectedByMe`를 선택 상태의 기준으로 사용하며, 성공 후 refetch로
화면 상태를 서버 응답과 일치시킨다.

Security Baseline은 Full, Property-Based Testing은 Partial로 적용한다.
아래 항목은 요구와 검증 조건을 정의한 것이며, 아직 구현 완료 또는
보안 준수를 증명하는 결과가 아니다.

## 품질 요구사항

<!-- markdownlint-disable MD013 -->

| ID | Category | Requirement | Completion Evidence |
| -- | -------- | ----------- | ------------------- |
| NFR-U-01 | Usability / Accessibility | 세 반응 버튼은 항상 표시되며 누락된 type은 count `0`, 선택 상태 `false`로 나타난다. 각 버튼은 `aria-pressed`와 안정적인 `data-testid`를 제공한다. | component 및 UI test |
| NFR-U-02 | Usability | mutation 실패 시 사용자가 이해할 수 있는 한국어 오류 메시지를 `role="alert"`로 표시하고 다시 시도할 수 있다. 내부 세부 정보나 device id는 노출하지 않는다. | UI test 및 수동 확인 |
| NFR-R-01 | Reliability | 선택 상태의 단일 기준은 response의 `selectedByMe`이며, 성공 시 query invalidation/refetch 결과를 표시한다. 실패 시 이전 서버 표시 상태를 유지한다. | query/component test 및 수동 확인 |
| NFR-R-02 | Reliability | 반응 mutation 처리 중 같은 button group의 세 버튼을 모두 disabled하여 중복 요청을 방지한다. | component test |
| NFR-M-01 | Maintainability | 반응 type 목록과 label은 공통 상수로 관리하고, 누락 type 방어 로직은 순수 정규화 helper로 분리한다. API 호출은 UI에서 직접 구현하지 않는다. | code review 및 unit test |
| NFR-P-01 | Performance | 별도의 latency SLA는 추가하지 않는다. 즉시 optimistic count 변경 대신 pending feedback와 서버 refetch 일관성을 우선한다. | 설계/수동 확인 |
| NFR-S-01 | Security | HTML 응답에 적절한 security header를 제공하며, CSP의 `connect-src`는 실제 `VITE_API_BASE_URL` 사용을 허용하면서 불필요한 origin은 허용하지 않는다. | `vercel.json` 검토 및 preview header 확인 |
| NFR-S-02 | Security | 공개 mutation endpoint의 입력 검증, rate limiting, restrictive CORS 및 device id 로그 마스킹에 대한 backend 증빙이 최종 완료 전에 확보되어야 한다. | backend/API 운영 증빙 |
| NFR-S-03 | Supply Chain | lock file을 유지하고 추가 dependency를 잠근 뒤 dependency 취약점 검증 결과를 기록한다. | lock file diff 및 audit 결과 |
| NFR-T-01 | Testing | 반응 정규화 helper에는 example-based test와 property-based test를 작성하고, 실패 시 seed로 재현 가능한 검증 경로를 유지한다. | `Vitest`/`fast-check` test run |

<!-- markdownlint-enable MD013 -->

## 구현 전 필수 보완

- `vercel.json`에 SPA 문서 응답용 보안 header를 추가한다. 최소 대상은
  Content Security Policy, Strict Transport Security,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`다.
- 화면의 선택 상태 기준에서 브라우저 저장 기반 반응 선택을 제거하고,
  backend `selectedByMe` 응답만 사용한다.
- 반응 정규화 helper 및 자동 테스트 도구를 추가하고 버튼 접근성,
  pending 잠금, 실패 메시지 표시를 테스트한다.
- 추가 dependency와 현재 dependency의 취약점 검증 결과를 Build and
  Test 단계에서 기록한다.

## 외부 검증 조건

다음 조건은 이 frontend 저장소가 직접 구현하지 않지만, 공개 반응
mutation의 최종 완료 판단에 필요한 backend 또는 배포 증빙이다.

- Backend는 `X-Device-Id`, `confessionId`, `type`을 검증하고 허용되는
  reaction type만 처리해야 한다.
- Backend 또는 edge 계층은 공개 PUT/DELETE mutation에 abuse 방지
  rate limit을 적용해야 한다.
- CORS 정책은 실제 frontend origin만 허용하도록 제한되어야 한다.
- 로그와 관측 데이터에서 device id는 노출되지 않거나 마스킹되어야 한다.
- GET response가 `PRAY`, `COMFORT`, `TOGETHER`의 count 및
  `selectedByMe` 계약을 안정적으로 제공한다는 통합 확인이 필요하다.

## Security Baseline Compliance

<!-- markdownlint-disable MD013 -->

| Rule | Applicability | Requirement / Evidence Status |
| ---- | ------------- | ----------------------------- |
| SECURITY-01 Data Protection at Rest | N/A | 이 unit은 새로운 저장소나 보호 데이터 저장을 도입하지 않는다. 반응 선택의 local storage authority는 제거 대상이다. |
| SECURITY-02 Data Protection in Transit | External verification | API 및 hosting TLS 처리는 배포/backend 증빙으로 확인한다. frontend unit은 평문 endpoint를 추가하지 않는다. |
| SECURITY-03 Sensitive Data in Logs | External verification | device id 로그 마스킹은 backend/observability 증빙이 필요하다. frontend는 device id를 UI 오류에 표시하지 않는다. |
| SECURITY-04 Security Headers | Frontend remediation required | `vercel.json`에 CSP, HSTS, nosniff, frame protection 및 referrer policy를 구현하고 검증한다. |
| SECURITY-05 Input Validation | External verification | backend가 header와 path parameter를 검증한다는 증빙이 필요하다. |
| SECURITY-06 IAM Least Privilege | N/A | 이 frontend unit은 IAM 자원을 변경하지 않는다. |
| SECURITY-07 Network Isolation | N/A | network resource를 변경하지 않는다. |
| SECURITY-08 API Exposure / CORS | External verification | 공개 reaction API의 origin 제한과 노출 정책을 확인해야 한다. |
| SECURITY-09 Secure Defaults | Frontend remediation required | 오류는 일반화된 사용자 메시지로 표시하고 HTML 응답 header를 안전한 기본값으로 설정한다. |
| SECURITY-10 Dependency Security | Frontend verification required | lock file을 유지하고 신규 테스트 dependency를 포함한 취약점 검증을 수행한다. |
| SECURITY-11 Abuse Prevention | External verification | UI 중복 클릭 잠금은 구현하지만 rate limit 증빙은 backend에서 필요하다. |
| SECURITY-12 Credential Management | N/A | 인증 credential 또는 secret을 도입하지 않는다. |
| SECURITY-13 Data Integrity / Audit | Split ownership | frontend는 typed reaction contract와 서버 refetch를 사용한다. mutation audit 가능성은 backend 증빙이 필요하다. |
| SECURITY-14 Monitoring / Alerting | External verification | 이 unit에서 운영 모니터링 인프라를 추가하지 않으며 필요한 운영 증빙은 외부 조건으로 둔다. |
| SECURITY-15 Error Handling | Frontend remediation required | mutation 오류의 사용자 메시지와 재시도 흐름을 구현하고 test로 확인한다. |

<!-- markdownlint-enable MD013 -->

## Property-Based Testing Compliance

<!-- markdownlint-disable MD013 -->

| Rule | Applicability | Requirement / Evidence Status |
| ---- | ------------- | ----------------------------- |
| PBT-01 Property Identification | Advisory addressed | 정규화 결과가 항상 세 type을 순서대로 포함하고 누락 type을 기본값으로 채운다는 property를 기록한다. |
| PBT-02 Round-Trip Properties | N/A | 정규화 기능에는 inverse 또는 round-trip 연산이 없다. |
| PBT-03 Invariant Testing | Required | `normalizeConfessionReactions()`의 type 완전성, 기본값 및 값 보존 invariant를 property test로 검증한다. |
| PBT-07 Generator Strategy | Required | 허용 reaction type의 부분집합/순열, non-negative count, boolean 선택값을 생성해 누락 및 순서 변형을 포함한다. |
| PBT-08 Shrinking / Reproducibility | Required | `fast-check` shrinking을 유지하고 실패 seed를 test output으로 재실행 가능하게 남긴다. |
| PBT-09 Tool Selection | Required | `Vitest`와 `fast-check`를 개발 dependency 및 실행 script에 추가한다. |

<!-- markdownlint-enable MD013 -->

## 완료 판단

NFR Requirements 단계에서는 위 보완과 외부 증빙 조건을 승인 가능한
요구로 확정한다. Code Generation과 Build and Test 이후 frontend
보완 구현 및 테스트 증빙을 재평가하며, backend 보안 조건의 증빙이
없다면 기능을 최종 완료로 보고하지 않는다.
