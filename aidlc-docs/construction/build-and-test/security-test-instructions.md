# Security Test Instructions

## Frontend Security Checks

<!-- markdownlint-disable MD013 -->

| Check | Command Or Method | Result |
| ----- | ----------------- | ------ |
| Dependency vulnerability audit | `npm audit --audit-level=high` | Pass: `found 0 vulnerabilities` |
| HTML security header configuration | Review `vercel.json` | Configured: CSP, HSTS, nosniff, frame deny, referrer policy |
| CSP API allowlist | Review `connect-src` | Configured for `'self'` and the confirmed HTTPS backend origin only |
| Safe mutation error UI | Component test | Pass: generic Korean `role="alert"` message |
| Browser storage selection authority | Code/reference check | Pass: legacy reaction selection storage reference removed |

<!-- markdownlint-enable MD013 -->

## External Verification Required

Security Baseline Full 완료를 위해 다음 증빙이 필요하다. 이 항목들은
frontend local build로 확인할 수 없다.

- Backend의 `X-Device-Id`, confession id 및 reaction type 입력 검증
- Public mutation endpoint의 rate limit 또는 동등 abuse protection
- Production CORS allowlist
- Device id log masking과 mutation audit/observability
- Production TLS 및 실제 deployed HTML response security header

## Blocking Status

Frontend-owned security checks는 통과했다. 그러나 external verification
증빙이 제공되지 않아 이 기능을 Security Full 기준의 최종 완료 상태로
선언할 수 없다.

## MVP Demo Risk Acceptance Boundary

사용자는 Security Full completion을 보류하면서, 다음 최소 gate가 모두
검증될 경우에만 MVP demo를 Risk Accepted 상태로 진행할 수 있다고
결정했다.

1. 정상적인 `X-Device-Id` 입력에서 backend validation error가 없어야 한다.
2. Device id 원문이 backend 또는 운영 로그에 남지 않아야 한다.
3. Production CORS는 실제 Vercel origin만 허용해야 한다.
4. 실제 Railway backend 기준 reaction GET/PUT/DELETE smoke test가
   통과해야 한다.

위 증빙은 아직 제공되지 않았으므로 demo 배포 승인은 대기 상태다.
Rate limiting 고도화, TLS/deployed security header 증빙, mutation
관측 정책은 MVP 조건 충족 후에도 Security Full completion 이전에
해결해야 할 follow-up gate로 남는다.
