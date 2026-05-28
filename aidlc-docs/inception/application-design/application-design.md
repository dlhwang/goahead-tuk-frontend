# 고해 반응 기능 Application Design

## 목적과 범위

이 설계는 이미 구현 후보가 존재하는 confession feature 안에서 반응
선택 표시와 갱신 흐름을 승인된 backend 계약에 맞춘다. 신규 서비스,
전역 상태 또는 routing 변경은 도입하지 않는다.

## 승인된 설계 결정

- 기존 `model -> API client -> query hooks -> UI composition` 경계를
  유지한다.
- `ReactionButtons`는 server response의
  `reactions[].selectedByMe`를 선택 표시의 단일 기준으로 사용한다.
- 반응 mutation 성공 후 기존 query invalidation과 refetch 흐름으로
  서버 count 및 선택 상태를 다시 표시한다.
- localStorage의 반응 선택 기록은 최종 상태 기준에서 제거한다.
- `apiRequest()`가 `getDeviceId()`를 사용해 모든 조회 및 mutation
  요청에 `X-Device-Id`를 제공하는 기존 경계는 유지한다.

## Component Summary

<!-- markdownlint-disable MD013 -->

| Component Boundary | Responsibility | 후속 변경 방향 |
| ------------------ | -------------- | -------------- |
| Response model | reaction type, count, `selectedByMe`, label metadata | 서버 선택 상태 필드 추가 |
| API client | 목록/상세 조회와 PUT/DELETE wrapper | 기존 경계 유지 |
| Query orchestration | mutation 선택과 성공 후 refetch | 기존 invalidation 확인 |
| `ReactionButtons` | 세 버튼, 선택 표시, pending/error 전달 | localStorage 의존 제거 |
| List/detail composition | 공통 버튼을 두 화면에 배치 | 기존 구성 유지 |
| Shared HTTP/device | 필수 header 전달 | verification-only |

<!-- markdownlint-enable MD013 -->

## 주요 Interface 계약

```ts
type ConfessionReaction = {
  type: ReactionType;
  count: number;
  selectedByMe: boolean;
};

type ToggleReactionPayload = {
  type: ReactionType;
  selected: boolean;
};
```

- UI는 누락된 반응 type을 count `0`, selected `false`로 표현해야 한다.
- UI가 mutation hook에 전달하는 `selected`는 서버 response를 바탕으로
  화면에 표시하던 현재 상태이다.
- pending, 오류 메시지, 접근 가능한 선택 상태 및 안정적인 selector는
  후속 설계와 구현에서 반영한다.

## 데이터 및 상호작용 흐름

1. 목록 또는 상세 화면이 query hook을 통해 서버 response를 받는다.
2. response model의 reactions가 공통 `ReactionButtons`에 전달된다.
3. 버튼은 세 reaction type을 항상 표시하고 response를 기준으로
   count와 선택 상태를 계산한다.
4. 사용자가 조작하면 query mutation은 현재 선택 상태에 따라
   PUT 또는 DELETE를 호출한다.
5. 성공하면 목록과 상세 data가 invalidation 및 refetch되어 서버
   상태가 새 render의 기준이 된다.
6. 실패하면 서버 기준으로 표시하던 기존 상태를 유지하고 이해 가능한
   오류 표시를 제공한다.

## 요구사항 추적

| Requirement | Design Coverage |
| ----------- | --------------- |
| FR-01, FR-02 | model metadata와 공통 `ReactionButtons`, list/detail composition |
| FR-03 | response model과 shared HTTP/device 경계 |
| FR-04 | API client 및 query mutation orchestration |
| FR-05 | `selectedByMe` 단일 기준과 invalidation/refetch |
| FR-06 | UI pending/error 책임, 후속 NFR 상세화 |
| NFR-01 | UI accessibility 책임, 후속 NFR 상세화 |
| NFR-02 | API/UI 분리와 중앙 reaction constant 유지 |
| NFR-03 | client 오류 노출 경계 및 backend 항목 추적 |
| NFR-04 | 서버 재조회 중심 동기화와 후속 검증 기준 |

## 설계 산출물 목록

- `components.md`: component 및 interface 책임.
- `component-methods.md`: method signature와 고수준 계약.
- `services.md`: API/query orchestration 설계.
- `component-dependency.md`: 의존 관계 및 데이터 흐름.

## 다음 단계 연결

- `Units Generation`에서는 이 component 경계를 단일 구현 unit에
  매핑한다.
- `Functional Design`에서는 누락 reaction 처리, toggle rule,
  invalidation 이후 render 규칙을 상세화한다.
- `NFR Requirements`와 `NFR Design`에서는 Security Full, PBT Partial,
  접근성, 오류 및 검증 패턴을 unit에 적용한다.
