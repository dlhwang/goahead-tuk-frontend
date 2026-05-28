# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests

```bash
npm test
```

### 2. Review Test Results

- **Expected**: 2 test files, 6 tests pass, 0 failures
- **Test Coverage**: coverage threshold는 이번 unit에서 정의하지 않았다.
- **Test Report Location**: console output
- **Observed Result (2026-05-27)**: 2 files passed, 6 tests passed

## Covered Behaviors

- `normalizeConfessionReactions()`의 누락 type 기본값
- Property-based invariant: 고정 type 순서, 누락 기본값, response 값 보존
- 버튼 count와 `aria-pressed` 표시
- 서버 선택 상태에 따른 select/deselect mutation intent
- mutation pending 중 전체 버튼 disabled
- 오류 발생 시 접근 가능한 retry 안내 alert

## Corrective Action During Validation

최초 test run은 component render가 test case 사이에서 정리되지 않아
중복 selector로 실패했다. `src/test/setup.ts`에 `afterEach(cleanup)`을
추가해 test 격리를 보장한 뒤 전체 test가 통과했다.
