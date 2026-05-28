# README 방법론 표기 Code Generation 계획

## Requirement Summary

`README.md` 소개 영역에 현재 개발 과정에서 하네스엔지니어링과
SDD(Specification-Driven Development)를 함께 수행하고 있음을 명시한다.

## Task Type

- 문서 변경
- README 소개 문구 보강

## Selected AI-DLC Execution Mode

Fast Track

## Reason For Selected Mode

- 변경 범위가 `README.md`의 소개 문장에 한정된다.
- 새 화면, routing, API 계약, 전역 상태, 브라우저 저장소, build 또는 deploy
  설정 영향이 없다.
- 회귀 위험은 Markdown 문법과 문구 정확성에 한정된다.

## Required Context Files

- `README.md`
- `package.json`
- `AGENTS.md`

## Expected Files To Change

- `README.md`
- `aidlc-docs/construction/plans/readme-methodology-note-code-generation-plan.md`
- `aidlc-docs/construction/readme-methodology-note/code/code-summary.md`
- `aidlc-docs/audit.md`
- `aidlc-docs/aidlc-state.md`

## Files Or Directories That Must Not Change

- `src/`
- `aidlc-rules/`
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `vercel.json`

## Stages To Execute

- Workspace 확인: 기존 README와 AI-DLC 산출물 상태 확인
- Requirements Analysis minimal: 사용자가 요청한 README 문구 의도 확인
- Workflow Planning minimal: Fast Track 범위와 생략 단계 기록
- Code Generation: README 문구 수정
- Build and Test minimal: `README.md` Markdown lint 검증
- 완료 보고

## Stages To Skip

- User Stories: 새 사용자 흐름 또는 수용 기준이 필요한 기능 변경이 아니다.
- Application Design: component 경계나 구조 설계 결정이 없다.
- Units Generation: 단일 문서 변경으로 별도 작업 단위 분해가 필요 없다.
- Functional Design: 비즈니스 로직 변경이 없다.
- NFR Requirements: 성능, 보안, 운영 품질 속성 추가가 없다.
- NFR Design: NFR 패턴이나 논리 component 변경이 없다.
- Infrastructure Design: build 또는 deploy 구조 변경이 없다.
- Operations: 배포 및 운영 변경이 없다.

## Validation Commands

```bash
npx.cmd markdownlint-cli2 README.md
```

## Risks Or Assumptions

- SDD는 이 작업에서 `Specification-Driven Development`를 의미한다.
- "하네스엔지니어링" 표기는 사용자의 표현을 따른다.
- README 전체 문체는 기존 간결한 한국어 설명 흐름을 유지한다.

## Execution Checklist

- [x] README 현재 내용 확인
- [x] SDD 의미를 `Specification-Driven Development`로 정정
- [x] README 소개 영역에 방법론 수행 문구 추가
- [x] Markdown lint 실행
- [x] AI-DLC Fast Track 기록 작성
