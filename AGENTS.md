# AGENTS.md

## Project overview

AI-DLC (AI-Driven Development Life Cycle) is a methodology for guiding AI coding
agents through structured software development workflows. This repository contains
the core workflow rules, detailed phase-specific rules, and an evaluator framework.

The distributable product is the `aidlc-rules/` directory, which is zipped and
published via GitHub Releases.

## AI-DLC 기본 작업 방식 및 실행 모드

이 프론트엔드 프로젝트의 개발, 문서, 설정 변경에는 AI-DLC를 기본 개발
절차로 적용한다. `aidlc-rules/aws-aidlc-rules/core-workflow.md`의
Adaptive Workflow Principle에 따라 필요한 깊이와 단계는 작업마다 달라질
수 있다.

<!-- markdownlint-disable-next-line MD013 -->
> 코드 어시스트는 AI-DLC를 항상 적용하되, 모든 AI-DLC 단계를 항상 실행하지는 않는다. 작업 규모와 위험도에 따라 실행 모드를 선택하고, 실행하지 않는 단계는 명시적으로 skip 사유를 남긴다.

실행 모드는 다음 요소를 함께 평가하여 선택한다.

- 작업 규모와 변경 파일 또는 영역의 수
- UI/UX와 사용자 흐름에 미치는 영향
- API 계약, API client 또는 요청 헤더 변경 여부
- local state, server state cache, 전역 상태 또는 브라우저 저장소 영향
- page와 routing 구조 영향
- `env`, `build`, preview 또는 deploy 설정 영향
- 자동 및 수동 검증 필요성
- 기존 화면과 배포 동작의 회귀 위험도

### 작업 계획 기록 규칙

코드 어시스트는 변경을 시작하기 전에 작업 계획에 다음 내용을 기록한다.
선택한 단계가 `core-workflow.md`에서 별도의 승인이나 감사 기록을 요구하면,
해당 단계를 실제로 실행할 때 그 규칙도 그대로 따른다.

- `Requirement summary`: 해결할 요구사항의 짧은 요약
- `Task type`: 문서, UI, API client, state, routing, build 또는 deploy 등 작업 유형
- `Selected AI-DLC execution mode`: 선택한 실행 모드
- `Reason for selected mode`: 영향 범위와 위험도를 포함한 선택 이유
- `Required context files`: 먼저 확인할 코드, 문서, 설정 또는 산출물
- `Expected files to change`: 변경이 예상되는 파일
- `Files or directories that must not change`: 보호할 기존 산출물과 설정
- `Stages to execute`: 실행할 AI-DLC 단계와 깊이
- `Stages to skip`: 생략할 AI-DLC 단계와 각각의 skip 사유
- `Validation commands`: 실행할 명령 및 필요한 수동 확인
- `Risks or assumptions`: 확인되지 않은 계약, 환경 또는 회귀 위험

작업 중 영향 범위가 커지면 더 높은 모드로 전환하고, 작업 계획에 변경 이유와
추가 실행 단계 및 검증 계획을 갱신한다. `aidlc-docs/`에 이미 진행 중인
산출물이 있으면 이를 삭제하거나 정리 대상으로 다루지 않고, 해당 작업에서
필요한 phase 산출물을 갱신해야 하는 경우에만 기존 흐름을 이어서 기록한다.

### Fast Track

#### Fast Track 사용 조건

- 새 화면, routing, API 계약 또는 전역 상태 구조 변경이 없는 작고 명확한 변경
- 변경 원인과 기대 결과가 분명하며 회귀 범위가 단일 파일 또는 단일
  component 주변으로 제한되는 작업

#### Fast Track 대표 예시

- 문서 일부 수정, 오타 또는 문구 수정
- 스타일 일부 수정이나 단일 component 중심의 작은 UI 수정
- 단일 파일 중심의 작은 버그 수정
- 실패 원인이 분명한 CI, lint, typecheck 또는 build 보정
- `.env.example` 또는 환경변수 설명 보강
- API base URL, fetch wrapper 또는 header 설정 같은 명확한 설정 보정

#### Fast Track 기본 실행 단계

- Workspace 확인
- Requirements Analysis minimal
- Workflow Planning minimal
- Code Generation 또는 문서 수정
- 최소 검증
- 완료 보고

#### Fast Track 기본 생략 단계

- User Stories: 새 사용자 흐름이나 수용 기준을 도출할 필요가 없으면 skip
- Application Design: 새 component 경계나 구조 결정을 하지 않으면 skip
- Units Generation: 변경을 여러 작업 단위로 분해할 필요가 없으면 skip
- NFR Requirements 및 NFR Design: 성능, 보안 또는 운영 요구가 추가되지 않으면 skip
- Infrastructure Design: deploy 구조나 hosting 자원을 바꾸지 않으면 skip

#### Fast Track 조건부 실행 단계

- 공통 API 요청 동작, 브라우저 저장소 또는 사용자 오류 상태에 영향이
  발견되면 Functional Design 또는 NFR Requirements를 추가한다.
- 작은 변경으로 시작했더라도 routing, API 계약, 공유 state 또는 deploy
  영향이 생기면 `Standard Track` 이상으로 전환한다.

#### Fast Track 검증 기준

작업 성격에 맞는 최소 검증을 수행한다. 존재하는 script와 관련 있는 검증만
실행하며, 프로젝트에 없는 명령은 실행하지 않고 완료 보고에 생략 사유를
남긴다.

```bash
npm run lint
npm run typecheck
npm run build
npx markdownlint-cli2 "AGENTS.md"
```

### Standard Track

#### Standard Track 사용 조건

- 기존 화면 안에서 일반 기능을 추가하거나 수정하는 작업
- `page`, `component`, `hook`, `API client`, `type`, `test` 중 둘 이상의
  영역에 영향이 있는 작업
- 영향은 제한적이지만 기능 동작 또는 배포 설정의 검증이 필요한 작업

#### Standard Track 대표 예시

- 기존 API 응답 필드 사용 추가 또는 기존 API client 함수 추가
- 기존 화면에 loading, empty, error 또는 interaction state 추가
- 기존 component 분리, 재사용 구조 개선 또는 관련 테스트 보강
- Vercel 환경변수, build 설정 또는 preview 배포 문서처럼 범위가 제한된
  배포 설정 변경

#### Standard Track 기본 실행 단계

- Workspace 확인
- Requirements Analysis minimal 또는 standard
- Workflow Planning standard
- 필요한 경우 Functional Design
- Code Generation 또는 문서 및 설정 수정
- Build and Test
- 완료 보고

#### Standard Track 기본 생략 단계

- User Stories: 새 사용자 흐름이나 별도 acceptance criteria가 없으면 skip
- Application Design 및 Units Generation: 기존 경계 안의 단일 작업이면 skip
- NFR Requirements, NFR Design 및 Infrastructure Design: 성능, 보안,
  운영 또는 배포 아키텍처 영향이 없으면 skip

#### Standard Track 조건부 실행 단계

- UI 흐름 또는 component 책임의 설계 결정이 필요하면 Application Design
  또는 Functional Design을 실행한다.
- state/cache 정책, 인증·익명 식별, 성능 또는 deploy 위험이 있으면
  NFR Requirements, NFR Design 또는 Infrastructure Design을 실행한다.
- 여러 독립 작업 단위가 생기면 Units Generation을 실행하거나 더 높은
  track으로 전환한다.

#### Standard Track 검증 기준

가능한 script를 사용하여 기능 변경과 build 가능성을 확인한다. 테스트
script가 없으면 완료 보고에 그 사실과 생략 사유를 기록한다.

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

### Design Track

#### Design Track 사용 조건

- 구현 전에 UX, 화면 흐름 또는 프론트엔드 구조 결정을 합의해야 하는 작업
- 선택 가능한 구현 방식의 trade-off가 크거나 정책 경계가 불명확한 작업

#### Design Track 대표 예시

- 화면 흐름이나 routing 구조 결정
- API 계약 해석 또는 backend 연동 방식 결정
- optimistic update, rollback 또는 refetch 정책 결정
- `localStorage`, `sessionStorage`, 전역 상태 또는 server state cache
  사용 여부 결정
- 익명 식별자 저장 위치, 인증, rate limiting, `deviceId` 또는 API key
  정책 경계 결정

#### Design Track 기본 실행 단계

- Workspace 확인
- Requirements Analysis standard
- 필요한 질문 작성
- Workflow Planning
- Application Design 또는 Functional Design
- 설계 결정 기록
- 승인 후 Code Generation
- Build and Test
- 완료 보고

#### Design Track 기본 생략 단계

- Units Generation: 단일 설계 결정과 단일 구현 단위이면 skip
- NFR Requirements 및 NFR Design: 성능, 보안 또는 운영 품질 속성 결정이
  포함되지 않으면 skip
- Infrastructure Design: build 또는 deploy 구조 변경이 없으면 skip

#### Design Track 조건부 실행 단계

- 새 사용자 여정이나 검토 가능한 acceptance criteria가 필요하면 User Stories를 실행한다.
- 여러 page, feature 또는 공유 계층으로 분해해야 하면 Units Generation을 실행한다.
- 보안, 성능, 익명 식별 또는 deploy 정책에 영향이 있으면 NFR Requirements,
  NFR Design 또는 Infrastructure Design을 실행한다.

#### Design Track 검증 기준

설계 후 구현이 있다면 가능한 자동 검증을 수행하고, UI 영향이 큰 경우 관련
수동 확인 결과 또는 수행하지 못한 이유를 완료 보고에 남긴다.

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

수동 확인의 예시는 다음과 같다.

- 목록 화면과 상세 화면 렌더링 확인
- API 요청 성공 및 실패 상태 확인
- 새로고침 후 상태 유지 여부 확인
- 모바일 화면 레이아웃 깨짐 여부 확인

### Full Track

#### Full Track 사용 조건

- 여러 화면, 여러 state 또는 여러 API 계약이 함께 바뀌는 큰 변경
- 앱 구조, 사용자 정책, build 및 deploy에 걸친 높은 위험의 변경

#### Full Track 대표 예시

- 신규 주요 기능 전체 구현
- 프론트엔드와 backend 계약을 함께 바꾸는 작업
- routing, 상태 관리, API client 및 deploy 설정이 함께 바뀌는 작업
- 인증, 익명 식별, 보안, 운영 또는 배포 영향이 함께 있는 작업
- 여러 unit of work로 나누어야 하는 작업
- 디자인 시스템 또는 앱 구조 전반에 영향을 주는 작업

#### Full Track 기본 실행 단계

- `aidlc-rules/aws-aidlc-rules/core-workflow.md`의 전체 흐름을 따른다.
- 각 조건부 단계의 적용 여부와 깊이를 평가하고, 생략하는 단계가 있다면
  작업 계획과 AI-DLC 기록에 skip 사유를 명시한다.

#### Full Track 기본 생략 단계

- 없음. 다만 `core-workflow.md`에서 조건부로 지정한 단계가 해당 변경에
  가치를 더하지 않는다고 판단되면 그 근거를 기록하고 생략할 수 있다.

#### Full Track 조건부 실행 단계

- enabled extension, Operations 관련 요구 또는 프로젝트별 추가 검증은
  작업 범위와 현재 AI-DLC 설정에 따라 포함한다.

#### Full Track 검증 기준

프로젝트에 존재하는 전체 검증 script를 수행한다. E2E 또는 preview 검증
script가 있으면 변경 영향에 맞게 함께 수행하고, 없는 명령은 임의로 추가하지
않으며 생략 사유를 남긴다.

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm run test:e2e
npm run preview
```

## Repository structure

```text
aidlc-rules/
├── aws-aidlc-rules/              # Core workflow entry point (DO NOT rename)
│   └── core-workflow.md
└── aws-aidlc-rule-details/       # Detailed rules referenced by the workflow
                                  # (DO NOT rename)
    ├── common/                   # Shared guidance across all phases
    ├── inception/                # Planning and architecture rules
    ├── construction/             # Design and implementation rules
    ├── extensions/               # Optional cross-cutting constraint rules
    └── operations/               # Deployment and monitoring rules
scripts/aidlc-evaluator/          # Python evaluation framework (uv-managed)
docs/
├── ADMINISTRATIVE_GUIDE.md       # CI/CD, workflows, secrets, release process
├── DEVELOPERS_GUIDE.md           # Local builds (CodeBuild, act), security scanners
├── WORKING-WITH-AIDLC.md         # User guide for the AI-DLC methodology
├── GENERATED_DOCS_REFERENCE.md   # Full aidlc-docs/ directory reference
└── writing-inputs/               # Guides and examples for vision/tech-env documents
.github/
├── workflows/                    # CI/CD pipelines (8 workflows)
├── dependabot.yml                # Dependabot dependency update configuration
├── CODEOWNERS                    # Code ownership rules for PR reviews
├── ISSUE_TEMPLATE/               # Issue templates
├── pull_request_template.md      # PR template with contributor statement
└── labeler.yml                   # Auto-label rules (path → label mapping)
.claude/                          # Claude Code project settings
```

## Key documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) — contribution process and conventions
- [docs/ADMINISTRATIVE_GUIDE.md](docs/ADMINISTRATIVE_GUIDE.md) — CI/CD architecture,
  protected environments, secrets, permissions, and release process
- [docs/DEVELOPERS_GUIDE.md](docs/DEVELOPERS_GUIDE.md) — running CodeBuild locally,
  security scanner details and remediation instructions
- [docs/WORKING-WITH-AIDLC.md](docs/WORKING-WITH-AIDLC.md) — user guide for the
  AI-DLC methodology (context management, prompt patterns, phase walkthroughs)
- [docs/GENERATED_DOCS_REFERENCE.md](docs/GENERATED_DOCS_REFERENCE.md) — complete
  reference for the `aidlc-docs/` directory structure generated during workflows
- [docs/writing-inputs/](docs/writing-inputs/) — guides and examples for
  vision and technical environment documents

**Which docs to read by task type:**

- CI/CD, workflows, or releases → `ADMINISTRATIVE_GUIDE.md`, `DEVELOPERS_GUIDE.md`
- aidlc-rules content → `WORKING-WITH-AIDLC.md`, `GENERATED_DOCS_REFERENCE.md`
- Vision or technical environment documents → `docs/writing-inputs/`

## Setup commands

```bash
# Lint all markdown files
npx markdownlint-cli2 "**/*.md"

# Fix markdown lint issues automatically
npx markdownlint-cli2 --fix "**/*.md"

# Run evaluator tests (from scripts/aidlc-evaluator/)
cd scripts/aidlc-evaluator && uv run pytest
```

## Code style

- All content is Markdown — follow the `.markdownlint-cli2.yaml` configuration
- MD013 (line length) is disabled — long URLs, tables, and code examples are acceptable
- MD033 (inline HTML) is disabled — `<img>` tags are used for screenshots
- MD024 (duplicate headings) is disabled — section names repeat across
  platform guides
- MD036 (emphasis as heading) is disabled — bold text used as sub-labels in lists
- MD060 (table alignment) is enforced — table pipes must be vertically aligned
- MD040 (fenced code language) is enforced — always specify a language on code fences
- Commit messages follow [conventional commits](https://www.conventionalcommits.org/)
  (e.g., `feat:`, `fix:`, `docs:`, `chore:`)

## Testing instructions

- Test rule changes with at least one supported platform (Amazon Q Developer, Kiro,
  Cursor, Cline, Claude Code, or GitHub Copilot) before submitting
- If adding or updating installation instructions, test on macOS, Windows CMD, and
  Windows PowerShell
- Run `npx markdownlint-cli2 "**/*.md"` before committing to catch lint issues
- The pre-commit hook runs markdownlint automatically if configured

## PR instructions

- PR titles must follow conventional commits format (e.g., `fix: description`)
- Always include this contributor statement at the end of the PR body:

  > By submitting this pull request, I confirm that you can use, modify, copy,
  > and redistribute this contribution, under the terms of the
  > [project license](https://github.com/awslabs/aidlc-workflows/blob/main/LICENSE).

- CI enforces: conventional commit title, contributor statement, markdownlint, and
  a do-not-merge label check
- Use the structure from `.github/pull_request_template.md`

## Security scanners

Six scanners run on every push to `main`, every PR, and daily. All HIGH and CRITICAL
findings must be remediated or have documented risk acceptance before merge.

| Tool     | Detects         | Fails on                  | Config           |
| -------- | --------------- | ------------------------- | ---------------- |
| Bandit   | Python SAST     | High confidence findings  | `.bandit`        |
| Semgrep  | Multi-language  | Any finding (PRs: new)    | `.semgrepignore` |
| Grype    | Dependency CVEs | High/critical CVEs        | `.grype.yaml`    |
| Gitleaks | Secrets         | Any non-baselined secret  | See below        |
| Checkov  | IaC config      | Any check failure         | `.checkov.yaml`  |
| ClamAV   | Malware         | Any detection             | None             |

Gitleaks uses `.gitleaks.toml` and `.gitleaks-baseline.json`.

Inline suppression patterns:

- Bandit: `# nosec BXXX — justification`
- Semgrep: `# nosemgrep: rule-id — justification`
- Checkov: `# checkov:skip=CKV_ID:justification`

For full remediation and suppression details, see
[docs/DEVELOPERS_GUIDE.md](docs/DEVELOPERS_GUIDE.md#security-scanners).

## Important constraints

- The folder names `aws-aidlc-rules/` and `aws-aidlc-rule-details/` are part
  of the public contract — do not rename, move, or reorganize them
- Do not duplicate content across rules — place shared guidance in `common/` and
  reference it
- Keep the core methodology IDE/agent/model agnostic
- Security issues must be reported via
  [AWS vulnerability reporting](http://aws.amazon.com/security/vulnerability-reporting/),
  not public GitHub issues
- `CHANGELOG.md` is auto-generated by git-cliff — do not edit manually

## Agent-run snippets (added by Copilot)

Short guidance for agents: prefer the repository uv wrapper and npx-based
tools. Read docs/DEVELOPERS_GUIDE.md and docs/ADMINISTRATIVE_GUIDE.md before
running any commands.

Tests (uv):

```bash
uv run pytest
uv run pytest --cov --cov-report=term-missing
```

Markdown lint (npx):

```bash
npx markdownlint-cli2 "**/*.md"
npx markdownlint-cli2 --fix "**/*.md"
```

Dockerized security scans (recommended for local, cross-platform):

```bash
# Grype
docker run --rm -v "$PWD:/workspace" anchore/grype:latest \
  grype dir:/workspace -o sarif=grype.sarif
# Gitleaks
docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:latest \
  detect --source /repo --report-format sarif \
  --report-path gitleaks.sarif
# Semgrep
docker run --rm -v "$PWD:/src" returntocorp/semgrep \
  semgrep --config=r/all --sarif /src > semgrep.sarif
# Checkov
docker run --rm -v "$PWD:/src" bridgecrew/checkov \
  --directory /src --output-file-path checkov.sarif --output sarif
# Bandit
docker run --rm -v "$PWD:/src" python:3.12-slim \
  bash -c "pip install -q bandit && \
  bandit -r /src -f sarif -o /src/bandit.sarif"
# ClamAV
docker run --rm -v "$PWD:/data" mkodockx/docker-clamav clamscan -r /data --log=/data/clamdscan.txt
```

Notes:

- These commands write SARIF/text artifacts to the project root so CI/agents
  can consume them.
- CI already runs scanners; use these for local verification when Docker is available.
- If Docker is unavailable, use the platform-specific installs documented in docs/DEVELOPERS_GUIDE.md.
