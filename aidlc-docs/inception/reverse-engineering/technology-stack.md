# 기술 스택

## 프로그래밍 언어

- TypeScript 및 TSX - 애플리케이션 소스, typed model, 설정.
- CSS - Tailwind 진입 layer와 전역 배경 스타일.
- JavaScript - ESLint 설정.

## 프레임워크

- React `^18.3.1` - component 렌더링.
- React Router `^6.28.1` - 브라우저 routing.
- TanStack Query `^5.90.12` - 서버 상태 fetch와 mutation 조정.
- Tailwind CSS `^3.4.17` - utility styling.

## 인프라

- 브라우저 `localStorage` - device id와 성공한 반응 선택 표시 상태 유지.
- 외부 REST API - backend 고해 조회, 생성, 반응 선택 및 해제 작업.
- 정적 asset pipeline - Vite가 production asset을 `dist/`로 생성.

## 빌드 도구

- npm - package script와 dependency 설치.
- Vite `^6.0.6` - `package.json` 선언 버전. 로컬 build 출력은 Vite `6.4.2`를 보고했다.
- TypeScript `~5.7.2` - type checking과 build step.
- PostCSS 및 Autoprefixer - CSS 처리.

## 테스트 도구

- ESLint `^9.17.0`가 정적 lint 검사용으로 설정되어 있다.
- unit, integration, browser automation, coverage runner 설정은 탐지되지 않았다.
