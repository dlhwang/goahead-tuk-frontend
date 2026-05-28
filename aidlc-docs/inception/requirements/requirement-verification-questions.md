# 고해 반응 기능 요구사항 확인 질문

## 분석 배경

- **요청 유형**: 사용자 대상 신규 기능
- **범위**: API 계층, query mutation, 브라우저 저장소, 목록 및 상세 UI의
  복수 컴포넌트 변경
- **복잡도**: 표준 깊이. API 계약은 명확하지만 현재 device의 선택 여부
  복원 방식과 반응 선택 정책은 확인이 필요하다.

아래 각 질문의 `[Answer]:` 뒤에 선택지 문자를 입력해 주세요. `X`를
선택하는 경우 같은 줄에 원하는 내용을 함께 작성해 주세요.

## Question 1

화면을 새로 열거나 다시 조회했을 때, 현재 device가 이미 선택한 반응을
어떤 데이터로 판별해야 할까요?

A) 조회 응답에 현재 device의 선택 여부가 제공될 예정이며, 프론트엔드는
그 값을 기준으로 선택 상태를 표시한다.

B) backend는 count만 제공하며, 프론트엔드가 이 브라우저에서 성공한
PUT/DELETE 기록을 `localStorage`에 유지해 선택 상태를 표시한다.

C) 선택 강조 표시는 요구하지 않고 count 갱신과 PUT/DELETE 전송만
보장한다.

X) Other (please describe after [Answer]: tag below)

<!-- markdownlint-disable MD013 MD053 MD012 -->
[Answer]: A - backend 조회 응답에 현재 device의 선택 상태를 포함하도록 계약을 확장한다. 프론트엔드는 목록/상세 조회 시 X-Device-Id를 전달하고, 응답의 selectedByMe 또는 myReactionType을 기준으로 선택 강조를 복원한다. localStorage는 낙관적 UI 보조 용도로만 사용할 수 있으며, 최종 기준은 서버 응답이다.


## Question 2

동일한 device가 하나의 고해에 남길 수 있는 반응의 조합 정책은 무엇인가요?

A) `PRAY`, `COMFORT`, `TOGETHER`를 각각 독립적으로 선택하거나 해제할 수
있으며, 여러 타입을 동시에 선택할 수 있다.

B) 고해당 하나의 반응만 선택할 수 있으며, 다른 타입을 누르면 이전
반응을 해제하고 새 반응으로 교체한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3

반응 버튼을 노출해야 하는 화면 범위는 무엇인가요?

A) 고해 목록 카드와 고해 상세 화면 모두에 동일한 세 버튼을 표시한다.

B) 고해 목록 카드에만 세 버튼을 표시한다.

C) 고해 상세 화면에만 세 버튼을 표시한다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4

이번 기능에서 Security Baseline extension 규칙을 blocking constraint로
적용할까요?

A) Yes - production 기능으로 취급하여 SECURITY 규칙을 적용한다.

B) No - 이번 범위에서는 SECURITY extension을 적용하지 않는다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A - production 사용자 기능으로 취급하여 SECURITY 규칙을 적용한다. 다만 MVP 범위에서는 X-Device-Id 형식 검증, 요청 크기 제한, rate limit 영향, 로그 마스킹, CORS/공개 API 남용 방지 중심으로 적용한다.

## Question 5

이번 기능에서 Property-Based Testing extension 규칙을 적용할까요?

A) Yes - 상태 전환과 데이터 처리에 PBT 규칙을 모두 적용한다.

B) Partial - 순수 함수 또는 직렬화 왕복 검증에만 PBT 규칙을 적용한다.

C) No - UI와 API 연결 중심의 얇은 변경으로 보고 PBT extension을
적용하지 않는다.

X) Other (please describe after [Answer]: tag below)

[Answer]: B
<!-- markdownlint-enable MD013 MD053 MD012 -->
