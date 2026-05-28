# 고해 반응 기능 Unit Dependency

## Dependency Matrix

<!-- markdownlint-disable MD013 -->

| Source | Target | Dependency Type | Contract or Purpose | Update Priority |
| ------ | ------ | --------------- | ------------------- | --------------- |
| `confession-reactions` unit | Backend GET response | External runtime | `selectedByMe`를 포함한 반응 조회 | Critical |
| `confession-reactions` unit | Backend PUT/DELETE API | External runtime | 선택 및 해제 mutation 처리 | Critical |
| `confession-reactions` unit | `apiRequest` / `getDeviceId` | Existing shared frontend | `X-Device-Id` 전달 | Verify |
| `ReactionButtons` | response model | Internal feature | 서버 상태 기반 렌더링 타입 | Critical |
| `ReactionButtons` | query mutation hook | Internal feature | 선택/해제 의도와 pending/error | Critical |
| list/detail composition | `ReactionButtons` | Internal feature | 두 화면의 공통 UI 노출 | Verify |

<!-- markdownlint-enable MD013 -->

## Update Sequence

1. response model에 서버 선택 상태 계약을 반영한다.
2. 공통 반응 UI가 response model을 사용해 선택과 기본값을
   해석하도록 보정한다.
3. mutation 및 invalidation 흐름이 서버 재조회 기준을 충족하는지
   확인하고 필요한 경우 좁게 수정한다.
4. 목록 및 상세 surface와 shared device header 연결을 검증한다.
5. NFR 및 build/test 품질 게이트를 수행한다.

## Coordination Points

- **Backend Contract**: `selectedByMe`가 없는 backend response에서는
  승인된 선택 복원 경험을 완료할 수 없다.
- **Header Contract**: 기존 `apiRequest()`가 목록, 상세, mutation에
  동일한 `X-Device-Id`를 제공해야 한다.
- **Cache Contract**: mutation 성공 후 refetch 결과가 선택 상태와
  count의 최종 표시를 결정해야 한다.
- **Scope Boundary**: backend security 정책 구현은 이 frontend unit의
  코드 변경 범위가 아니며, NFR 추적 및 검증 조건으로 남긴다.

## Risk Handling

- 서버 response 계약과 UI 모델이 어긋나면 잘못된 PUT 또는 DELETE가
  전송될 수 있으므로 model과 render 기준 보정이 최우선이다.
- 현재 localStorage 선택 기준은 서버 상태와 불일치할 수 있어
  implementation에서 최종 선택 근거로 유지하지 않는다.
- backend endpoint가 준비되지 않은 환경에서는 수동 UI 검증을 위한
  mock 또는 접근 가능한 integration 환경이 필요할 수 있다.
