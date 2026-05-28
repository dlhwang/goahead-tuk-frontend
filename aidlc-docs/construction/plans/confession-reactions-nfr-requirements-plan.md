# `confession-reactions` NFR Requirements 계획

## 목적

승인된 반응 기능 규칙에 Security Baseline Full과 Property-Based
Testing Partial 요구를 적용하고, 프론트엔드에서 구현할 품질 보완과
외부 backend 또는 배포 증빙 조건을 구분한다.

## 입력 산출물 및 현재 관찰

- `aidlc-docs/construction/confession-reactions/functional-design/`
- `aidlc-docs/inception/requirements/requirements.md`
- `vercel.json`: SPA rewrite만 있으며 HTTP security header 설정이 없다.
- `package.json`: `lint`와 `build`는 있으나 테스트 script,
  `vitest`, `fast-check`가 없다.
- `package-lock.json`: dependency lock file은 존재한다.

## 적용 범위

- **Frontend 소유**: 안전한 오류 UI, 접근성, pending 동작,
  자동화 selector, 정규화 helper 테스트, HTML-serving 배포 header
  설정 및 frontend dependency 검증.
- **External verification**: backend input validation, mutation rate
  limiting, restrictive CORS, device id logging 정책, backend response
  contract.
- **비적용 범위**: 새로운 인증, 데이터 저장소, network infrastructure,
  alerting infrastructure 구현.

## 계획 체크리스트

- [x] Functional Design과 활성화된 Security/PBT extension을 확인한다.
- [x] 현재 frontend security header 및 test stack 상태를 확인한다.
- [x] 모든 `[Answer]:` 응답을 분석하고 모호성 또는 충돌을 해결한다.
- [x] `nfr-requirements.md`에 품질 속성과 보안/PBT compliance를 작성한다.
- [x] `tech-stack-decisions.md`에 테스트 및 deployment 설정 결정을
  작성한다.
- [x] frontend 소유 보완과 backend 외부 증빙 조건을 분리해 검증한다.
- [x] 생성된 NFR Requirements 산출물 검토 승인을 요청한다.

## NFR 범주 평가

<!-- markdownlint-disable MD013 -->

| Category | 적용 판단 | 이 unit에서 필요한 판단 |
| -------- | --------- | ------------------------ |
| Scalability | External verification | public mutation abuse 방지는 backend rate limit 증빙 조건이다. |
| Performance | Minimal | 즉시 optimistic UI 대신 pending feedback와 refetch 일관성을 우선한다. |
| Availability | Minimal | 요청 실패 시 안전한 재시도 가능한 UI를 제공한다. |
| Security | 적용 | safe error, HTML security header, backend 검증/CORS/logging 증빙을 추적한다. |
| Tech Stack | 적용 | 정규화 invariant를 위한 test runner와 PBT framework가 필요하다. |
| Reliability | 적용 | 서버 기준 상태, 실패 시 기존 상태 유지, 중복 클릭 방지를 검증한다. |
| Maintainability | 적용 | 상수와 순수 helper, API/UI 분리 및 테스트 script를 유지한다. |
| Usability | 적용 | `aria-pressed`, disabled, alert, stable selector를 요구한다. |

<!-- markdownlint-enable MD013 -->

## 질문

<!-- markdownlint-disable MD053 -->

### Question 1

Security Full에서 이 frontend 저장소가 소유할 보완 범위는 어떻게
정할까요?

A) UI의 일반화된 오류 메시지를 유지하고, `vercel.json`에 HTML
응답 보안 header를 추가하며, dependency 검증을 수행한다. Backend의
input validation, rate limiting, restrictive CORS 및 device log
마스킹은 외부 검증 조건으로 명시하고 증빙 없이는 최종 완료로
간주하지 않는다. (권장)

B) 반응 UI 코드만 보완하고 deployment header 및 외부 보안 검증
조건은 이번 범위에서 제외한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2

Partial PBT의 정규화 invariant를 어떤 테스트 기술로 검증할까요?

A) 기존 TypeScript/Vite 프로젝트에 `Vitest`와 `fast-check`를 개발
dependency로 추가하고, example-based test와 property-based test를
작성한다. shrinking은 기본 동작을 유지하고 재현 가능한 seed 출력을
검증 계획에 포함한다. (권장)

B) 자동 테스트 dependency를 추가하지 않고 수동 검증만 수행한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3

사용성, 성능 및 availability 품질 기준은 어떻게 설정할까요?

A) 별도 latency SLA는 두지 않고, pending 중 전체 버튼 disabled,
`aria-pressed`, `role="alert"`, stable `data-testid`, 서버 refetch
일관성과 실패 후 재시도 가능한 메시지를 필수 품질 기준으로 둔다.
(권장)

B) 별도의 response time 또는 availability 수치 목표와 추가 UI
상태를 정의한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4

위 답변에 따라 NFR Requirements 계획을 승인하고 산출물 생성을
진행할까요?

A) 답변한 방식으로 계획을 승인하고 NFR 산출물을 생성한다.

B) 계획 변경을 요청하고 NFR Requirements 계획 단계에 머문다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

<!-- markdownlint-enable MD053 -->

## Compliance 작성 원칙

- Security Full 규칙은 각 rule을 frontend 적용, external verification,
  또는 N/A로 구분하고 근거를 남긴다.
- 이번 단계에서 식별한 미충족 항목은 승인된 보완 요구로 문서화하며,
  Code Generation 또는 Build and Test 완료 시점에 검증 결과를
  다시 평가한다.
- PBT Partial에서 적용되는 `PBT-03`, `PBT-07`, `PBT-08`, `PBT-09`는
  정규화 helper에 대한 테스트 및 tech stack 결정으로 연결한다.
- `PBT-02`는 invertible round-trip 동작이 없는 한 N/A로 기록한다.

## 응답 분석 결과

- **Question 1: A** - frontend는 일반화된 오류 메시지, HTML 응답 보안
  header와 dependency 검증을 소유한다. Backend 입력 검증, rate limit,
  restrictive CORS, device id 로그 마스킹은 최종 완료 전에 확인할
  외부 증빙 조건으로 확정한다.
- **Question 2: A** - `Vitest`와 `fast-check`를 추가하고 example-based
  및 property-based test를 작성한다. shrinking과 재현 가능한 seed
  출력 검증을 포함한다.
- **Question 3: A** - 별도 latency SLA 없이 pending 중 전체 반응 버튼
  잠금, `aria-pressed`, `role="alert"`, 안정적인 `data-testid`, 서버
  refetch 일관성 및 실패 후 재시도 가능성을 필수 기준으로 둔다.
- **Question 4: A** - NFR Requirements 계획을 승인했으며 아래
  산출물로 결정을 상세화한다. 응답 간 모호성이나 충돌은 없다.
