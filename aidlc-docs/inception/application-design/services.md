# 고해 반응 기능 Services

## 서비스 설계 원칙

- 별도 backend service 또는 신규 frontend global store를 도입하지 않는다.
- 기존 feature API client와 React Query orchestration을 이 기능의
  service 경계로 유지한다.
- UI는 서버 상태를 표시하고 사용자 의도를 mutation에 전달하되,
  HTTP endpoint 및 cache 갱신 책임은 맡지 않는다.

## Confession API Service

- **소유 모듈**: `src/features/confession/api/confessionApi.ts`
- **입력**: confession id, reaction type.
- **출력**: 조회 데이터 또는 성공한 mutation의 빈 결과.
- **상호작용**:
  - 공통 `apiRequest()`를 사용한다.
  - `apiRequest()`는 기존 device id를 `X-Device-Id`로 추가한다.
- **계약**:
  - response의 반응 element는 `type`, `count`, `selectedByMe`를 가진다.
  - PUT은 선택, DELETE는 해제를 의미한다.

## Query Synchronization Service

- **소유 모듈**: `src/features/confession/api/confessionQueries.ts`
- **입력**: 사용자가 클릭한 reaction type과 클릭 직전
  `selectedByMe` 값.
- **책임**:
  - 현재 selected 여부로 mutation method를 선택한다.
  - 성공한 변경 뒤 list/detail cache를 invalidation한다.
  - 다음 render가 서버 response 상태를 기준으로 이루어지게 한다.
- **설계 선택**: optimistic cache 갱신 계층은 이번 최소 설계에
  추가하지 않는다. 서버 재조회 경로가 일관성 기준이다.

## Reaction Presentation Service Boundary

- **소유 component**: `ReactionButtons`.
- **입력**: confession id와 server reaction 배열.
- **책임**:
  - reaction metadata를 표시 label로 변환한다.
  - 현재 type response가 없을 때 안전한 기본 표시를 제공한다.
  - 선택 의도를 query mutation service에 전달한다.
- **제외 책임**:
  - endpoint 문자열 구성.
  - device id 저장 또는 전달.
  - 서버 선택 상태를 대신하는 지속 local state 저장.

## Interaction Sequence

1. 목록 또는 상세 query가 `apiRequest()`를 통해 confession data를
   조회하며 device header가 함께 전송된다.
2. `ReactionButtons`는 response reactions를 바탕으로 세 버튼과
   선택 상태를 표시한다.
3. 사용자가 버튼을 누르면 UI는 표시 중인 `selectedByMe`와 type을
   mutation hook에 전달한다.
4. mutation hook은 미선택이면 PUT, 선택이면 DELETE service method를
   호출한다.
5. 성공 시 query cache가 invalidation되고, 서버 response가 갱신된
   count와 선택 상태의 새 표시 기준이 된다.
6. 실패 시 기존 서버 표시 상태를 유지하고 사용자 오류 UI를 노출한다.
