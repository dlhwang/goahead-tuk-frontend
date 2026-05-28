# `confession-reactions` Domain Entities

## ReactionType

```ts
type ReactionType = 'PRAY' | 'COMFORT' | 'TOGETHER';
```

- **의미**: 고해에 전할 수 있는 세 종류의 익명 반응 구분자.
- **제약**: UI 표시와 mutation path에는 세 허용 값만 사용한다.

## ConfessionReaction

```ts
type ConfessionReaction = {
  type: ReactionType;
  count: number;
  selectedByMe: boolean;
};
```

- **의미**: 고해 한 건에 대한 타입별 집계와 현재 device의 선택 여부.
- **source of truth**: backend 조회 response.
- **제약**:
  - `count`는 표시할 누적 수이다.
  - `selectedByMe`는 해당 request의 `X-Device-Id`에 대응한다.
  - 응답에 없는 타입은 UI 정규화 결과에서 기본 항목으로 보충된다.

## NormalizedReactionSet

```ts
type NormalizedReactionSet = [
  ConfessionReaction,
  ConfessionReaction,
  ConfessionReaction,
];
```

- **의미**: UI에 전달되는 고정 세 타입의 표시 집합.
- **순서**: `PRAY`, `COMFORT`, `TOGETHER`.
- **불변식**:
  - 항상 세 항목을 갖는다.
  - 각 type은 정확히 한 번 포함된다.
  - 누락 타입은 count `0`, selected `false`이다.
  - 입력에 존재하는 type의 서버 선택 상태를 보존한다.

## ToggleReactionIntent

```ts
type ToggleReactionIntent = {
  confessionId: string;
  type: ReactionType;
  selected: boolean;
};
```

- **의미**: 표시 중인 서버 상태를 기준으로 사용자가 선택 또는 해제를
  요청한 의도.
- **결정 규칙**:
  - `selected: false`는 PUT으로 변환된다.
  - `selected: true`는 DELETE로 변환된다.

## InteractionStatus

```ts
type InteractionStatus = {
  isPending: boolean;
  isError: boolean;
};
```

- **의미**: 한 `ReactionButtons` 영역의 mutation 진행 및 실패 상태.
- **영향**:
  - `isPending`이면 모든 반응 버튼이 조작 불가능하다.
  - `isError`이면 안전한 한국어 오류 안내를 표시한다.
- **비저장 규칙**: 성공 전 선택 상태를 영속 storage에 별도로 저장하지
  않는다.

## Entity Relationship

- 하나의 confession은 여러 `ConfessionReaction` response 요소를 가진다.
- 정규화 함수는 response 요소를 하나의 `NormalizedReactionSet`으로
  변환한다.
- 사용자의 클릭은 표시된 하나의 `ConfessionReaction`에서
  `ToggleReactionIntent`를 만든다.
- 서버 재조회가 성공하기 전에는 기존 `NormalizedReactionSet`을
  대체하는 성공 상태를 확정하지 않는다.
