# 고해 반응 기능 Unit of Work

## Unit 정의

### `confession-reactions`

- **Unit 유형**: 기존 frontend application 내부의 feature unit.
- **소유 경계**: `src/features/confession/` 및 이를 소비하는 기존
  list/detail composition.
- **목표**: 익명 사용자가 목록과 상세 화면에서 세 반응의 count와
  본인의 선택 상태를 확인하고, 서버 기준으로 선택 또는 해제할 수 있게
  한다.

## 포함 책임

- `ConfessionReaction` response model이 `selectedByMe`를 수용하도록
  계약을 반영한다.
- `PRAY`, `COMFORT`, `TOGETHER` 세 type과 표시 metadata를 중앙
  정의에서 사용한다.
- 누락된 response reaction은 count `0`, selected `false`로
  표시되도록 한다.
- `ReactionButtons`가 localStorage 선택 기록이 아닌 서버 response를
  선택 상태의 단일 기준으로 사용하도록 한다.
- 버튼 클릭을 선택 PUT 또는 해제 DELETE mutation 의도로 전달한다.
- mutation 성공 후 기존 query invalidation/refetch를 통해 count와
  선택 상태를 서버 기준으로 갱신한다.
- pending 시 중복 조작 방지, 실패 오류 표시, 접근성 상태와 자동화
  selector를 후속 design 및 implementation에서 반영한다.

## 외부 Dependency

| Dependency | Unit이 기대하는 계약 | 소유 범위 |
| ---------- | -------------------- | --------- |
| Backend GET response | 각 반응에 `type`, `count`, `selectedByMe` 제공 | 외부 backend |
| Backend mutation API | reaction PUT/DELETE를 `204`로 처리 | 외부 backend |
| Backend device handling | `X-Device-Id` 기반 현재 device 상태 계산 | 외부 backend |
| Shared HTTP client | 모든 관련 요청에 기존 device id header 포함 | 기존 shared frontend |

## 제외 책임

- backend의 입력 검증, rate limiting, CORS, 로그 마스킹 구현.
- deploy, hosting 또는 operations 설정 변경.
- 새로운 전역 상태 계층 또는 별도 deploy unit 생성.
- 반응과 무관한 고해 작성 또는 routing 동작 변경.

## 후속 Construction 범위

- **Functional Design**: reaction lookup 기본값, toggle rule,
  refetch 기반 render rule을 상세화한다.
- **NFR Requirements/Design**: Security Full, PBT Partial,
  접근성, 오류 및 검증 기준을 unit에 적용한다.
- **Code Generation**: 기존 후보 구현을 승인된 서버 상태 계약에
  맞춰 보정한다.
- **Build and Test**: lint/build 및 목록·상세 interaction을 검증한다.
