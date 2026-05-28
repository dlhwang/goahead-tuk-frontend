# README 방법론 표기 Code Summary

## 변경 요약

`README.md` 소개 영역에 하네스엔지니어링과
SDD(Specification-Driven Development)를 함께 수행하고 있다는 문장을
추가했다.

## 변경 파일

- `README.md`

## 반영 문구

```markdown
개발 과정에서는 하네스엔지니어링(Harness Engineering)과
SDD(Specification-Driven Development)를 함께 수행하고 있습니다.
```

## 검증 결과

```bash
npx.cmd markdownlint-cli2 README.md
```

- 결과: 통과
- 오류: 0개

## 생략한 검증

- `npm run lint`: 애플리케이션 코드 변경이 없어 생략
- `npm run build`: build 산출물에 영향을 주지 않는 README 문서 변경이므로 생략
- `npm test`: 런타임 동작 변경이 없어 생략

## 확장 규칙 영향

- Security Baseline: README 문구 변경으로 보안 요구 또는 구현 표면이 바뀌지
  않아 N/A
- Property-Based Testing: 테스트 대상 로직 변경이 없어 N/A
