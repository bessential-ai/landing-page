# B:Essential

B:Essential은 초기 창업자에게 필요한 서류를 한 곳에서 쉽고 빠르게 정리할 수 있도록 돕는 창업 서류 관리 플랫폼의 웹페이지입니다.

사업자등록, 투자계약서, 고용 관련 서류 등 창업 과정에서 필요한 문서를 더 단순하게 관리하는 경험을 소개합니다.

## 주요 기능

- 창업 서류 관리 플랫폼 소개용 랜딩 페이지
- 섹션 단위 풀페이지 스크롤 인터랙션
- 첫 진입 히어로 텍스트 애니메이션
- 흐르는 그라데이션 타이틀 효과
- 섹션 진입 시 통계 숫자 카운트업 애니메이션
- B:Essential 로고 및 앱 아이콘 적용

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## 시작하기

의존성을 설치한 뒤 개발 서버를 실행합니다.

```bash
npm install
npm run dev
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:3000
```

다른 포트가 필요하면 다음처럼 실행할 수 있습니다.

```bash
npm run dev -- -p 3001
```

## 스크립트

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 프로젝트 구조

```text
src/app/
  layout.tsx    페이지 메타데이터와 루트 레이아웃
  page.tsx      메인 랜딩 페이지
  globals.css   전역 스타일과 애니메이션

public/
  logo.svg      B:Essential 로고
  applogo.svg   웹페이지 아이콘
```

## 라이선스

이 프로젝트는 CC BY-NC-ND 4.0 조건을 따르며, 추가 제한으로 `B:Essential 구성원 외 수정 및 사용 금지`가 적용됩니다.

자세한 내용은 [LICENSE.md](./LICENSE.md)를 확인하세요.
