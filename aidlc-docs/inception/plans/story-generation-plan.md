# 고해 반응 기능 User Stories 생성 계획

## 목적

승인된 고해 반응 요구사항을 익명 사용자의 읽기 및 반응 흐름 중심으로
정리하고, 구현과 테스트에 사용할 수 있는 persona와 acceptance criteria를
작성한다.

## 입력 산출물

- `aidlc-docs/inception/requirements/requirements.md`
- `aidlc-docs/inception/plans/user-stories-assessment.md`
- `aidlc-docs/inception/reverse-engineering/business-overview.md`

## 생성 대상

- `aidlc-docs/inception/user-stories/personas.md`
- `aidlc-docs/inception/user-stories/stories.md`

## 계획 체크리스트

- [x] Requirements 승인 결과와 User Stories 실행 필요성을 확인한다.
- [x] story 생성 접근 방식과 확인 질문을 계획 문서에 작성한다.
- [x] 모든 `[Answer]:` 응답을 확인하고 모호성 또는 충돌 여부를 분석한다.
- [x] 승인된 접근 방식에 맞춰 persona를 작성한다.
- [x] 승인된 접근 방식에 맞춰 INVEST 기준의 user story를 작성한다.
- [x] 각 story에 acceptance criteria와 관련 persona를 연결한다.
- [x] 목록, 상세, 상태 복원, 오류 처리 시나리오가 요구사항을
  빠짐없이 다루는지 확인한다.
- [x] Security Baseline 및 Partial PBT 요구와 충돌하는 수용 기준이
  없는지 확인한다.
- [x] 생성 산출물 검토와 승인을 요청한다.

## Story Breakdown 선택지

### A) 사용자 여정 기반 분리

익명 사용자가 고해를 읽고, 반응을 확인하고, 선택하거나 해제하고,
실패 또는 재조회 결과를 경험하는 순서로 이야기를 구성한다. 목록과
상세의 일관성을 같은 여정 안에서 검증하기 좋다.

### B) 기능 기반 분리

반응 표시, mutation, 상태 동기화, 오류 처리를 기능 단위 story로
구성한다. 개발 작업과의 대응은 쉽지만 사용자가 얻는 가치 흐름은
분산될 수 있다.

### C) Hybrid 접근

핵심 행동은 사용자 여정 기반으로 구성하고, 오류 복구 및 접근성처럼
모든 접점에 걸친 품질 기준은 별도 story로 구성한다. 이 기능은
간결한 사용자 가치와 횡단 검증 요구를 모두 갖고 있어 권장한다.

## 질문

<!-- markdownlint-disable MD053 -->

### Question 1

스토리는 어떤 방식으로 구성할까요?

A) Hybrid 접근을 사용한다. 핵심 반응 여정과 공통 품질 경험을
구분해 작성한다. (권장)

B) 사용자 여정 기반으로만 작성한다.

C) 기능 기반으로 작성한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2

persona는 어떤 범위로 표현할까요?

A) 고해를 읽고 반응하는 익명 사용자를 핵심 persona로 두고, 본인의
고해에 받은 반응을 확인하는 작성자 관점을 보조 persona로 포함한다.
(권장)

B) 반응을 남기는 익명 사용자 한 persona만 작성한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3

위 답변에 따라 이 User Stories 생성 계획을 실행하도록 승인할까요?

A) 답변한 방식으로 계획을 승인하고 persona 및 story 생성을 진행한다.

B) 계획 변경을 요청하고 User Stories 계획 단계에 머문다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

<!-- markdownlint-enable MD053 -->

## 생성 원칙

- 각 story는 사용자 가치가 드러나는 형식으로 작성한다.
- 각 story는 Independent, Negotiable, Valuable, Estimable, Small,
  Testable 기준을 점검한다.
- 각 story는 관련 persona와 명시적 acceptance criteria를 포함한다.
- acceptance criteria에는 서버 기준 `selectedByMe`, 누락 타입 기본값,
  복수 선택, 처리 중 조작 방지, 이해 가능한 실패 표시를 요구사항에
  맞게 반영한다.
- 구현 설계나 작업 일정은 이 단계의 story에 포함하지 않는다.

## 승인 이후 실행 범위

모든 답변이 명확하고 계획 승인이 확인된 경우에만 `personas.md`와
`stories.md`를 생성한다. 답변 간 충돌이나 불명확한 조건이 있으면
별도 clarification 문서를 작성하고 생성 작업을 보류한다.

## 응답 분석 결과

- **Question 1**: `A`를 선택하여 핵심 행동 여정과 공통 품질 경험을
  구분하는 Hybrid 접근을 적용한다.
- **Question 2**: `A`를 선택하여 반응을 남기는 익명 사용자를 핵심
  persona로, 받은 반응을 확인하는 작성자를 보조 persona로 포함한다.
- **Question 3**: `A`를 선택하여 위 방식으로 산출물 생성을 승인했다.
- **모호성 또는 충돌**: 없음. 추가 clarification 없이 생성을 진행한다.
