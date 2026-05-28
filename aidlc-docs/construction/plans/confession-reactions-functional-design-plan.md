# `confession-reactions` Functional Design 계획

## 목적

고해 반응 unit의 기능 규칙을 구현 가능한 수준으로 상세화한다.
서버 response가 선택 상태의 기준이라는 승인된 설계를 유지하면서,
누락 반응 처리, toggle 분기, mutation 성공 및 실패 흐름을 정의한다.

## 입력 산출물

- `aidlc-docs/inception/requirements/requirements.md`
- `aidlc-docs/inception/application-design/application-design.md`
- `aidlc-docs/inception/application-design/unit-of-work.md`
- `aidlc-docs/inception/application-design/unit-of-work-story-map.md`

## Unit 경계

- **Unit**: `confession-reactions`.
- **포함 기능**: 반응 정규화, 표시, 선택/해제, 서버 재조회 기반
  동기화, 오류 및 pending 동작의 기능 규칙.
- **비포함 기능**: backend 검증 또는 보안 정책 구현, deploy 설정,
  신규 store 또는 routing.

## 계획 체크리스트

- [x] Unit 정의와 배정된 story를 확인한다.
- [x] 현재 후보 구현과 승인 설계의 차이를 확인한다.
- [x] 모든 `[Answer]:` 응답을 분석하고 모호성 또는 충돌을 해결한다.
- [x] `business-logic-model.md`에 반응 표시와 toggle 흐름을 작성한다.
- [x] `business-rules.md`에 누락 타입, 선택 상태, 성공 및 실패
  규칙을 작성한다.
- [x] `domain-entities.md`에 reaction response와 interaction 의도를
  작성한다.
- [x] `frontend-components.md`에 UI 입력, 상태, interaction 및 API
  integration point를 작성한다.
- [x] 요구사항과 story에 대한 functional coverage를 검증한다.
- [x] 생성 산출물 검토 승인을 요청한다.

## 질문 범위 평가

| Category | 판단 | 확인할 결정 |
| -------- | ---- | ----------- |
| Business Logic Modeling | 적용 | 세 반응의 표시 상태를 일관되게 계산하는 규칙 |
| Domain Model | 적용 | `selectedByMe`가 reaction 표시 상태에 주는 의미 |
| Business Rules | 적용 | PUT/DELETE 선택과 누락 타입 기본값 |
| Data Flow | 적용 | mutation 성공 후 refetch와 실패 시 기존 상태 유지 |
| Integration Points | 확정됨 | 기존 API client와 `X-Device-Id` 경계를 유지 |
| Error Handling | 적용 | 요청 중 중복 조작을 막는 기능 범위 |
| Business Scenarios | 적용 | 복수 선택과 response 누락 케이스 |
| Frontend Components | 적용 | `ReactionButtons`의 표시 및 조작 책임 |

## 확정된 기반 규칙

- 세 reaction type은 항상 UI에 표시한다.
- backend response의 `selectedByMe`가 UI 선택 상태의 단일 기준이다.
- 선택되지 않은 버튼 클릭은 PUT, 선택된 버튼 클릭은 DELETE로
  해석한다.
- mutation 성공 후 기존 query invalidation/refetch로 서버 상태를
  다시 표시한다.
- localStorage 반응 선택 기록은 최종 선택 상태 판단에 사용하지 않는다.

## 질문

<!-- markdownlint-disable MD053 -->

### Question 1

누락 또는 순서가 다른 `reactions` 배열을 UI가 해석하는 기능 규칙은
어떻게 상세화할까요?

A) 세 타입을 기준으로 response를 정규화하는 순수 helper 규칙을
정의하고, 누락 타입은 `{ count: 0, selectedByMe: false }`로
보충한다. (권장)

B) 각 버튼 render 시 배열에서 직접 찾아 누락 기본값만 적용하며,
별도 정규화 규칙은 정의하지 않는다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2

반응 mutation 처리 중 중복 조작 방지 규칙은 어떻게 정의할까요?

A) 하나의 고해 반응 요청이 처리 중이면 해당 `ReactionButtons`의
세 버튼을 모두 비활성화하여 서버 상태 재조회 전 충돌하는 의도를
막는다. (권장)

B) 요청 중인 reaction type 버튼만 비활성화하고 다른 타입의 클릭은
허용한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3

실패 흐름의 표시 상태 규칙은 어떻게 정의할까요?

A) optimistic UI를 추가하지 않고 기존 서버 표시 상태를 유지하며,
한국어 오류 메시지만 노출한다. (권장)

B) optimistic 표시를 정의하고 실패 시 rollback 규칙을 추가한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4

위 답변에 따라 Functional Design 계획을 승인하고 산출물 생성을
진행할까요?

A) 답변한 방식으로 계획을 승인하고 functional design 산출물을 생성한다.

B) 계획 변경을 요청하고 Functional Design 계획 단계에 머문다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

<!-- markdownlint-enable MD053 -->

## 작성 원칙

- business rule은 backend 구현 상세가 아니라 frontend unit이
  관찰하고 실행해야 하는 기능 동작으로 작성한다.
- 선택된 규칙은 후속 NFR Requirements와 Code Generation이 바로
  추적할 수 있도록 입력, 결과 및 실패 상태를 명시한다.
- 답변 간 충돌 또는 모호성이 확인되면 clarification 문서를 작성하고
  산출물 생성을 보류한다.

## 응답 분석 결과

- **Question 1**: `A`를 선택하여 세 반응 타입 기준의 순수 정규화
  규칙을 정의하고 누락 타입에 `{ count: 0, selectedByMe: false }`를
  적용한다.
- **Question 2**: `A`를 선택하여 하나의 반응 mutation 처리 중에는
  같은 `ReactionButtons`의 세 버튼을 모두 비활성화한다.
- **Question 3**: `A`를 선택하여 optimistic 표시를 도입하지 않고,
  실패 시 기존 서버 표시 상태와 한국어 오류 메시지를 유지한다.
- **Question 4**: `A`를 선택하여 위 규칙의 functional design
  산출물 생성을 승인했다.
- **모호성 또는 충돌**: 없음. 산출물 생성을 진행한다.
