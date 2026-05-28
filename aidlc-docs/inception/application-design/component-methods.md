# 고해 반응 기능 Component Methods

## Model Interfaces

```ts
const reactionTypes: readonly ['PRAY', 'COMFORT', 'TOGETHER'];

type ReactionType = (typeof reactionTypes)[number];

type ConfessionReaction = {
  type: ReactionType;
  count: number;
  selectedByMe: boolean;
};
```

- `reactionTypes`는 세 버튼 렌더링과 허용 type 집합의 단일 출처이다.
- `ConfessionReaction.selectedByMe`는 서버가 현재 device에 대해
  계산한 선택 상태이다.

## API Client Methods

```ts
function getConfessions(): Promise<Confession[]>;
function getConfession(confessionId: string): Promise<ConfessionDetail>;
function selectConfessionReaction(
  confessionId: string,
  type: ReactionType,
): Promise<void>;
function deselectConfessionReaction(
  confessionId: string,
  type: ReactionType,
): Promise<void>;
```

- 조회 method는 reactions와 `selectedByMe`를 포함한 response를
반환한다.
- 선택 및 해제 method는 endpoint method만 구분하며 header 구성은
공통 HTTP client에 맡긴다.

## Query Methods

```ts
function useConfessionsQuery(): UseQueryResult<Confession[]>;
function useConfessionDetailQuery(
  confessionId: string,
): UseQueryResult<ConfessionDetail>;
function useConfessionReactionMutation(
  confessionId: string,
): UseMutationResult<void, Error, ToggleReactionPayload>;

type ToggleReactionPayload = {
  type: ReactionType;
  selected: boolean;
};
```

- `selected`는 버튼 클릭 시 서버 response에서 해석된 현재 상태이다.
- `selected: false`이면 PUT, `selected: true`이면 DELETE를 실행한다.
- 성공하면 목록 query와 해당 상세 query를 invalidate한다.

## UI Component Interface

```ts
type ReactionButtonsProps = {
  confessionId: string;
  reactions?: ConfessionReaction[];
};

function ReactionButtons(props: ReactionButtonsProps): JSX.Element;
```

- 입력 `reactions` 배열이 특정 type을 누락할 수 있음을 허용한다.
- UI는 `reactionTypes`의 각 type에 해당하는 response element를 찾아
  count와 선택 상태를 해석한다.
- 해당 element가 없으면 count `0`, selected `false`를 표시한다.
- localStorage 기반 선택 조회 또는 기록 method는 UI 선택 기준
  interface에서 제거한다.

## Shared Client Interface

```ts
function getDeviceId(): string;
function apiRequest<T>(
  path: string,
  options?: RequestOptions,
): Promise<T>;
```

- `apiRequest()`는 `getDeviceId()` 결과를 `X-Device-Id` header에
  설정한다.
- 이 책임은 GET, PUT, DELETE 모두에 동일하게 적용된다.

## 후속 상세 설계 대상

- 반응 배열 누락 및 순서 변동을 해석하는 표현을 inline lookup으로
  유지할지 순수 helper로 분리할지는 `Functional Design`에서 확정한다.
- pending disabled 범위, selector naming, 오류 표시 세부 rule은
  NFR 및 code generation 단계에서 구체화한다.
