# 보안 검증 지침

## 적용 기준

Security Baseline 확장 규칙을 적용한 변경이다. 이번 프론트 저장소 범위에서는
환경변수와 cross-origin 운영 메모를 점검한다.

## 확인 항목

1. `.env.example`에 secret이나 운영 token이 포함되지 않았는지 확인한다.
2. README의 운영 예시가 `VITE_API_BASE_URL`만 노출하는지 확인한다.
3. Railway backend가 Vercel 배포 도메인을 명시적 CORS allowed origin으로
   허용하는지 backend 설정에서 확인한다.
4. authenticated endpoint가 생기면 wildcard CORS를 사용하지 않는지 별도로
   확인한다.
