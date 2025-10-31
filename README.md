# FoodieMap Website

맛집 발견 및 리뷰 플랫폼의 웹 프론트엔드

## 📋 프로젝트 개요

FoodieMap은 사용자들이 맛집을 검색하고, 리뷰를 작성하며, 맛집 정보를 공유할 수 있는 웹 플랫폼입니다. React와 TypeScript로 개발된 현대적인 SPA(Single Page Application)입니다.

## ✨ 주요 기능

- **맛집 검색 및 탐색**: 다양한 필터와 카테고리로 맛집 검색
- **상세 정보**: 맛집의 위치, 메뉴, 영업시간 등 상세 정보 제공
- **리뷰 시스템**: 사용자 리뷰 작성 및 평점 관리
- **지도 통합**: 네이버 지도 API를 통한 위치 기반 서비스
- **사용자 인증**: 이메일 및 소셜 로그인 (Kakao, Naver)
- **즐겨찾기**: 관심 맛집 저장 및 관리
- **이벤트 & 공지**: 최신 이벤트 및 공지사항 확인
- **반응형 디자인**: 모바일 및 데스크톱 최적화

## 🛠️ 기술 스택

### 핵심 기술
- **React** 19.1.1 - UI 라이브러리
- **TypeScript** 4.9.5 - 타입 안정성
- **React Router** 7.9.1 - 클라이언트 사이드 라우팅
- **Material-UI** 7.3.2 - UI 컴포넌트 라이브러리

### 상태 관리 & API
- **Context API** - 전역 상태 관리
- **Axios** 1.12.2 - HTTP 클라이언트
- **Supabase** 2.58.0 - 인증 및 데이터베이스

### 외부 서비스
- **Naver Maps API** - 지도 서비스
- **Kakao SDK** - 카카오 소셜 로그인
- **Naver Login** - 네이버 소셜 로그인
- **Cloudinary** - 이미지 업로드 및 관리

### UI/UX
- **Material-UI Icons** - 아이콘
- **MUI X Data Grid** - 데이터 테이블
- **Emotion** - CSS-in-JS 스타일링
- **date-fns** - 날짜 포맷팅

### 개발 도구
- **Create React App** - 빌드 도구
- **React Testing Library** - 컴포넌트 테스트
- **ESLint** - 코드 린팅

## 📁 프로젝트 구조

```
website/
├── public/
│   ├── index.html
│   ├── cube-logo.svg
│   ├── favicon.ico
│   └── manifest.json      # PWA 매니페스트
├── src/
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── layout/       # 레이아웃 컴포넌트
│   │   ├── icons/        # 커스텀 아이콘
│   │   ├── BannerCarousel.tsx
│   │   ├── LoginModal.tsx
│   │   ├── NaverMap.tsx
│   │   └── RestaurantReviews.tsx
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── NewHomePage.tsx
│   │   ├── RestaurantsListPage.tsx
│   │   ├── RestaurantDetailPage.tsx
│   │   ├── UserProfilePage.tsx
│   │   ├── EventListPage.tsx
│   │   ├── NoticeListPage.tsx
│   │   ├── PrivacyPolicyPage.tsx
│   │   └── TermsOfServicePage.tsx
│   ├── context/          # React Context
│   │   └── AuthContext.tsx
│   ├── services/         # API 서비스
│   │   └── api.ts
│   ├── config/           # 설정 파일
│   │   └── supabase.ts
│   ├── types/            # TypeScript 타입 정의
│   │   └── index.ts
│   ├── utils/            # 유틸리티 함수
│   │   ├── kakao.ts
│   │   └── naver.ts
│   ├── constants/        # 상수
│   │   └── images.ts
│   ├── App.tsx           # 메인 앱 컴포넌트
│   ├── index.tsx         # 진입점
│   └── setupTests.ts     # 테스트 설정
├── build/                # 빌드 결과물
├── package.json
├── tsconfig.json         # TypeScript 설정
└── .env                  # 환경 변수
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 14.0 이상
- npm 또는 yarn
- Naver Maps API 키
- Supabase 계정
- Kakao/Naver 개발자 계정 (소셜 로그인용)

### 설치

```bash
# 의존성 설치
npm install
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# API 서버 주소
REACT_APP_API_URL=http://localhost:5000

# Supabase 설정
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# 네이버 지도 API
REACT_APP_NAVER_MAP_CLIENT_ID=your_naver_map_client_id

# 카카오 소셜 로그인
REACT_APP_KAKAO_JS_KEY=your_kakao_js_key

# 네이버 소셜 로그인
REACT_APP_NAVER_CLIENT_ID=your_naver_client_id
```

### 개발 서버 실행

```bash
# 개발 모드 실행
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 프로덕션 빌드

```bash
# 프로덕션 빌드 생성
npm run build
```

빌드된 파일은 `build/` 폴더에 생성됩니다.

### 테스트

```bash
# 테스트 실행
npm test

# 테스트 커버리지
npm run test:coverage
```

## 🎨 디자인 시스템

### 색상 테마
- **Primary**: Coral Red (#FF6B6B) - 브랜드 색상
- **Secondary**: Turquoise (#4ECDC4)
- **배경**: White, Light Gray

### 타이포그래피
- **한글 폰트**: Pretendard, Noto Sans KR
- **영문 폰트**: Roboto

### 반응형 브레이크포인트
- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px

## 📱 주요 페이지

### 홈페이지 (`/`)
- 배너 캐러셀
- 인기 맛집
- 최신 리뷰

### 맛집 목록 (`/restaurants`)
- 검색 및 필터링
- 카테고리별 분류
- 정렬 옵션
- 페이지네이션

### 맛집 상세 (`/restaurants/:id`)
- 상세 정보
- 네이버 지도
- 리뷰 목록
- 평점 및 통계

### 사용자 프로필 (`/profile`)
- 내 정보 수정
- 작성한 리뷰
- 즐겨찾기 목록

### 이벤트 (`/events`)
- 이벤트 목록
- 이벤트 상세

### 공지사항 (`/notices`)
- 공지사항 목록
- 공지사항 상세

## 🔐 인증 시스템

### 지원하는 로그인 방법
- 이메일/비밀번호
- 카카오 소셜 로그인
- 네이버 소셜 로그인

### 인증 흐름
1. 사용자 로그인 시도
2. JWT 토큰 발급
3. localStorage에 토큰 저장
4. API 요청 시 Authorization 헤더에 포함
5. 토큰 만료 시 자동 로그아웃

## 🗺️ 네이버 지도 통합

```typescript
// 지도 초기화 예시
import { NaverMap } from './components/NaverMap';

<NaverMap
  latitude={37.5665}
  longitude={126.9780}
  markers={restaurants}
/>
```

## 📦 빌드 및 배포

### 로컬 빌드

```bash
npm run build
```

### 정적 호스팅 배포

빌드된 `build/` 폴더를 다음 플랫폼에 배포할 수 있습니다:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### 환경 변수 (프로덕션)

프로덕션 환경에서는 다음 환경 변수를 설정하세요:
- `REACT_APP_API_URL` - 백엔드 API 주소
- `REACT_APP_SUPABASE_URL` - Supabase 프로젝트 URL
- `REACT_APP_SUPABASE_ANON_KEY` - Supabase 익명 키
- `REACT_APP_NAVER_MAP_CLIENT_ID` - 네이버 지도 클라이언트 ID
- `REACT_APP_KAKAO_JS_KEY` - 카카오 JavaScript 키
- `REACT_APP_NAVER_CLIENT_ID` - 네이버 클라이언트 ID

## 🧪 테스트

### 단위 테스트

```bash
npm test
```

### 컴포넌트 테스트

React Testing Library를 사용하여 컴포넌트를 테스트합니다.

```typescript
import { render, screen } from '@testing-library/react';
import { BannerCarousel } from './BannerCarousel';

test('renders banner carousel', () => {
  render(<BannerCarousel />);
  expect(screen.getByRole('img')).toBeInTheDocument();
});
```

## 🔧 개발 가이드

### 코드 스타일

- TypeScript strict mode 사용
- ESLint 규칙 준수
- Prettier로 코드 포맷팅
- 컴포넌트는 함수형 컴포넌트 사용

### 커밋 메시지

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 설정 변경
```

### 컴포넌트 작성 가이드

- Props는 TypeScript interface로 정의
- 재사용 가능한 컴포넌트는 `components/` 폴더에 작성
- 페이지 컴포넌트는 `pages/` 폴더에 작성
- 스타일은 Material-UI의 `sx` prop 또는 Emotion 사용

## 🐛 문제 해결

### 일반적인 문제

**1. 네이버 지도가 표시되지 않음**
- `REACT_APP_NAVER_MAP_CLIENT_ID` 환경 변수 확인
- 도메인이 네이버 개발자 콘솔에 등록되어 있는지 확인

**2. 소셜 로그인 실패**
- Kakao/Naver 개발자 콘솔에서 Redirect URI 확인
- 클라이언트 ID가 올바른지 확인

**3. API 연결 오류**
- `REACT_APP_API_URL`이 올바른 백엔드 주소인지 확인
- CORS 설정 확인

**4. 빌드 오류**
- `node_modules` 삭제 후 재설치
- TypeScript 타입 오류 확인

## 🌐 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 🔒 보안

보안 취약점 발견 시 공개 이슈가 아닌 비공개 채널로 보고해 주세요.

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해 주세요.

---

**Version**: 1.4.6
**Built with**: Create React App
**Last Updated**: 2025
