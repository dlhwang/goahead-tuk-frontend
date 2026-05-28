# `confession-reactions` Code Generation Summary

## 구현 범위

승인된 고해 반응 기능의 frontend unit을 구현했다. 목록과 상세에서
사용하는 기존 공통 반응 component는 backend response의
`selectedByMe`를 선택 상태 기준으로 사용하며, 누락 reaction type을
항상 표시 가능한 기본값으로 정규화한다.

## Brownfield 변경 파일

<!-- markdownlint-disable MD013 -->

| Change | File | Purpose |
| ------ | ---- | ------- |
| Modified | `src/features/confession/model/types.ts` | `selectedByMe` response contract 및 순수 `normalizeConfessionReactions()` 추가 |
| Modified | `src/features/confession/ui/ReactionButtons.tsx` | server-authoritative toggle, stable selector, pending/error/accessibility 표시 적용 |
| Deleted | `src/shared/storage/reactionSelections.ts` | 서버 상태와 충돌하는 local reaction selection authority 제거 |
| Modified | `package.json` / `package-lock.json` | Vitest, fast-check, Testing Library, jsdom 및 test script 반영 |
| Created | `vitest.config.ts` / `src/test/setup.ts` | test runner, alias, jsdom 및 assertion setup 구성 |
| Created | `src/features/confession/model/types.test.ts` | default 표시 및 normalization property test |
| Created | `src/features/confession/ui/ReactionButtons.test.tsx` | display, toggle intent, pending lock 및 alert component test |
| Modified | `vercel.json` | SPA rewrite 유지 및 HTML response security header/CSP 구성 |

<!-- markdownlint-enable MD013 -->

## 기존 경계 검증

- `src/features/confession/api/confessionApi.ts`의 reaction PUT/DELETE
  endpoint wrapper는 승인된 contract와 일치하여 변경하지 않았다.
- `src/features/confession/api/confessionQueries.ts`는 mutation 성공 후
  list/detail invalidation을 이미 수행하므로 server refetch 패턴을
  유지했다.
- `src/shared/api/httpClient.ts`는 기존 `getDeviceId()`를 이용해 모든
  요청에 `X-Device-Id`를 전송하므로 변경하지 않았다.

## Story Traceability

<!-- markdownlint-disable MD013 -->

| Story | Implemented Behavior | Evidence |
| ----- | -------------------- | -------- |
| US-01 | `PRAY`, `COMFORT`, `TOGETHER`를 고정 순서로 표시하고 누락 type은 `0`/미선택 처리 | normalizer 및 tests |
| US-02 | server selection state에 따라 기존 query/API 계층에 선택 또는 해제 intent 전달 | `ReactionButtons` 및 component test |
| US-03 | `selectedByMe`만 선택 표시 기준으로 사용하고 성공 후 기존 refetch 경로 유지 | model/UI 변경 및 existing query verification |
| US-04 | pending 중 세 버튼 잠금, safe alert, `aria-pressed`, stable `data-testid`, security header | component/config 변경 및 tests |

<!-- markdownlint-enable MD013 -->

## Security And Test Status

- `vercel.json`에는 CSP, HSTS, `X-Content-Type-Options`, frame deny 및
  referrer policy를 추가했다. CSP `connect-src`는 현재 확인한 HTTPS
  backend origin과 `'self'`만 허용한다.
- 설치 시 npm audit은 취약점 `0`건을 보고했다.
- `npm run lint`, `npm test`, `npm run build`, browser interaction 및
  실제 preview/deployed response header 검증은 Build and Test 단계에서
  실행한다.

## External Verification Remaining

다음 조건은 frontend 코드가 구현할 수 없으며, 증빙 없이 Security Full
완료로 보고하지 않는다.

- Backend 입력 및 `X-Device-Id` validation
- Public reaction mutation rate limiting 또는 동등 abuse protection
- Restrictive production CORS
- Device id log masking 및 필요한 mutation audit/observability
- Production TLS와 배포 환경의 실제 API origin/header 확인
