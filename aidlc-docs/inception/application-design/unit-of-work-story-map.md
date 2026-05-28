# 고해 반응 기능 Unit Story Map

## Unit Summary

| Unit | Assigned Stories | Coverage Status |
| ---- | ---------------- | --------------- |
| `confession-reactions` | US-01, US-02, US-03, US-04 | 모든 story 배정 완료 |

## Story Mapping

<!-- markdownlint-disable MD013 -->

| Story | 사용자 가치 | Unit 책임 | Construction 검증 초점 |
| ----- | ----------- | --------- | ---------------------- |
| US-01 | 세 반응과 count를 확인한다 | 세 type 표시, 누락 타입 기본값, list/detail 배치 | 모든 버튼 및 `0` 기본값 |
| US-02 | 반응을 선택하고 해제한다 | PUT/DELETE 의도 전달, 타입별 독립 선택 | 선택/해제 및 복수 선택 |
| US-03 | 선택 상태를 재방문 후에도 신뢰한다 | `selectedByMe` 기준 표시, refetch 동기화 | 서버 상태 복원 |
| US-04 | 안전하고 이해 가능한 경험을 갖는다 | pending, 오류, 접근성, selector | 중복 방지 및 오류 표시 |

<!-- markdownlint-enable MD013 -->

## Requirement Coverage

| Requirement | Assigned Unit Responsibility |
| ----------- | ---------------------------- |
| FR-01 | reaction constant 및 누락 타입 기본값 표시 |
| FR-02 | 목록 및 상세에서 공통 반응 component 사용 |
| FR-03 | response model과 device header 연결 확인 |
| FR-04 | PUT/DELETE toggle interaction |
| FR-05 | 서버 `selectedByMe` 및 refetch 기준 동기화 |
| FR-06 | pending/error interaction |
| NFR-01 | 접근 가능한 선택 및 오류 상태 |
| NFR-02 | API/UI 경계 및 중앙 constant 유지 |
| NFR-03 | 안전한 client 표시와 외부 backend 보안 조건 추적 |
| NFR-04 | 사례 검증과 Partial PBT 후보 불변식 |

## Unassigned Scope Check

- 모든 승인된 user story는 `confession-reactions` unit에 배정되었다.
- backend 구현, infrastructure 및 operations는 frontend unit
  implementation 대상이 아니며 외부 dependency 또는 생략 단계
  근거로 관리된다.
