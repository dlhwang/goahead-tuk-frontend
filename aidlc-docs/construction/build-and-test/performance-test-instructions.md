# Performance Test Instructions

## Applicability

이 unit의 승인된 NFR은 별도 latency, throughput 또는 concurrency SLA를
정의하지 않았다. 따라서 load/stress test suite는 이번 범위에 적용하지
않는다.

## Implemented Performance Decision

- Optimistic cache patch 대신 서버 refetch 일관성을 우선한다.
- mutation pending 동안 중복 UI 요청을 차단한다.

## Future Trigger

공개 reaction endpoint에 latency 또는 abuse 관련 수치 목표가 수립되면,
backend/edge rate limit 검증과 함께 별도의 performance test를 설계한다.
