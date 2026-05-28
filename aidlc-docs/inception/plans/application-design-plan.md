# 고해 반응 기능 Application Design 계획

## 목적

이미 존재하는 confession feature 경계 안에서 고해 반응 기능의
component 책임과 상호작용을 확정한다. 이 설계는 `Units Generation`의
선행 산출물을 제공하며 상세 business rule은 후속 `Functional Design`에
남긴다.

## 설계 범위

- `ConfessionReaction` response model과 반응 type metadata.
- 반응 선택 및 해제 API wrapper와 React Query mutation orchestration.
- 목록 카드 및 상세 패널이 공통으로 사용하는 `ReactionButtons`.
- `apiRequest`와 기존 `deviceId` header 전달 경계.

## 범위 밖

- backend input validation, rate limiting, CORS 구현.
- deploy 또는 hosting 구조 변경.
- 새로운 routing 또는 전역 상태 아키텍처 도입.

## 계획 체크리스트

- [x] 승인된 requirements, user stories, execution plan을 확인한다.
- [x] 기존 후보 구현의 component 및 service 경계를 확인한다.
- [x] 모든 `[Answer]:` 응답을 읽고 모호성 또는 충돌 여부를 분석한다.
- [x] `components.md`에 component 책임과 interface를 작성한다.
- [x] `component-methods.md`에 method signature와 입출력 계약을 작성한다.
- [x] `services.md`에 API/query orchestration 책임을 작성한다.
- [x] `component-dependency.md`에 의존 관계와 데이터 흐름을 작성한다.
- [x] `application-design.md`에 설계 산출물 요약과 결정 사항을 통합한다.
- [x] 설계 완결성과 승인된 요구사항 추적을 검증한다.
- [x] 생성된 Application Design 산출물 검토 승인을 요청한다.

## 현재 구조 관찰

- `src/features/confession/model/types.ts`에는 반응 type과 label 상수가
  이미 존재하지만 서버 선택 상태 필드가 없다.
- `src/features/confession/api/confessionApi.ts` 및
  `confessionQueries.ts`는 PUT/DELETE와 성공 후 query invalidation
  흐름을 이미 제공한다.
- `src/shared/api/httpClient.ts`는 조회와 mutation 모두 기존
  `getDeviceId()`의 `X-Device-Id`를 전달한다.
- `ReactionButtons`는 현재 localStorage 기록을 선택 표시 기준으로
  사용하므로 승인된 서버 기준 계약과 맞지 않는다.

## 질문

<!-- markdownlint-disable MD053 -->

### Question 1

Application Design에서는 component 경계를 어떻게 확정할까요?

A) 기존 feature 경계를 유지한다. `types`, `confessionApi`,
`confessionQueries`, `ReactionButtons`, list/detail composition의 책임만
서버 기준 계약에 맞게 명확히 한다. (권장)

B) 별도의 reaction service 또는 전역 상태 경계를 새로 설계한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2

선택 상태 동기화 책임은 어떤 방식으로 설계할까요?

A) 조회 응답의 `selectedByMe`를 UI 표시의 단일 기준으로 두고,
mutation 성공 후 기존 query invalidation을 통해 서버 데이터를
다시 읽는다. localStorage 기반 반응 선택 책임은 제거한다. (권장)

B) 서버 응답을 최종 기준으로 두되, 별도 optimistic state 계층을
설계해 즉시 count와 선택 표시를 갱신하고 실패 rollback을 제공한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3

위 답변에 따라 이 Application Design 계획을 실행하도록 승인할까요?

A) 답변한 방식으로 계획을 승인하고 설계 산출물 생성을 진행한다.

B) 계획 변경을 요청하고 Application Design 계획 단계에 머문다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

<!-- markdownlint-enable MD053 -->

## 설계 산출물 작성 원칙

- 기존 코드 경계를 존중하고, 새로운 추상화는 선택된 설계에 필요한
  경우에만 도입한다.
- `selectedByMe`, `X-Device-Id`, 반응 constant, query invalidation의
  책임 소유자를 문서에서 명확히 한다.
- 접근성, 안전한 오류 표시 및 안정적인 selector는 후속 NFR과
  code generation에서 구현 가능한 책임으로 연결한다.
- 답변에 모호성이나 충돌이 있으면 별도 clarification 질문을 작성하고
  설계 산출물 생성을 보류한다.

## 응답 분석 결과

- **Question 1**: `A`를 선택하여 기존 confession feature 경계를
  유지하고 책임만 확정한다.
- **Question 2**: `A`를 선택하여 `selectedByMe`를 UI 표시의 단일
  기준으로 삼고 mutation 성공 후 query invalidation으로 서버 상태를
  다시 읽는다.
- **Question 3**: `A`를 선택하여 위 방식의 설계 산출물 생성을
  승인했다.
- **모호성 또는 충돌**: 없음. 별도 optimistic state 계층 또는 새로운
  service 경계 없이 설계를 생성한다.
