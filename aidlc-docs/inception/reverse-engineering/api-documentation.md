# API 문서

## REST API

### 고해 목록 조회

- **Method**: GET
- **Path**: `/confessions`
- **목적**: 피드에 표시할 고해 요약 목록을 조회한다.
- **요청**: 명시적 body는 없고 공통 client가 `Content-Type`과 `X-Device-Id`를 추가한다.
- **응답**: `Confession[]`.

### 고해 상세 조회

- **Method**: GET
- **Path**: `/confessions/:confessionId`
- **목적**: 단일 고해와 선택적 comfort message를 조회한다.
- **요청**: path parameter `confessionId`; 공통 client가 표준 헤더를 추가한다.
- **응답**: `ConfessionDetail`.

### 고해 생성

- **Method**: POST
- **Path**: `/confessions`
- **목적**: 고해와 선택한 mood를 게시한다.
- **요청**: JSON `CreateConfessionPayload`.
- **응답**: 생성된 `ConfessionDetail`.

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

## 데이터 모델

### `Confession`

- **필드**: `id`, `content`, `mood`, `createdAt`, `reactionCount`.
- **관계**: 상세 record와 목록 렌더링의 기본 model.
- **검증**: type 수준 mood union이 있고 create form이 제출 전 trim된 본문 길이를 4자 이상 280자 이하로 제한한다.

### `ConfessionDetail`

- **필드**: 모든 `Confession` 필드와 선택적 `comfortMessage`.
- **관계**: 상세 endpoint와 create endpoint가 반환한다.
- **검증**: 프론트엔드에서 runtime schema validation은 탐지되지 않음.

### `CreateConfessionPayload`

- **필드**: `content`, `mood`.
- **관계**: create endpoint body.
- **검증**: form 수준 본문 제한과 UI 선택지로 제한되는 mood.
