# `confession-reactions` Business Logic Model

## 기능 목표

고해 하나의 반응 정보를 세 고정 타입의 표시 상태로 변환하고,
현재 서버 선택 상태에 따라 선택 또는 해제 요청을 실행한 뒤 서버
재조회 결과를 화면의 최종 상태로 사용한다.

## 입력과 출력

### 입력

- `confessionId`: 반응 대상 고해 식별자.
- `reactions?: ConfessionReaction[]`: backend 조회 response의 반응 배열.
- `type: ReactionType`: 사용자가 누른 반응 타입.
- `isPending`: 현재 고해의 반응 mutation 처리 중 여부.

### 출력

- 항상 세 타입으로 구성된 표시 가능한 반응 배열.
- 각 버튼의 count 및 `selectedByMe` 상태.
- 클릭 시 선택 PUT 또는 해제 DELETE 의도.
- mutation 실패 시 사용자 오류 표시 여부.

## 정규화 흐름

### 규칙

- 기준 타입 순서는 `PRAY`, `COMFORT`, `TOGETHER`이다.
- response 배열의 순서나 누락 여부와 관계없이 결과는 기준 타입
  순서로 세 항목을 반환한다.
- response에 타입이 존재하면 서버의 count와 `selectedByMe`를
  그대로 보존한다.
- response에 타입이 없으면 count `0`, `selectedByMe: false`를
  갖는 표시 항목을 만든다.

### 기능 계약

```ts
function normalizeConfessionReactions(
  reactions?: ConfessionReaction[],
): ConfessionReaction[];
```

### 변환 예시

```json
{
  "input": [
    { "type": "TOGETHER", "count": 2, "selectedByMe": true },
    { "type": "PRAY", "count": 4, "selectedByMe": false }
  ],
  "output": [
    { "type": "PRAY", "count": 4, "selectedByMe": false },
    { "type": "COMFORT", "count": 0, "selectedByMe": false },
    { "type": "TOGETHER", "count": 2, "selectedByMe": true }
  ]
}
```

## Toggle 흐름

1. UI는 정규화된 항목 중 사용자가 클릭한 type의
   `selectedByMe`를 읽는다.
2. `selectedByMe`가 `false`이면 선택 의도로 PUT을 요청한다.
3. `selectedByMe`가 `true`이면 해제 의도로 DELETE를 요청한다.
4. 요청 처리 중에는 해당 고해의 세 버튼 모두 조작할 수 없다.
5. 성공 시 목록과 상세 query를 invalidation하고 서버 response를
   다시 읽는다.
6. 새 response가 다음 표시 상태와 count의 유일한 기준이 된다.

## 실패 흐름

- optimistic 표시 또는 localStorage 기반 임시 선택 변경을 수행하지
  않는다.
- mutation이 실패하면 마지막 서버 조회 결과에서 렌더링된 count와
  선택 상태가 유지된다.
- 사용자는 실패를 이해할 수 있는 한국어 메시지를 확인한다.

## 외부 조건

- backend는 `selectedByMe`를 현재 `X-Device-Id` 기준으로 제공해야 한다.
- 공통 HTTP client는 조회 및 mutation 모두에 동일 device id를
  전달해야 한다.
