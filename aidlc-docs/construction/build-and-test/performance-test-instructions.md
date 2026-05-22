# 성능 검증 지침

## 적용성

이번 변경은 API base URL 설정과 API path wrapper 정리이므로 별도 성능 목표나 load
test script를 추가하지 않는다.

## 최소 확인

1. production build asset이 정상 생성되는지 확인한다.
2. 실제 backend 연동 smoke test에서 목록 조회와 작성 요청이 정상 완료되는지
   확인한다.
3. API 응답 지연이 확인되면 backend 관측 지표와 Railway 로그를 함께 확인한다.
