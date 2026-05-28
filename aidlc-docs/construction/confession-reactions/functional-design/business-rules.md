# `confession-reactions` Business Rules

## 표시 규칙

<!-- markdownlint-disable MD013 -->

| Rule | 내용 | Requirement |
| ---- | ---- | ----------- |
| BR-01 | UI는 `PRAY`, `COMFORT`, `TOGETHER` 세 반응을 항상 표시한다. | FR-01 |
| BR-02 | 누락된 reaction type은 count `0`, `selectedByMe: false`로 표시한다. | FR-01 |
| BR-03 | 서버가 반환한 count와 `selectedByMe`는 존재하는 타입에 대해 변경 없이 표시 규칙에 전달한다. | FR-03, FR-05 |
| BR-04 | 목록과 상세는 동일한 반응 표시 규칙과 공통 button component를 사용한다. | FR-02 |

<!-- markdownlint-enable MD013 -->

## 조작 규칙

<!-- markdownlint-disable MD013 -->

| Rule | 내용 | Requirement |
| ---- | ---- | ----------- |
| BR-05 | `selectedByMe: false`인 type 클릭은 PUT 선택 요청이다. | FR-04 |
| BR-06 | `selectedByMe: true`인 type 클릭은 DELETE 해제 요청이다. | FR-04 |
| BR-07 | 한 type의 선택 또는 해제는 다른 type의 상태를 자동으로 변경하지 않는다. | FR-04 |
| BR-08 | 하나의 고해에 대한 mutation 처리 중에는 같은 반응 영역의 세 버튼 모두를 비활성화한다. | FR-06 |

<!-- markdownlint-enable MD013 -->

## 동기화 및 실패 규칙

<!-- markdownlint-disable MD013 -->

| Rule | 내용 | Requirement |
| ---- | ---- | ----------- |
| BR-09 | mutation 성공 후 서버 data를 재조회하여 표시 상태를 갱신한다. | FR-05 |
| BR-10 | 선택 표시의 최종 기준은 `selectedByMe`이며 localStorage 선택 기록은 기준이 아니다. | FR-05 |
| BR-11 | mutation 실패 시 이전 서버 표시 상태를 유지하며 optimistic success 상태를 표시하지 않는다. | FR-06 |
| BR-12 | mutation 실패 메시지는 내부 오류 또는 device identifier를 드러내지 않는 한국어 안내여야 한다. | FR-06, NFR-03 |

<!-- markdownlint-enable MD013 -->

## 입력 및 통합 규칙

<!-- markdownlint-disable MD013 -->

| Rule | 내용 | Requirement |
| ---- | ---- | ----------- |
| BR-13 | reaction type은 중앙 constant의 세 값만 사용한다. | FR-01, NFR-02 |
| BR-14 | 모든 관련 조회와 mutation 요청은 기존 device id의 `X-Device-Id`를 포함해야 한다. | FR-03, FR-04 |
| BR-15 | API endpoint 호출 로직은 UI component가 아니라 API/query 계층에 위치한다. | NFR-02 |

<!-- markdownlint-enable MD013 -->

## 검증 가능한 시나리오

- 반응 배열이 비어 있거나 한 타입만 있어도 결과 버튼은 항상 세 개이다.
- `COMFORT`와 `PRAY`가 선택된 response는 두 버튼을 각각 선택 상태로
  표시하며 다른 타입을 변경하지 않는다.
- 선택 상태가 `true`인 버튼 클릭은 DELETE 요청으로 해석된다.
- mutation pending 중에는 동일 영역의 다른 타입 클릭도 실행되지 않는다.
- mutation 실패 후 count와 선택 표시가 이전 서버 response와 동일하다.
