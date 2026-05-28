# 고해 반응 기능 요구사항 추가 확인

## 확인이 필요한 모호성

기존 답변에서는 한 device가 `PRAY`, `COMFORT`, `TOGETHER`를 동시에
선택할 수 있다고 결정했습니다. 동시에 조회 응답의 선택 상태 후보로
`selectedByMe` 또는 `myReactionType`을 제시했습니다.

복수 선택이 가능하면 단일 `myReactionType` 값은 선택 상태 전체를 표현할
수 없으므로, 서버 응답 계약을 하나로 확정해야 합니다.

## Question 1

`ConfessionResponse`가 현재 device의 복수 선택 상태를 어떤 형식으로
반환해야 할까요?

A) 각 `reactions` 배열 요소가 `selectedByMe: boolean`을 포함한다.
예: `{ "type": "PRAY", "count": 3, "selectedByMe": true }`

B) 고해 응답이 `myReactionTypes: ReactionType[]`를 별도 필드로 포함한다.
예: `{ "myReactionTypes": ["PRAY", "COMFORT"] }`

X) Other (please describe after [Answer]: tag below)

[Answer]: A
