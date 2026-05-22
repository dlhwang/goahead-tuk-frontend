# 단위 검증 지침

## 현재 자동화 범위

이 저장소에는 별도 unit test script가 정의되어 있지 않다. 이번 변경은 다음 정적
검증으로 컴파일과 lint 기준을 확인한다.

## 실행

### 1. TypeScript 및 production build

```bash
npm run build
```

### 2. ESLint

```bash
npm run lint
```

### 3. 결과 확인

- **Expected**: 두 명령이 exit code 0으로 끝난다.
- **Coverage**: unit test coverage runner는 현재 구성되어 있지 않다.
- **Reports**: terminal output을 기준으로 확인한다.

## 실패 대응

1. build 오류가 있으면 TypeScript error와 Vite path 조립 변경을 확인한다.
2. lint 오류가 있으면 변경 파일의 import와 formatting 규칙을 확인한다.
3. 수정 후 같은 명령을 다시 실행한다.
