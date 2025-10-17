# 네이버 지도 API 설정 가이드

## 중요 공지
네이버가 기존 AI NAVER API의 지도 서비스를 종료하고 신규 Maps API로 전환 중입니다.
- 공지사항: https://www.ncloud.com/support/notice/all/1930
- 가이드: https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html

## 1. 신규 네이버 Maps API 신청

### 1단계: 서비스 신청
1. [네이버 클라우드 플랫폼](https://console.ncloud.com/) 접속
2. **Services > Application Service > Maps** 메뉴 이동
3. **"이용 신청하기"** 클릭
4. **Web Dynamic Map** 선택 후 신청

### 2단계: Application 등록
1. Console > Services > Application Service > **AI·NAVER API** 메뉴
2. **Application 등록** 클릭
3. 정보 입력:
   - Application 이름: `Foodie` (또는 원하는 이름)
   - Service 선택: **Maps**
   - 인증 정보:
     - **Web Dynamic Map** 체크
4. **Web 서비스 URL** 등록:
   ```
   https://www.mzcube.com
   https://mzcube.com
   http://localhost:3000
   ```
5. 등록 완료 후 **클라이언트 ID** 확인

## 2. 환경 변수 설정

### 로컬 개발 환경

1. `website` 폴더에 `.env.local` 파일 생성:
```bash
cd website
cp .env.example .env.local
```

2. `.env.local` 파일 편집:
```env
# 네이버 Maps API 클라이언트 ID (신규 발급받은 ID 입력)
REACT_APP_NAVER_MAP_CLIENT_ID=your_new_client_id_here
```

### Vercel 배포 환경

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. foodiemap-website 프로젝트 선택
3. **Settings > Environment Variables** 메뉴
4. 환경 변수 추가:
   - Key: `REACT_APP_NAVER_MAP_CLIENT_ID`
   - Value: `신규_발급받은_클라이언트_ID`
   - Environment: **Production, Preview, Development** 모두 선택
5. **Save** 클릭
6. **Deployments** 메뉴에서 **Redeploy** 실행

## 3. 테스트

### 로컬 테스트
```bash
cd website
npm start
```

맛집 상세 페이지 > 지도 탭에서 지도가 표시되는지 확인

### 프로덕션 테스트
Vercel 배포 후 실제 사이트에서 확인

## 4. 문제 해결

### 인증 실패 (Authentication Failed)
- **원인**: 잘못된 클라이언트 ID 또는 미등록 도메인
- **해결**:
  - 신규 클라이언트 ID 재확인
  - Web 서비스 URL에 도메인 정확히 등록

### 지도가 표시되지 않음
- **원인**: 환경 변수 미설정
- **해결**:
  - `.env.local` 파일 확인 (로컬)
  - Vercel 환경 변수 확인 후 재배포 (프로덕션)

### CORS 에러
- **원인**: Web 서비스 URL 미등록
- **해결**:
  - 네이버 클라우드 콘솔에서 URL 등록
  - `https://www.mzcube.com` 정확히 입력

## 5. 참고 자료

- [네이버 Maps API 가이드](https://navermaps.github.io/maps.js.ncp/)
- [네이버 클라우드 플랫폼 콘솔](https://console.ncloud.com/)
- [API 사용량 확인](https://console.ncloud.com/mc/solution/naverService/application)
