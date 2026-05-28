# `confession-reactions` Frontend Components

## Component Hierarchy

```text
ConfessionListPage / ConfessionDetailPage
  -> ConfessionCard / DetailPanel
    -> ReactionButtons
      -> reaction buttons for PRAY, COMFORT, TOGETHER
      -> mutation error alert
```

## `ReactionButtons`

### Props

```ts
type ReactionButtonsProps = {
  confessionId: string;
  reactions?: ConfessionReaction[];
};
```

### Derived Display State

- `reactions`는 순수 정규화 helper를 통해 세 항목 표시 집합으로
  변환한다.
- 각 항목은 label metadata, count, `selectedByMe`로 버튼을 만든다.
- `selectedByMe`는 `aria-pressed`와 선택 시각 상태에 반영한다.
- storage에서 별도의 selected state를 초기화하거나 유지하지 않는다.

### Interaction State

- 기존 mutation hook의 `isPending`은 해당 component 내 세 버튼
  전체의 disabled 상태를 제어한다.
- mutation hook의 `isError`는 사용자에게 안전한 오류 메시지를
  표시하는 조건이다.
- 안정적인 수동 및 자동 확인을 위해 버튼은 reaction type을 포함하는
  `data-testid`를 제공해야 한다.

### Click Flow

1. 사용자가 특정 reaction 버튼을 클릭한다.
2. component는 해당 정규화 항목의 `selectedByMe`와 type을 읽는다.
3. mutation hook에 `{ type, selected }`를 전달한다.
4. hook은 미선택이면 PUT, 선택이면 DELETE API method를 선택한다.
5. 요청 처리 중 모든 버튼이 disabled 된다.
6. 성공 시 query invalidation으로 서버 response를 다시 읽고 표시한다.
7. 실패 시 기존 display state를 유지하고 error alert를 노출한다.

## API Integration Points

<!-- markdownlint-disable MD013 -->

| UI Concern | Integration Owner | Endpoint or Contract |
| ---------- | ----------------- | -------------------- |
| 목록 표시 | `useConfessionsQuery` | `GET /api/confessions` response reactions |
| 상세 표시 | `useConfessionDetailQuery` | `GET /api/confessions/{id}` response reactions |
| 선택 | mutation hook 및 API client | `PUT /api/confessions/{id}/reactions/{type}` |
| 해제 | mutation hook 및 API client | `DELETE /api/confessions/{id}/reactions/{type}` |
| device 기준 상태 | shared HTTP client | 모든 요청의 `X-Device-Id` header |

<!-- markdownlint-enable MD013 -->

## List And Detail Behavior

- `ConfessionCard`와 `DetailPanel`은 response reaction 배열을
  `ReactionButtons`에 전달하는 composition 책임만 가진다.
- 목록 카드 반응 영역은 상세 navigation link 바깥에 유지되어 클릭
  충돌이 없어야 한다.
- 동일한 server response라면 목록과 상세는 같은 count 및
  selected 표시를 제공한다.

## Functional Coverage

| Story | Component Behavior |
| ----- | ------------------ |
| US-01 | 세 반응과 누락 기본값을 목록 및 상세에 표시 |
| US-02 | 서버 선택 상태에 따라 PUT 또는 DELETE 실행 |
| US-03 | refetch response의 `selectedByMe`로 선택 표시 복원 |
| US-04 | pending 잠금, 안전한 오류, 접근 가능한 상태와 selector 제공 |
