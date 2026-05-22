# 코드 품질 평가

## 테스트 커버리지

- **전체**: 탐지되지 않음.
- **Unit Test**: unit test 파일이나 runner 설정이 탐지되지 않음.
- **Integration Test**: integration 또는 browser automation test 설정이 탐지되지 않음.

## 코드 품질 지표

- **Linting**: 설정되어 있고 2026-05-22에 `npm.cmd run lint`가 성공했다.
- **Build 검증**: 2026-05-22에 `npm.cmd run build`가 성공했다.
- **코드 스타일**: 현재 범위에서는 feature, page, app, shared 디렉터리 경계가 일관적이다.
- **문서화**: README가 로컬 실행, API base URL, endpoint 목록, 폴더 책임을 설명한다.

## 기술 부채

- 자동화 테스트가 없어 route 흐름, form 제한, query invalidation, 오류 상태,
  device id 동작에 회귀 보호가 없다.
- runtime 응답 검증이 없고 API payload 가정은 compile time TypeScript에만 의존한다.
- `VITE_API_BASE_URL`이 없으면 공통 HTTP client가 module 평가 시점에
  throw한다. 로컬 설정 누락은 분명히 드러나지만 애플리케이션 시작이 환경
  설정에 강하게 결합된다.
- `clsx`가 선언되어 있지만 검사한 애플리케이션 module에서는 사용이 관찰되지 않았다.

## 패턴과 안티패턴

- **좋은 패턴**:
  - typed endpoint wrapper가 REST path를 page에서 분리한다.
  - TanStack Query가 서버 상태 전환과 생성 후 목록 invalidation을 담당한다.
  - 공통 `EmptyState`가 실패 UI 표현을 일관되게 유지한다.
  - device id 동작이 하나의 storage helper에 집중되어 있다.
- **안티패턴**:
  - UI가 소비하기 전 runtime API schema guard가 없다.
  - 현재 모바일 흐름을 보호하는 자동화 테스트가 없다.
