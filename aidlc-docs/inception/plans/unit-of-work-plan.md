# 고해 반응 기능 Unit of Work 계획

## 목적

승인된 고해 반응 설계를 construction 단계에서 구현할 수 있는
unit으로 매핑한다. 이 저장소는 단일 frontend application이며, 현재
변경은 기존 confession feature 안의 response model과 interaction
동기화 보정에 집중한다.

## 입력 산출물

- `aidlc-docs/inception/requirements/requirements.md`
- `aidlc-docs/inception/user-stories/stories.md`
- `aidlc-docs/inception/application-design/application-design.md`
- `aidlc-docs/inception/application-design/component-dependency.md`

## 계획 체크리스트

- [x] Requirements, user stories, application design의 변경 범위를
  확인한다.
- [x] 현재 repository가 단일 frontend application임을 확인한다.
- [x] 모든 `[Answer]:` 응답을 읽고 모호성 또는 충돌 여부를 분석한다.
- [x] `unit-of-work.md`에 unit 책임과 경계를 작성한다.
- [x] `unit-of-work-dependency.md`에 dependency matrix와 실행 순서를
  작성한다.
- [x] `unit-of-work-story-map.md`에 모든 story를 unit에 매핑한다.
- [x] unit 경계와 외부 dependency 구분을 검증한다.
- [x] 생성된 Units Generation 산출물 검토 승인을 요청한다.

## 질문 범위 평가

<!-- markdownlint-disable MD013 -->

| Category | 적용 판단 | 질문 반영 방식 |
| -------- | --------- | -------------- |
| Story Grouping | 적용 | 하나의 반응 unit으로 모든 story를 묶을지 확인한다. |
| Dependencies | 적용 | backend 계약을 외부 dependency로 취급할지 확인한다. |
| Team Alignment | 제한 적용 | 단일 repository 내 단일 unit 소유권을 확인한다. |
| Technical Considerations | 적용 | 별도 배포 단위 또는 store 추가가 없는지 확인한다. |
| Business Domain | 적용 | 고해 반응 capability를 단일 domain unit으로 정의할지 확인한다. |
| Code Organization | N/A | Brownfield 단일 application이므로 신규 directory 전략을 선택하지 않는다. |

<!-- markdownlint-enable MD013 -->

## 제안 Unit 경계

### `confession-reactions` Unit

- **포함 story**: US-01, US-02, US-03, US-04.
- **포함 frontend 책임**:
  - response model의 `selectedByMe` 수용.
  - 세 반응의 표시와 누락 타입 기본값 처리.
  - 선택 및 해제 mutation 의도 전달.
  - 성공 후 refetch 기반 서버 상태 복원.
  - pending, 오류, 접근성 및 selector 보강.
- **외부 dependency**:
  - backend 조회 response의 `selectedByMe` 제공.
  - PUT/DELETE reaction endpoint.
  - `X-Device-Id`를 수용하는 backend contract.
- **비포함 범위**: backend 구현, deploy 구성, 신규 global store,
  새로운 routing.

## 질문

<!-- markdownlint-disable MD053 -->

### Question 1

Story grouping과 business domain 경계는 어떻게 정할까요?

A) 모든 반응 story를 기존 confession feature 안의 단일
`confession-reactions` unit으로 묶는다. (권장)

B) 표시, mutation, 상태 복원을 별도 frontend unit으로 분리한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2

Dependency 및 technical boundary는 어떻게 기록할까요?

A) backend의 `selectedByMe`, reaction mutation endpoint,
`X-Device-Id` 계약은 이 frontend unit이 소비하는 외부 dependency로
기록하고, 신규 store나 별도 배포 unit은 만들지 않는다. (권장)

B) backend 계약 또는 공통 상태 관리를 별도의 unit으로 분해한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3

Team alignment 관점의 소유권은 어떻게 기록할까요?

A) 이 저장소에서는 기존 confession feature가 해당 단일 unit의
소유 경계이며, backend 보안 정책 구현은 외부 연계 조건으로 남긴다.
(권장)

B) frontend 내 별도 reaction 소유 경계를 새로 정의한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4

위 답변에 따라 Unit of Work 계획을 승인하고 산출물 생성을 진행할까요?

A) 답변한 방식으로 계획을 승인하고 unit 산출물 생성을 진행한다.

B) 계획 변경을 요청하고 Units Generation 계획 단계에 머문다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

<!-- markdownlint-enable MD053 -->

## 생성 원칙

- 모든 user story는 누락 없이 하나 이상의 unit에 배정한다.
- frontend unit이 소유하지 않는 backend 및 deploy 책임은 외부
  dependency 또는 후속 검증 조건으로 구분한다.
- unit은 후속 Functional Design, NFR Requirements, NFR Design,
  Code Generation의 동일 작업 단위 이름으로 사용한다.
- 답변에 모호성 또는 충돌이 있으면 clarification 질문을 추가하고
  산출물 생성을 보류한다.

## 응답 분석 결과

- **Question 1**: `A`를 선택하여 US-01부터 US-04까지 모두
  `confession-reactions` 단일 unit에 배정한다.
- **Question 2**: `A`를 선택하여 backend response, mutation endpoint,
  `X-Device-Id` 계약을 외부 dependency로 기록하고 신규 store 또는
  별도 배포 unit을 만들지 않는다.
- **Question 3**: `A`를 선택하여 기존 confession feature가 frontend
  unit 소유 경계이고 backend 보안 구현은 외부 연계 조건임을 기록한다.
- **Question 4**: `A`를 선택하여 위 경계의 unit 산출물 생성을
  승인했다.
- **모호성 또는 충돌**: 없음. 단일 unit 산출물 생성을 진행한다.
