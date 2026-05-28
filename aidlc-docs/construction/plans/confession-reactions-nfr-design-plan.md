# `confession-reactions` NFR Design 계획

## 목적

승인된 NFR Requirements를 실제 frontend 구성요소, 배포 설정 및
테스트 harness 설계로 변환한다. 이 단계는 resilience, scalability,
performance, security 및 logical component 패턴을 확정하며 아직
애플리케이션 코드나 dependency를 변경하지 않는다.

## 입력 산출물 및 현재 관찰

- `aidlc-docs/construction/confession-reactions/nfr-requirements/`
- `aidlc-docs/construction/confession-reactions/functional-design/`
- `src/features/confession/ui/ReactionButtons.tsx`: 후보 구현은 현재
  반응 선택 상태를 `localStorage` helper에서 읽고 성공 시 갱신한다.
- `src/features/confession/api/confessionQueries.ts`: mutation 성공 후
  목록 및 상세 query invalidation을 이미 수행한다.
- `vercel.json`: SPA rewrite만 있으며 보안 header가 없다.
- `.env.example`: 개발 예시 API URL은 `http://localhost:8080/tuk`이며,
  production API origin은 이 단계에서 확정할 수 없다.
- `package.json`: UI 및 property test 실행 도구가 아직 없다.

## 설계 범위

- 서버 `selectedByMe` 기준 반응 상태 및 실패 복구 패턴
- 성공 후 query invalidation/refetch와 중복 요청 억제 패턴
- CSP를 포함한 HTML response security header 설계
- PBT 및 UI 품질 요구를 실행할 test harness 설계
- backend/hosting에서 제출해야 할 외부 보안 증빙 접점

## 계획 체크리스트

- [x] NFR Requirements와 현재 후보 구현의 gap을 분석한다.
- [x] 각 필수 질문 범주에 대해 적용 여부와 설계 선택지를 작성한다.
- [x] 모든 `[Answer]:` 응답을 분석하고 모호성 또는 충돌을 해결한다.
- [x] `nfr-design-patterns.md`에 선택된 품질/보안 패턴을 작성한다.
- [x] `logical-components.md`에 component 및 검증 책임을 작성한다.
- [x] 생성된 NFR Design 산출물 검토 승인을 요청한다.

## 질문 범주 평가

<!-- markdownlint-disable MD013 -->

| Category | Applicability | Reason |
| -------- | ------------- | ------ |
| Resilience Patterns | 적용 | mutation 실패 후 선택 상태 복구와 retry 책임을 설계해야 한다. |
| Scalability Patterns | 제한 적용 / 외부 의존 | frontend는 중복 요청을 억제하고, public endpoint abuse 방지는 backend 증빙이 필요하다. |
| Performance Patterns | 적용 | optimistic update 대신 refetch 일관성을 선택했으므로 cache 갱신 패턴을 확정해야 한다. |
| Security Patterns | 적용 | `X-Device-Id`, CSP/connect origin, 안전한 오류 및 외부 보안 증빙을 설계해야 한다. |
| Logical Components | 적용 | 정규화 helper, UI, query, 배포 config 및 test harness의 책임 경계를 확정해야 한다. |

<!-- markdownlint-enable MD013 -->

## 질문

<!-- markdownlint-disable MD053 -->

### Question 1 - Resilience Patterns

반응 mutation 실패와 재시도는 어떤 패턴으로 설계할까요?

A) 자동 retry나 optimistic count 변경을 추가하지 않는다. 요청 중에는
같은 group의 모든 버튼을 잠그고, 실패 시 서버에서 받은 기존 표시
상태를 유지하며 일반화된 오류를 보여 사용자가 다시 누를 수 있게 한다.
성공 후에만 목록과 상세 query를 invalidate/refetch한다. (권장)

B) 실패한 mutation을 frontend에서 자동 retry하고 optimistic count를
먼저 표시한 뒤 rollback한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 - Scalability Patterns

공개 reaction mutation의 부하 및 abuse 대응 경계는 어떻게 설계할까요?

A) frontend는 pending 중복 클릭 차단만 소유하고 cache, queue 또는
client-side throttling을 추가하지 않는다. Rate limit과 abuse protection은
backend/edge 외부 증빙 조건으로 유지하고 최종 완료 시 확인한다. (권장)

B) frontend에 별도 throttle 또는 queue component를 도입해 요청량을
제어하고 backend 증빙 조건은 제외한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 - Performance Patterns

성능과 서버 상태 일관성의 균형은 어떤 query 패턴으로 확정할까요?

A) 별도 latency SLA나 optimistic cache patch를 추가하지 않고 기존
TanStack Query invalidation/refetch 경로를 사용한다. 목록과 상세가
모두 최신 count 및 `selectedByMe`를 서버에서 다시 읽게 한다. (권장)

B) mutation 성공 전에 list/detail cache를 직접 patch해 즉각적인 count
변경을 보여주고 이후 서버 응답과 조정한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4 - Security Patterns

환경별 API origin과 CSP/security header는 어떤 방식으로 설계할까요?

A) `vercel.json`에 CSP, HSTS, nosniff, frame deny 및 referrer policy를
정의한다. Production CSP의 `connect-src`는 확인된 production
`VITE_API_BASE_URL` origin만 추가하고, 로컬 API origin은 production
정책에 넓게 포함하지 않는다. Production API origin이 확인되지 않으면
header 검증을 완료 조건으로 남긴다. (권장)

B) API origin 변동을 피하기 위해 CSP `connect-src *`를 사용하거나
CSP 적용을 이번 구현에서 제외한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5 - Security Evidence Boundary

Frontend가 직접 구현하지 못하는 security requirement는 어떻게 추적할까요?

A) backend의 `X-Device-Id`/path validation, rate limiting, restrictive
CORS, device id log masking, mutation audit 및 TLS 증빙을 별도 external
verification checklist로 둔다. 증빙이 없으면 frontend build/test가
통과해도 최종 보안 완료로 보고하지 않는다. (권장)

B) frontend 구현과 배포 header만 검증하면 이 기능의 보안 완료로
간주한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6 - Logical Components

NFR 동작을 어느 logical component 경계에 배치할까요?

A) 기존 feature 경계를 유지한다. model에 reaction 상수/type 및 순수
정규화 helper를 두고, query hook은 API mutation과 refetch를 맡으며,
`ReactionButtons`는 접근성 표시와 pending/error interaction만 맡는다.
추가 cache/queue/circuit-breaker component는 만들지 않는다. (권장)

B) 반응 상태와 retry/cache 로직을 담당하는 새로운 전역 service 또는
store component를 도입한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7 - Test Harness Components

접근성 및 pending/error UI 품질을 자동 검증하기 위한 테스트 구성은
어떻게 할까요?

A) 승인된 `Vitest`와 `fast-check`에 더해 필요한 경우
`@testing-library/react`, `@testing-library/jest-dom`, `jsdom`을 개발
dependency로 추가한다. 순수 helper property test와 버튼 UI의
`aria-pressed`, disabled, alert 렌더링 test를 함께 수행한다. (권장)

B) `Vitest`와 `fast-check`로 순수 helper만 검증하고 버튼 UI 요구는
수동 확인으로만 남긴다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8 - Plan Approval

위 답변에 따라 NFR Design 계획을 승인하고 산출물 생성을 진행할까요?

A) 답변한 방식으로 계획을 승인하고 NFR Design 산출물을 생성한다.

B) 계획 변경을 요청하고 NFR Design 계획 단계에 머문다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

<!-- markdownlint-enable MD053 -->

## 산출물 예정 위치

- `aidlc-docs/construction/confession-reactions/nfr-design/nfr-design-patterns.md`
- `aidlc-docs/construction/confession-reactions/nfr-design/logical-components.md`

## 응답 분석 결과

- **Question 1: A** - 자동 retry 및 optimistic update 없이 기존 서버
  표시 상태를 유지하고 사용자 재시도를 허용하는 resilience 패턴을
  선택한다.
- **Question 2: A** - frontend는 pending 중복 클릭 방지만 수행하며,
  rate limit과 abuse 대응은 external verification으로 유지한다.
- **Question 3: A** - 기존 TanStack Query invalidate/refetch를 서버
  일관성 패턴으로 사용하고 cache patch는 추가하지 않는다.
- **Question 4: A** - HTML security header를 구성하며 CSP
  `connect-src`는 확인된 production API origin만 허용한다. API origin
  미확정 시 header 검증은 완료 조건으로 남긴다.
- **Question 5: A** - backend 보안과 TLS 증빙은 별도 checklist로
  관리하며 증빙 없이는 최종 보안 완료로 선언하지 않는다.
- **Question 6: A** - 기존 model/query/UI 경계를 유지하며 새 전역
  store, queue 또는 circuit breaker를 도입하지 않는다.
- **Question 7: A** - `Vitest`와 `fast-check`에 더해 필요한 component
  test harness dependency를 추가해 접근성과 interaction을 자동
  검증한다.
- **Question 8: A** - NFR Design 계획을 승인하며 산출물 생성을
  진행한다. 응답 간 충돌이나 추가 확인이 필요한 모호성은 없다.
