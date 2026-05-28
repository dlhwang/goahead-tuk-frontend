# `confession-reactions` Tech Stack Decisions

## 기존 스택 유지

- UI와 data-fetching 구조는 기존 React, TypeScript, Vite 및 TanStack
  Query feature 경계를 유지한다.
- API 호출은 기존 confession API/query 계층에서 수행하며,
  `ReactionButtons`는 표시와 interaction state에 집중한다.
- 반응 type과 label의 공통 상수를 유지하고, response 방어 처리는
  feature model 계층의 순수 `normalizeConfessionReactions()` helper로
  제공한다.

## 테스트 도구 결정

<!-- markdownlint-disable MD013 -->

| Decision | Choice | Reason | Expected Change |
| -------- | ------ | ------ | --------------- |
| Test runner | `Vitest` | Vite/TypeScript 환경과 직접 맞고 순수 helper 및 component 단위 검증을 실행할 수 있다. | `package.json`, `package-lock.json`, test/config file |
| Property-based testing | `fast-check` | 누락 또는 순서가 달라지는 reaction 배열을 생성해 정규화 invariant를 검증할 수 있다. | `package.json`, `package-lock.json`, property test |
| Execution script | `npm test` 또는 동등한 Vitest script | Build and Test 단계에서 반복 가능한 검증 명령을 제공한다. | `package.json` |

<!-- markdownlint-enable MD013 -->

## 테스트 설계

Example-based test는 빈 `reactions`, 일부 type만 포함된 response,
이미 선택된 reaction을 다룬다. Property-based test는 다음 property를
검증한다.

- 결과는 항상 `PRAY`, `COMFORT`, `TOGETHER`를 각각 한 번씩 고정 순서로
  포함한다.
- 입력에 없는 type은 `{ count: 0, selectedByMe: false }`로 채워진다.
- 입력에 존재하는 유효 type의 `count`와 `selectedByMe`는 보존된다.
- generator는 유효 type의 부분집합과 순열, non-negative count,
  boolean `selectedByMe` 값을 생성한다.
- `fast-check`의 shrinking을 사용하며, 실패 출력의 seed와 path로
  동일 사례를 재실행할 수 있도록 검증 기록에 남긴다.

## 배포 보안 설정 결정

`vercel.json`은 현재 SPA rewrite만 정의하므로 HTML 응답에 보안 header를
추가한다. 적용 대상과 상세 값은 Code Generation에서 실제 API origin을
확인한 뒤 구성한다.

<!-- markdownlint-disable MD013 -->

| Header | Intended Protection | Implementation Constraint |
| ------ | ------------------- | ------------------------- |
| `Content-Security-Policy` | 허용하지 않은 script, frame 및 연결 방지 | `VITE_API_BASE_URL`의 실제 cross-origin API가 있다면 필요한 `connect-src`만 허용한다. |
| `Strict-Transport-Security` | HTTPS downgrade 방지 | production HTTPS 응답에 적용한다. |
| `X-Content-Type-Options: nosniff` | MIME sniffing 방지 | 모든 HTML 응답에 적용한다. |
| `X-Frame-Options: DENY` | clickjacking 방지 | 앱이 frame embedding을 필요로 하지 않는다는 전제다. |
| `Referrer-Policy` | referrer 정보 최소화 | API 호출 또는 navigation 요구를 깨지 않는 제한 값을 선택한다. |

<!-- markdownlint-enable MD013 -->

## 외부 의존 결정

- Backend 계약은 response reaction에 `selectedByMe: boolean`을 제공하고
  mutation에 필요한 `X-Device-Id`를 검증해야 한다.
- Rate limiting, restrictive CORS, device id log masking 및 API audit
  evidence는 이 저장소 밖의 완료 조건으로 관리한다.
- 외부 증빙이 없으면 frontend 코드와 테스트가 통과하더라도 보안 완료를
  선언하지 않는다.

## 검증 계획

- `npm run lint`
- `npm run build`
- 새로 추가할 Vitest script를 통한 example/property test 실행
- dependency 취약점 검증과 lock file 변경 확인
- 목록 및 상세 화면에서 세 반응 표시, 선택/해제, pending 잠금,
  실패 alert 및 refetch 결과 수동 확인
- 배포 또는 preview HTML response에서 security header 확인
