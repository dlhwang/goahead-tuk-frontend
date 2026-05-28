# `confession-reactions` NFR Logical Components

## Component Boundary

NFR 구현은 기존 confession feature와 shared HTTP 경계를 유지한다.
새 전역 state store, queue, circuit breaker 또는 client rate limiter는
도입하지 않는다.

```text
ConfessionCard / DetailPanel
  -> ReactionButtons
     -> normalizeConfessionReactions
     -> useConfessionReactionMutation
        -> confession API service
           -> shared HTTP client with X-Device-Id

Vercel HTML response configuration
  -> browser security header enforcement

Vitest test harness
  -> fast-check pure helper properties
  -> Testing Library component interactions

External evidence checklist
  -> backend / edge / hosting confirmation
```

## Frontend Logical Components

<!-- markdownlint-disable MD013 -->

| Component | Responsibility | NFR Behavior | Expected Code Location |
| --------- | -------------- | ------------ | ---------------------- |
| Reaction type model | 반응 type, label 및 response shape를 중앙 관리한다. | `selectedByMe`를 typed contract로 포함한다. | `src/features/confession/model/types.ts` 또는 같은 feature model |
| Reaction normalizer | 누락 reaction response를 세 버튼 표시 모델로 변환한다. | 순수 함수, default `0`/`false`, PBT 대상이다. | confession model helper |
| `ReactionButtons` | 표시와 사용자 interaction feedback을 렌더링한다. | `aria-pressed`, `data-testid`, 전체 pending disable, safe alert를 제공한다. | `src/features/confession/ui/ReactionButtons.tsx` |
| Reaction query hook | 선택/해제 mutation과 query 갱신을 조정한다. | 서버 authoritative refetch를 유지하고 optimistic patch/retry를 추가하지 않는다. | `src/features/confession/api/confessionQueries.ts` |
| Confession API service | endpoint별 HTTP method를 노출한다. | PUT/DELETE method 책임을 UI 밖에 둔다. | `src/features/confession/api/confessionApi.ts` |
| Shared HTTP client | 공통 request header와 error transport를 처리한다. | 기존 device id를 `X-Device-Id`로 재사용한다. UI에 값을 노출하지 않는다. | `src/shared/api/httpClient.ts` |
| Legacy selection storage | 기존 local reaction 선택 저장소다. | 서버 선택 상태 기준과 충돌하므로 사용 제거 후 미사용이면 삭제한다. | `src/shared/storage/reactionSelections.ts` |

<!-- markdownlint-enable MD013 -->

## Deployment Logical Component

<!-- markdownlint-disable MD013 -->

| Component | Responsibility | Design Constraint | Verification |
| --------- | -------------- | ----------------- | ------------ |
| Vercel document response config | SPA document response에 보안 header를 제공한다. | CSP `connect-src`는 production API origin 확정 후 필요한 origin만 허용한다. local development origin을 production policy에 무조건 포함하지 않는다. | preview/deployed response header 확인 |

<!-- markdownlint-enable MD013 -->

Production `VITE_API_BASE_URL`이 확정되지 않은 경우, Code Generation에서
허위로 넓은 CSP를 작성하지 않고 미확정 배포 검증 조건을 기록한다.

## Test Harness Components

<!-- markdownlint-disable MD013 -->

| Harness Component | Purpose | Coverage |
| ----------------- | ------- | -------- |
| `Vitest` runner | TypeScript unit/component test 실행 | helper 및 UI test suite |
| `fast-check` | response 배열 변형 generator 및 shrinking | normalization invariant와 reproducible seed |
| `jsdom` | browser-like DOM environment | reaction button rendering |
| `@testing-library/react` | 사용자 interaction 기반 component render/click | button pending/error/select behavior |
| `@testing-library/jest-dom` | accessible DOM assertions | `aria-pressed`, disabled, alert presence |

<!-- markdownlint-enable MD013 -->

## Interaction Sequence

### 성공 경로

1. 목록 또는 상세 query가 response의 `reactions`를 전달한다.
2. normalizer가 고정된 세 반응 display model을 만든다.
3. 사용자가 버튼을 클릭하면 UI는 해당 항목의 `selectedByMe`를 mutation
   payload에 전달한다.
4. query/API 계층은 선택 상태에 따라 PUT 또는 DELETE를 호출하며,
   shared HTTP client는 기존 device id header를 보낸다.
5. pending 동안 해당 component의 모든 반응 버튼이 disabled 된다.
6. 성공 후 list/detail query가 invalidate/refetch되고 UI가 새
   `selectedByMe`와 count를 표시한다.

### 실패 경로

1. mutation 요청이 실패한다.
2. optimistic display 변경이 없으므로 이전 서버 response 표시는
   그대로 유지된다.
3. UI는 일반화된 한국어 오류를 `role="alert"`로 표시한다.
4. pending이 끝난 뒤 사용자는 버튼을 다시 눌러 재시도할 수 있다.

## External Verification Component

다음은 코드 component가 아니라 최종 완료를 위한 증빙 checklist다.

<!-- markdownlint-disable MD013 -->

| Verification Item | Owner | Completion Impact |
| ----------------- | ----- | ----------------- |
| API TLS/HTTPS 제공 | Hosting / backend | 미확인 시 SECURITY-02 완료 불가 |
| 입력 및 header validation | Backend | 미확인 시 SECURITY-05 완료 불가 |
| Rate limiting / abuse controls | Backend / edge | 미확인 시 SECURITY-11 완료 불가 |
| Restrictive CORS | Backend / gateway | 미확인 시 SECURITY-08 완료 불가 |
| Device id log masking | Backend / operations | 미확인 시 SECURITY-03 완료 불가 |
| Mutation audit/observability | Backend / operations | 미확인 시 SECURITY-13/14 완료 불가 |

<!-- markdownlint-enable MD013 -->

## Implementation Mapping

<!-- markdownlint-disable MD013 -->

| Planned Change | Owning Component | Validation |
| -------------- | ---------------- | ---------- |
| `selectedByMe` response typing 및 정규화 helper | model/normalizer | example 및 property tests |
| storage 기반 선택 판단 제거 | `ReactionButtons` / legacy storage | component test 및 `rg` usage check |
| pending/error/accessibility UI | `ReactionButtons` | Testing Library test 및 수동 UI 확인 |
| PUT/DELETE/refetch contract 유지 | query/API/client | mock/integration-oriented test와 수동 확인 |
| Security header configuration | Vercel document response config | config review 및 response header 확인 |
| Dependency 및 test script 추가 | test harness | `npm test`, lint, build, dependency audit |
| External security conditions 기록 | evidence checklist | 완료 보고에서 증빙 유무 명시 |

<!-- markdownlint-enable MD013 -->
