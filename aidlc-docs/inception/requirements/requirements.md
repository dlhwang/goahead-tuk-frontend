# 고해 반응 기능 요구사항

## 의도 분석

- **사용자 요청**: 고해 목록 및 상세 화면에 세 가지 반응을 표시하고,
  익명 device 단위로 선택 및 해제를 지원한다.
- **요청 유형**: 사용자 대상 신규 기능.
- **범위 추정**: API model과 client, query mutation, 공통 UI component,
  목록 및 상세 화면, 브라우저 device 식별 연동에 걸친 복수 컴포넌트 변경.
- **복잡도**: 표준. UI 동작은 한정적이지만 선택 상태의 서버 계약,
  익명 식별자 기반 변경 요청, 보안 및 테스트 요구가 포함된다.

## 확정된 결정

- 한 device는 하나의 고해에 대해 `PRAY`, `COMFORT`, `TOGETHER`를
  독립적으로 여러 개 선택할 수 있다.
- 목록 카드와 상세 화면은 동일한 세 반응 버튼을 제공한다.
- 반응 count와 현재 device 선택 상태의 최종 기준은 backend 조회
  응답이다.
- 각 `reactions` 요소는 `selectedByMe: boolean`을 포함한다.
- Security Baseline extension은 전체 적용한다.
- Property-Based Testing extension은 `Partial` 모드로 적용한다.

## 기능 요구사항

### FR-01 반응 타입 표시

- 프론트엔드는 항상 다음 반응 버튼 세 개를 표시해야 한다.
  - `PRAY`: `기도해요`
  - `COMFORT`: `토닥여요`
  - `TOGETHER`: `함께해요`
- 반응 타입 식별자는 model 상수 또는 이에 준하는 단일 정의에서
  관리되어야 한다.
- backend `reactions` 배열에 타입이 없으면 해당 타입의 count를 `0`,
  선택 상태를 `false`로 간주해야 한다.

### FR-02 목록 및 상세 화면

- `GET /api/confessions` 응답의 반응 정보를 각 목록 카드에 표시해야 한다.
- `GET /api/confessions/{confessionId}` 응답의 반응 정보를 상세 화면에
  표시해야 한다.
- 목록 카드의 반응 버튼 조작은 상세 화면 navigation과 충돌하지 않아야
  한다.

### FR-03 조회 응답 계약

- 목록 및 상세 조회 요청에는 기존 device 식별 방식과 동일한
  `X-Device-Id` 헤더를 포함해야 한다.
- 각 confession 응답은 다음 구조의 `reactions` 배열을 포함해야 한다.

```json
[
  { "type": "PRAY", "count": 3, "selectedByMe": true },
  { "type": "COMFORT", "count": 1, "selectedByMe": false },
  { "type": "TOGETHER", "count": 0, "selectedByMe": true }
]
```

- `selectedByMe`는 요청의 `X-Device-Id`에 해당하는 device가 해당 타입을
  선택했는지를 나타내야 한다.

### FR-04 반응 선택 및 해제

- 선택되지 않은 반응 버튼을 누르면
  `PUT /api/confessions/{confessionId}/reactions/{type}`을 호출해야 한다.
- 선택된 반응 버튼을 다시 누르면
  `DELETE /api/confessions/{confessionId}/reactions/{type}`을 호출해야 한다.
- PUT 및 DELETE 요청에는 `X-Device-Id` 헤더를 포함해야 한다.
- 각 반응 타입은 독립적으로 선택 및 해제할 수 있으며, 다른 타입 선택을
  자동으로 해제하지 않아야 한다.

### FR-05 상태 동기화

- 성공한 선택 또는 해제 이후 프론트엔드는 서버 데이터를 다시 조회하거나,
  동일한 최종 결과를 보장하는 낙관적 갱신과 실패 rollback을 사용해야 한다.
- 화면에 장기적으로 표시되는 선택 상태는 조회 응답의 `selectedByMe`를
  기준으로 해야 한다.
- `localStorage`를 사용하더라도 요청 진행 중 임시 UI 보조를 넘어
  서버 응답과 불일치한 선택 상태를 최종 상태로 유지해서는 안 된다.

### FR-06 오류 및 중복 조작 처리

- 반응 요청 중에는 동일 component의 중복 조작을 방지해야 한다.
- 반응 요청이 실패하면 사용자가 이해할 수 있는 한국어 오류 메시지를
  표시해야 한다.
- 요청 실패 후 count 또는 선택 표시가 성공한 것처럼 남아서는 안 된다.

## 비기능 요구사항

### NFR-01 사용성 및 접근성

- 선택된 버튼은 시각적 강조뿐 아니라 `aria-pressed`와 같은 접근 가능한
  상태로 노출되어야 한다.
- 세 반응 버튼은 처리 중 비활성화 상태를 전달해야 한다.
- 오류 메시지는 보조 기술에서 인지 가능한 alert 성격을 가져야 한다.

### NFR-02 유지보수성

- API 호출 로직은 UI component가 아닌 feature API 또는 service 계층에
  위치해야 한다.
- 반응 label, emoji, type 목록은 분산 하드코딩하지 않아야 한다.
- 브라우저 자동화가 안정적으로 조작할 수 있도록 반응 버튼 등 주요
  interactive element에는 안정적인 `data-testid`를 제공해야 한다.

### NFR-03 보안 요구사항

- `X-Device-Id`, `confessionId`, `type`은 backend에서 allowlist와 길이
  제한을 포함해 검증해야 한다. `type`은 세 허용 값만 받아야 한다.
- 공개 반응 mutation endpoint에는 abuse 방지를 위한 rate limiting 또는
  throttling 정책이 필요하다.
- CORS는 허용된 frontend origin으로 제한해야 하며, 무제한 공개 설정을
  production 기본값으로 사용해서는 안 된다.
- 요청 및 오류 로그에 device 식별자를 원문 그대로 노출하지 않도록
  마스킹 또는 최소 수집 정책을 적용해야 한다.
- frontend 오류 메시지는 내부 endpoint 세부 정보, stack trace, 운영
  식별 정보를 사용자에게 노출하지 않아야 한다.
- HTML 제공 환경의 보안 응답 header와 dependency scanning 등 배포 범위
  보안 항목은 후속 설계 및 build/test 단계에서 확인해야 한다.

### NFR-04 신뢰성 및 테스트

- 다음 example-based 시나리오를 검증해야 한다.
  - 세 타입이 모두 보이며 누락 타입 count가 `0`으로 표시되는 경우
  - `selectedByMe: true`인 타입이 선택 상태로 렌더링되는 경우
  - PUT 성공 후 count 및 선택 상태가 서버 조회 결과로 갱신되는 경우
  - DELETE 성공 후 count 및 선택 상태가 서버 조회 결과로 갱신되는 경우
  - mutation 실패 시 오류 표시와 UI 복구가 이루어지는 경우
  - 동일 device가 여러 타입을 함께 선택하는 경우
- PBT Partial 모드에서는 순수 변환 로직이 분리될 경우 다음 불변식을
  대상으로 property-based 검증을 계획해야 한다.
  - 임의의 누락 또는 순서가 다른 반응 배열에서도 출력 반응 타입은 항상
    세 종류이며 중복되지 않는다.
  - 누락된 타입의 count는 언제나 `0`, 선택 상태는 `false`이다.
  - 서버가 반환한 `selectedByMe`가 표시 선택 상태의 기준으로 보존된다.
- PBT framework 선택, generator, seed 재현 및 shrinking 구성은 후속
  NFR 또는 code generation 계획에서 확정해야 한다.

## API 계약

<!-- markdownlint-disable MD013 -->

| 기능 | Method | Path | 필수 Header | 성공 응답 |
| ---- | ------ | ---- | ----------- | --------- |
| 목록 조회 | GET | `/api/confessions` | `X-Device-Id` | `ConfessionResponse[]` |
| 상세 조회 | GET | `/api/confessions/{confessionId}` | `X-Device-Id` | `ConfessionResponse` |
| 반응 선택 | PUT | `/api/confessions/{confessionId}/reactions/{type}` | `X-Device-Id` | `204 No Content` |
| 반응 해제 | DELETE | `/api/confessions/{confessionId}/reactions/{type}` | `X-Device-Id` | `204 No Content` |

<!-- markdownlint-enable MD013 -->

### 응답 model 추가 요건

```ts
type ReactionType = 'PRAY' | 'COMFORT' | 'TOGETHER';

type ConfessionReaction = {
  type: ReactionType;
  count: number;
  selectedByMe: boolean;
};
```

## 현재 후보 구현과의 차이

- 현재 후보 구현은 `selectedByMe`를 model에서 수용하지 않고,
  `localStorage` 반응 기록을 선택 강조의 근거로 사용한다.
- 확정된 요구사항은 서버의 `selectedByMe`가 최종 기준이므로,
  construction 단계에서 model과 UI 상태 근거를 변경해야 한다.
- 안정적인 자동화 selector를 위한 `data-testid` 보강도 현재 후보
  구현에서 추가로 필요하다.

## Security Compliance

<!-- markdownlint-disable MD013 -->

| 규칙 | 요구사항 단계 상태 | 판단 |
| ---- | ------------------ | ---- |
| SECURITY-01 | N/A | 프론트엔드 기능 요구사항에서 데이터 저장소 또는 전송 암호화 설정을 소유하지 않는다. |
| SECURITY-02 | N/A | 네트워크 intermediary 설정은 현재 프론트엔드 범위에 없다. |
| SECURITY-03 | Addressed | device identifier 로그 최소화 및 마스킹 요구를 정의했다. |
| SECURITY-04 | Addressed | HTML 제공 환경의 보안 header 검증을 후속 배포 범위 요구로 포함했다. |
| SECURITY-05 | Addressed | device id, confession id, reaction type 검증 요구를 정의했다. |
| SECURITY-06 | N/A | IAM policy 변경 범위가 아니다. |
| SECURITY-07 | N/A | 네트워크 구성 변경 범위가 아니다. |
| SECURITY-08 | Addressed | 공개 endpoint CORS 제한과 device 기반 변경 요청 조건을 정의했다. |
| SECURITY-09 | Addressed | 안전한 사용자 오류 표시 요구를 정의했다. |
| SECURITY-10 | Addressed | dependency scanning 확인을 후속 quality gate로 포함했다. |
| SECURITY-11 | Addressed | 공개 mutation endpoint abuse 및 rate limiting 요구를 정의했다. |
| SECURITY-12 | N/A | 사용자 인증 또는 credential 기능이 아니다. |
| SECURITY-13 | Addressed | device 기반 데이터 변경의 서버 기준 상태 계약을 정의했다. |
| SECURITY-14 | N/A | alerting infrastructure는 현재 frontend 기능 범위 밖이다. |
| SECURITY-15 | Addressed | 실패 시 안전한 오류 메시지와 상태 복구 요구를 정의했다. |

Requirements 단계에서는 적용 가능한 보안 요구를 정의했으며, 실제
backend 및 배포 구성이 이를 충족하는지는 후속 설계와 검증 단계에서
확인해야 한다.

<!-- markdownlint-enable MD013 -->

## PBT Compliance

- **적용 모드**: Partial.
- **이 단계 적용 상태**: 적용 가능한 순수 반응 정규화 불변식을
  `NFR-04`에 식별했다.
- **후속 적용 규칙**: `PBT-03`, `PBT-07`, `PBT-08`, `PBT-09`는 해당
  변환 함수를 설계하거나 테스트 대상으로 도입할 경우 construction
  계획과 build/test에서 준수해야 한다.
- **N/A**: 이 요구사항 단계에서 직렬화 왕복 구현은 정의되지 않아
  `PBT-02`의 즉시 검증 대상은 없다.

## 요약

- 반응 UI는 목록과 상세에 공통으로 제공되며 타입별 다중 선택을 지원한다.
- 조회 응답은 각 반응에 `selectedByMe`를 제공하고 프론트엔드 선택
  표시의 최종 근거가 된다.
- Security Baseline과 Partial PBT 요구가 이후 설계, 구현, 검증을
  구속한다.
