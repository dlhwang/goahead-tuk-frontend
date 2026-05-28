# End-to-End Test Instructions

## UI Workflow

1. 고해 목록을 열고 각 카드에 세 반응 버튼과 count가 표시되는지 확인한다.
2. 상세 화면으로 이동해 같은 세 반응과 선택 상태가 표시되는지 확인한다.
3. 미선택 반응을 클릭해 pending 동안 세 버튼이 disabled 되는지 확인한다.
4. 성공 후 새 서버 응답의 count와 pressed 상태가 표시되는지 확인한다.
5. 선택된 반응을 다시 클릭해 해제되는지 확인한다.
6. 실패 응답에서 일반화된 안내와 재시도 가능 상태를 확인한다.

## Automation Status

- Component 수준 interaction은 Vitest/Testing Library test로 통과했다.
- Local browser에서는 application shell과 fetch 실패 복구 화면을
  확인했다.
- 실제 backend data와 mutation을 사용하는 E2E 흐름은 local origin의
  API 연결이 성립하지 않아 실행하지 못했다.

## Required Environment For Completion

- GET/PUT/DELETE reaction API가 사용 가능한 integration backend
- Frontend origin이 허용된 CORS configuration
- `selectedByMe` response 계약을 제공하는 test confession data

## MVP Demo Gate Relationship

실제 Railway backend에서 성공한 GET/PUT/DELETE reaction flow와
Vercel origin CORS 제한 확인은 MVP demo의 mandatory risk acceptance
gate다. 이 결과가 없으면 frontend 자동 테스트가 통과해도 demo
배포 준비 완료로 기록하지 않는다.
