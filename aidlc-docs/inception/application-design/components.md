# 고해 반응 기능 Components

## 설계 결정

- 기존 confession feature 경계를 유지한다.
- 새 전역 상태 또는 별도 reaction service는 도입하지 않는다.
- 서버 조회 응답의 `reactions[].selectedByMe`를 선택 표시의 단일
  기준으로 사용한다.

## Component Definitions

### Confession Response Model

- **위치**: `src/features/confession/model/types.ts`
- **목적**: 고해 응답과 반응 표시를 위한 정적 계약을 제공한다.
- **책임**:
  - `ReactionType`의 세 허용 타입을 단일 constant에서 정의한다.
  - label 및 emoji metadata를 중앙 관리한다.
  - `ConfessionReaction`에 count와 서버 선택 상태를 표현한다.
- **Interface**:

```ts
type ReactionType = 'PRAY' | 'COMFORT' | 'TOGETHER';

type ConfessionReaction = {
  type: ReactionType;
  count: number;
  selectedByMe: boolean;
};
```

### Confession API Client

- **위치**: `src/features/confession/api/confessionApi.ts`
- **목적**: UI에서 HTTP 세부 사항을 분리해 confession API 호출을
  제공한다.
- **책임**:
  - 목록 및 상세 조회 response를 typed data로 반환한다.
  - 반응 선택 PUT과 해제 DELETE endpoint를 캡슐화한다.
  - 공통 client가 device header를 추가하도록 위임한다.

### Confession Query Orchestration

- **위치**: `src/features/confession/api/confessionQueries.ts`
- **목적**: 서버 데이터 조회와 mutation 이후 일관성 회복을
  조정한다.
- **책임**:
  - 목록 및 상세 query key를 관리한다.
  - 선택 상태에 따라 PUT 또는 DELETE 호출을 선택한다.
  - 성공 시 목록과 해당 상세 query를 invalidation해 서버 기준
    `selectedByMe`와 count를 다시 읽는다.

### ReactionButtons

- **위치**: `src/features/confession/ui/ReactionButtons.tsx`
- **목적**: 고해 하나에 대한 세 반응을 일관된 인터랙션으로 제공한다.
- **책임**:
  - 항상 세 reaction type을 순회하여 버튼을 표시한다.
  - 누락 타입은 count `0`, `selectedByMe: false`로 해석한다.
  - 전달받은 서버 반응 상태에서 현재 선택 여부를 결정한다.
  - pending 상태에서 중복 조작을 방지하고 실패 메시지를 노출한다.
  - 접근성 상태와 안정적인 자동화 selector를 제공한다.
- **제외 책임**: 선택 상태를 localStorage에서 최종 복원하지 않는다.

### List And Detail Composition

- **위치**:
  - `src/features/confession/ui/ConfessionCard.tsx`
  - `src/features/confession/ui/DetailPanel.tsx`
- **목적**: 같은 공통 반응 UI를 목록과 상세 surface에 배치한다.
- **책임**:
  - 해당 confession id와 reactions를 `ReactionButtons`에 전달한다.
  - 목록 카드에서는 반응 버튼이 상세 navigation 링크 바깥에서
    조작되도록 유지한다.

### Shared HTTP And Device Identity

- **위치**:
  - `src/shared/api/httpClient.ts`
  - `src/shared/storage/deviceId.ts`
- **목적**: 기존 익명 device 식별자를 API 요청에 일관되게 전달한다.
- **책임**:
  - `getDeviceId()`가 브라우저 device id를 생성 또는 재사용한다.
  - `apiRequest()`가 조회와 mutation 모두에 `X-Device-Id`를
    포함한다.
- **변경 판단**: 현재 후보 구현에서 책임이 이미 충족되므로 설계상
  verification-only 대상이다.

## 책임 경계 요약

| Concern | Owner | 설계 결과 |
| ------- | ----- | --------- |
| 반응 타입과 label | Response model | 중앙 constant 유지 |
| 서버 API 호출 | API client | UI 직접 호출 금지 |
| mutation 후 동기화 | Query orchestration | 서버 재조회 사용 |
| 선택 및 count 표시 | `ReactionButtons` | 서버 response 기준 |
| 화면 배치 | List/detail composition | 공통 component 재사용 |
| device header | Shared HTTP/device identity | 기존 방식 재사용 |
