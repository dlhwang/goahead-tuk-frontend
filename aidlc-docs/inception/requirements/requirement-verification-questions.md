# 요구사항 확인 질문

<!-- markdownlint-disable MD053 -->

이번 변경은 프론트엔드의 API base URL 설정과 confession API 호출 경로를 정리하는 작업입니다.
아래 질문의 `[Answer]:` 뒤에 선택지 문자를 입력해 주세요.

## Question 1

기존 confession 작성 화면은 `content`와 `mood`를 함께 수집하고 있습니다.
Railway 백엔드의 작성 API 요청 body는 어떤 기준으로 맞출까요?

A) 새 요구사항대로 작성 요청에는 `{ "content": "..." }`만 보내고, `mood`는 요청 body에서 제외한다.

B) 기존 기능 호환을 위해 작성 요청에는 `content`와 `mood`를 계속 함께 보낸다.

X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2

이 변경에 Security Baseline 확장 규칙을 적용할까요?

A) Yes - 운영 배포 변경으로 보고 SECURITY 규칙을 blocking constraint로 적용한다.

B) No - 이번 변경은 프론트 설정과 thin API client 정리에 한정해 SECURITY 확장 규칙은 적용하지 않는다.

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3

이 변경에 Property-Based Testing 확장 규칙을 적용할까요?

A) Yes - PBT 규칙을 전부 적용한다.

B) Partial - 순수 함수나 직렬화 왕복 검증에 한해 PBT 규칙을 적용한다.

C) No - 이번 변경은 단순 API 설정과 호출 경로 정리이므로 PBT 확장 규칙은 적용하지 않는다.

X) Other (please describe after [Answer]: tag below)

[Answer]: C
