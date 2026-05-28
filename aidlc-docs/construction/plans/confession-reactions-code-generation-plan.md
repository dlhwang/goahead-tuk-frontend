# `confession-reactions` Code Generation 계획

## 계획 상태

- **Stage**: Code Generation Part 1 - Planning
- **Unit**: `confession-reactions`
- **Project Type**: Brownfield React/Vite frontend
- **Approval Status**: 2026-05-27T08:12:09Z 승인 완료, 구현 진행 중
- **Single Source of Truth**: 이 문서의 순서와 범위에 따라 구현한다.

## Requirement Summary

고해 목록 및 상세 화면에 세 반응의 count와 서버 기준 선택 상태를
표시하고, 사용자가 PUT/DELETE로 선택 또는 해제할 수 있도록 한다.
기존 익명 device id header를 재사용하고, 실패/접근성/중복 클릭 방지,
테스트 및 승인된 배포 보안 설정을 함께 반영한다.

## Unit Context

<!-- markdownlint-disable MD013 -->

| Item | Context |
| ---- | ------- |
| Stories | US-01 세 반응 표시, US-02 선택/해제, US-03 서버 선택 상태 복원, US-04 안전하고 접근 가능한 interaction |
| Existing internal dependencies | `ReactionButtons`, confession query/API modules, shared `apiRequest`와 `getDeviceId` |
| External contracts | GET response의 `reactions[].selectedByMe`, PUT/DELETE reaction endpoints, 필수 `X-Device-Id` header |
| Data ownership | 데이터베이스 entity 없음. 서버 response display model과 browser device id 전달만 소유 |
| Service boundary | UI는 표시/interaction, query/API는 network orchestration, HTTP client는 공통 header, hosting config는 document security header 담당 |

<!-- markdownlint-enable MD013 -->

## Brownfield Gap Analysis

<!-- markdownlint-disable MD013 -->

| Area | Existing State | Planned Change |
| ---- | -------------- | -------------- |
| API service | PUT/DELETE endpoint wrapper가 존재한다. | endpoint 코드는 유지하고 테스트/검토로 계약을 확인한다. |
| Device header | `apiRequest()`가 모든 요청에 `X-Device-Id`를 설정한다. | 기존 동작을 유지하고 test/manual verification 대상으로 둔다. |
| Query sync | 성공 시 목록/상세 invalidation이 존재한다. | 서버 authoritative 동작으로 유지한다. |
| Response model | `count`만 typed되며 `selectedByMe`가 없다. | response type과 순수 normalizer를 보강한다. |
| Selection UI | `localStorage` 반응 선택 기록을 상태 기준으로 사용한다. | 서버 `selectedByMe`만 사용하고 legacy selection helper를 제거한다. |
| Test harness | 자동 test script/framework가 없다. | Vitest, fast-check 및 component harness를 추가한다. |
| Deployment security | `vercel.json`에 SPA rewrite만 있다. | 확인된 HTTPS API origin에 제한된 CSP 및 승인된 security header를 추가한다. |

<!-- markdownlint-enable MD013 -->

## Expected Files To Change

- `src/features/confession/model/types.ts`
- `src/features/confession/ui/ReactionButtons.tsx`
- `src/shared/storage/reactionSelections.ts` - 사용 제거 후 참조가 없으면 삭제
- `package.json`
- `package-lock.json`
- `vite.config.ts` 또는 별도 Vitest configuration file
- `vercel.json`

## Expected Files To Create

- `src/features/confession/model/types.test.ts` 또는 model 경계의 동등 test
- `src/features/confession/ui/ReactionButtons.test.tsx`
- `src/test/setup.ts` 또는 component test setup의 동등 파일
- `aidlc-docs/construction/confession-reactions/code/code-generation-summary.md`

## Files Or Directories That Must Not Change

- `aidlc-rules/`의 공개 workflow 규칙 디렉터리
- 기존 `src/shared/storage/deviceId.ts`의 익명 identifier 정책
- `.env.local` 및 production API endpoint 값 자체
- backend 구현, hosting 외부 보안 증빙 자료 또는 unrelated UI 영역

## Dependencies And Assumptions

- Backend GET response는 승인된 계약대로 각 반응에
  `selectedByMe: boolean`을 제공한다.
- 기존 `.env.local`에 설정된 HTTPS API origin을 production CSP
  `connect-src` 허용 대상으로 사용하되, 설정 값이 배포 환경과
  일치하는지 Build and Test/배포 확인에서 검증한다.
- Backend rate limit, validation, CORS, TLS 및 device id log masking은
  구현 대상이 아닌 external verification condition이다.
- 테스트 dependency 설치는 네트워크 또는 package registry 접근
  승인이 필요할 수 있다.

## Code Generation Steps

### Step 1 - Response Model And Normalization Logic

- [x] `src/features/confession/model/types.ts`에
  `selectedByMe: boolean` response contract를 반영한다.
- [x] 중앙 `reactionTypes` 상수를 사용해 세 타입을 고정 순서로
  반환하는 순수 `normalizeConfessionReactions()` helper를 추가한다.
- [x] 누락 type은 count `0`, `selectedByMe: false`로 보정하며 유효한
  서버 항목은 값을 보존한다.

**Stories**: US-01, US-03  
**Rules**: BR-01, BR-02, BR-03, BR-10, BR-13; NFR-M-01

### Step 2 - Business Logic Unit Testing

- [x] `Vitest`와 `fast-check` 기반 model test를 추가한다.
- [x] example test로 빈 배열, 부분 배열 및 선택 상태 보존을 검증한다.
- [x] property test로 세 type 완전성/순서, 누락 기본값, 입력 값 보존을
  검증한다.
- [x] failure seed/path 재현이 가능한 기본 fast-check 실행 경로를
  유지한다.

**Stories**: US-01, US-03  
**Rules**: NFR-T-01; PBT-03, PBT-07, PBT-08, PBT-09

### Step 3 - API And Server-State Contract Verification

- [x] 기존 API wrapper의 PUT/DELETE endpoint와 method가 승인된
  backend contract를 충족하는지 확인한다.
- [x] 기존 query mutation의 list/detail invalidation을 유지하고,
  추가 optimistic patch 또는 자동 retry를 도입하지 않는다.
- [x] 기존 shared HTTP client가 reaction 요청에 `X-Device-Id`를
  재사용함을 구현 검토 및 검증 대상에 포함한다.

**Stories**: US-02, US-03  
**Rules**: BR-05, BR-06, BR-09, BR-14, BR-15; NFR-R-01

### Step 4 - Frontend Component Generation

- [x] `ReactionButtons`가 normalizer 결과와 `selectedByMe`만으로
  selected/toggle 상태를 계산하도록 변경한다.
- [x] `localStorage` 기반 선택 상태 import와 component state를
  제거한다.
- [x] 세 버튼에 고정 `data-testid`를 추가하고 `aria-pressed`,
  동일 group pending 중 전체 disabled, `role="alert"` 오류 메시지를
  유지하거나 보완한다.
- [x] `reactionSelections.ts`가 더 이상 참조되지 않으면 삭제한다.

**Stories**: US-01, US-02, US-03, US-04  
**Rules**: BR-04부터 BR-12; NFR-U-01, NFR-U-02, NFR-R-02

### Step 5 - Frontend Component Unit Testing

- [x] `Vitest`, `jsdom`, Testing Library 기반 component test harness를
  추가한다.
- [x] 세 타입 및 누락 default 표시, `aria-pressed`, 안정적인
  `data-testid`를 검증한다.
- [x] 선택/해제 click intent와 mutation pending 전체 disabled,
  실패 alert 렌더링을 검증한다.

**Stories**: US-01, US-02, US-03, US-04  
**Rules**: NFR-U-01, NFR-U-02, NFR-R-01, NFR-R-02

### Step 6 - Test And Build Configuration

- [x] `package.json`과 lock file에 `Vitest`, `fast-check`,
  `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` 및
  필요한 testing peer dependency를 개발 의존성으로 반영한다.
- [x] 반복 실행 가능한 `test` script와 test setup/configuration을
  추가한다.
- [x] lint/build와 충돌하지 않도록 TypeScript/Vite 설정을 최소 범위로
  보완한다.

**Stories**: US-04  
**Rules**: NFR-S-03, NFR-T-01; PBT-09

### Step 7 - Deployment Security Artifact Generation

- [x] `vercel.json`의 SPA 동작을 유지하면서 HTML response security
  header를 추가한다.
- [x] CSP는 `'self'`와 확인된 HTTPS API origin만 `connect-src`에
  허용하고 wildcard 또는 local HTTP origin을 production policy에
  포함하지 않는다.
- [x] HSTS, `X-Content-Type-Options: nosniff`, frame protection 및
  referrer policy를 구성한다.
- [x] production API origin 불일치 또는 배포 header 확인 미수행은
  완료 보고의 미검증 보안 조건으로 기록한다.

**Stories**: US-04  
**Rules**: NFR-S-01; SECURITY-04, SECURITY-09

### Step 8 - Documentation And Traceability Summary

- [x] `aidlc-docs/construction/confession-reactions/code/`에 구현 변경,
  story/rule mapping, frontend 보완 상태와 external security evidence
  대기 조건을 요약한다.
- [x] 변경한 파일과 생성/삭제한 파일을 brownfield 관점으로 기록한다.
- [x] Code Generation 산출물 승인 요청을 작성한다.

**Stories**: US-01, US-02, US-03, US-04

## Build And Test Handoff

Code Generation 산출물이 승인된 다음 단계에서 아래 검증을 수행한다.

- `npm run lint`
- `npm test`
- `npm run build`
- dependency 취약점 검증 명령(실행 가능 범위에 따라 결과 기록)
- 목록/상세 반응 렌더링과 선택/해제, pending/error 상태 수동 또는
  browser 검증
- preview/deployed HTML response security header 확인 또는 미검증
  조건 기록
- backend external security evidence 확보 여부 확인

## Approval Gate

- [x] 사용자가 이 Code Generation 전체 계획과 순서를 명시적으로
  승인한다.
- [x] 승인 전에는 source code, dependency, test configuration 또는
  deployment configuration을 변경하지 않는다.
