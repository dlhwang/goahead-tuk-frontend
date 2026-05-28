# API 문서

## REST API

### 고해 목록 조회

- **Method**: GET
- **Path**: `/api/confessions`
- **목적**: 피드에 표시할 고해 요약 목록을 조회한다.
- **요청**: 명시적 body는 없고 공통 client가 `Content-Type`과 `X-Device-Id`를 추가한다.
- **응답**: 타입별 `reactions` 배열을 포함하는 `Confession[]`.

### 고해 상세 조회

- **Method**: GET
- **Path**: `/api/confessions/:confessionId`
- **목적**: 단일 고해와 선택적 comfort message를 조회한다.
- **요청**: path parameter `confessionId`; 공통 client가 표준 헤더를 추가한다.
- **응답**: 타입별 `reactions` 배열을 포함하는 `ConfessionDetail`.

### 고해 생성

- **Method**: POST
- **Path**: `/api/confessions`
- **목적**: 고해와 선택한 mood를 게시한다.
- **요청**: JSON `CreateConfessionPayload`.
- **응답**: 생성된 `ConfessionDetail`.

### 고해 반응 선택

- **Method**: PUT
- **Path**: `/api/confessions/:confessionId/reactions/:type`
- **목적**: 현재 device가 고해에 특정 반응을 남긴다.
- **요청**: `type`은 `PRAY`, `COMFORT`, `TOGETHER` 중 하나이고, 공통
  client가 `X-Device-Id` 헤더를 포함한다.
- **응답**: HTTP 204 No Content.

### 고해 반응 해제

- **Method**: DELETE
- **Path**: `/api/confessions/:confessionId/reactions/:type`
- **목적**: 현재 device가 남긴 특정 반응을 해제한다.
- **요청**: 반응 선택 요청과 동일한 path parameter 및 device 헤더를 사용한다.
- **응답**: HTTP 204 No Content.

## 내부 API

### `apiRequest<T>(path, options)`

- **Method**: generic async request function.
- **Parameter**: 상대 REST path와 선택적 object body를 가진 request option.
- **반환 type**: 파싱된 JSON `Promise<T>` 또는 HTTP 204에서 `undefined`.

### `useConfessionsQuery()`

- **Method**: TanStack Query hook.
- **Parameter**: 없음.
- **반환 type**: `Confession[]` query result.

### `useConfessionDetailQuery(confessionId)`

- **Method**: TanStack Query hook.
- **Parameter**: confession id string.
- **반환 type**: `ConfessionDetail` query result. id가 비어 있으면 query가 비활성화된다.

### `useCreateConfessionMutation()`

- **Method**: TanStack Query mutation hook.
- **Parameter**: mutation 호출 시점의 `CreateConfessionPayload`.
- **반환 type**: 생성된 상세 mutation result. 성공하면 목록 query를 invalidation한다.

### `useConfessionReactionMutation(confessionId)`

- **Method**: TanStack Query mutation hook.
- **Parameter**: `{ type: ReactionType; selected: boolean }`.
- **반환 type**: 선택 여부에 따라 PUT 또는 DELETE를 수행하는 mutation result.
  성공하면 목록과 해당 상세 query를 invalidation한다.

## 데이터 모델

### `Confession`

- **필드**: `id`, `content`, `mood`, `createdAt`, 선택적 `reactions`.
- **관계**: 상세 record와 목록 렌더링의 기본 model.
- **검증**: type 수준 mood union이 있고 create form이 제출 전 trim된 본문 길이를 4자 이상 280자 이하로 제한한다.

### `ConfessionReaction`

- **필드**: `type`, `count`.
- **관계**: `Confession.reactions` 배열 요소이며 버튼 표시 수치를 제공한다.
- **검증**: `ReactionType`은 `PRAY`, `COMFORT`, `TOGETHER` 상수 집합으로
  제한된다. UI는 배열에 없는 타입을 count `0`으로 표시한다.

### `ConfessionDetail`

- **필드**: 모든 `Confession` 필드와 선택적 `comfortMessage`.
- **관계**: 상세 endpoint와 create endpoint가 반환한다.
- **검증**: 프론트엔드에서 runtime schema validation은 탐지되지 않음.

### `CreateConfessionPayload`

- **필드**: `content`, `mood`.
- **관계**: create endpoint body.
- **검증**: form 수준 본문 제한과 UI 선택지로 제한되는 mood.
