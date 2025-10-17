# Google 로그인 설정 가이드

Google 로그인이 구현되었습니다! 이제 마지막 설정만 하면 됩니다.

## ✅ 완료된 작업

1. ✅ Google OAuth 클라이언트 ID 발급
2. ✅ Supabase에서 Google Provider 활성화
3. ✅ 데이터베이스 스키마 수정 (소셜 로그인 필드 추가)
4. ✅ 프론트엔드 Google 로그인 버튼 구현
5. ✅ OAuth 콜백 페이지 생성
6. ✅ 코드 푸시 완료

## 🚀 남은 작업 (2단계)

### 1단계: Google OAuth 리디렉션 URI 추가 (5분)

Google Cloud Console에서 리디렉션 URI를 추가해야 합니다.

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **API 및 서비스 > 사용자 인증 정보** 메뉴
3. 기존 OAuth 2.0 클라이언트 ID 클릭
4. **승인된 리디렉션 URI**에 다음 추가:

```
https://kyhouclobasgszovlbyg.supabase.co/auth/v1/callback
https://www.mzcube.com/auth/callback
https://mzcube.com/auth/callback
http://localhost:3000/auth/callback
```

⚠️ **중요**: Supabase 콜백 URL이 가장 중요합니다!
- `https://kyhouclobasgszovlbyg.supabase.co/auth/v1/callback`

5. **저장** 클릭

### 2단계: Vercel 환경 변수 설정 (3분)

Vercel Dashboard에서 환경 변수를 추가합니다.

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **foodiemap-website** 프로젝트 선택
3. **Settings > Environment Variables** 메뉴
4. 다음 환경 변수 추가:

#### REACT_APP_SUPABASE_URL
```
Key: REACT_APP_SUPABASE_URL
Value: https://kyhouclobasgszovlbyg.supabase.co
Environments: Production, Preview, Development (모두 선택)
```

#### REACT_APP_SUPABASE_ANON_KEY
```
Key: REACT_APP_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5aG91Y2xvYmFzZ3N6b3ZsYnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDIzNTcsImV4cCI6MjA3NDE3ODM1N30.PdjwWE3OVDXP5-b0hTKn8UfS2AIo-gwjQJCP7EeMruM
Environments: Production, Preview, Development (모두 선택)
```

5. **Save** 클릭
6. **Deployments** 탭으로 이동
7. 최신 배포에서 **Redeploy** 클릭 (환경 변수 적용)

## 🧪 테스트 방법

배포가 완료되면 (약 2-3분):

1. https://www.mzcube.com 접속
2. 우측 상단 **로그인** 버튼 클릭
3. **Google로 계속하기** 버튼 클릭
4. Google 계정 선택
5. 권한 승인
6. 자동으로 홈페이지로 리디렉트
7. 우측 상단에 사용자 이름 표시 확인

## 🎉 작동 원리

```
사용자가 "Google로 계속하기" 클릭
  ↓
Supabase Auth가 Google OAuth로 리디렉트
  ↓
사용자가 Google 계정 선택 및 승인
  ↓
Google이 Supabase 콜백 URL로 리디렉트
  ↓
Supabase가 JWT 토큰 생성
  ↓
프론트엔드 /auth/callback로 리디렉트
  ↓
세션 확인 및 사용자 정보 저장
  ↓
홈페이지로 이동, 로그인 완료
```

## 📊 데이터베이스 확인

Google 로그인 성공 후 Supabase에서 확인:

```sql
SELECT
  id,
  email,
  name,
  auth_provider,
  social_id,
  email_verified,
  created_at
FROM public.users
WHERE auth_provider = 'google'
ORDER BY created_at DESC;
```

## ❓ 문제 해결

### "인증 정보가 없습니다" 오류
- Google OAuth 리디렉션 URI가 올바르게 설정되었는지 확인
- Supabase 콜백 URL이 정확한지 확인

### "로그인 처리 중 오류"
- Vercel 환경 변수가 올바르게 설정되었는지 확인
- 배포 후 재배포했는지 확인

### "Google 로그인 버튼을 눌러도 반응 없음"
- 브라우저 콘솔 확인
- Supabase URL과 ANON KEY가 환경 변수에 있는지 확인

### 세션이 유지되지 않음
- 로컬 스토리지에 `supabase_token`이 저장되는지 확인
- AuthContext가 제대로 작동하는지 확인

## 🔐 보안 참고사항

- ✅ Supabase ANON Key는 공개되어도 안전 (클라이언트용)
- ✅ Google Client Secret은 Supabase에만 저장 (프론트엔드 노출 안 됨)
- ✅ JWT 토큰은 로컬 스토리지에 저장
- ⚠️ 프로덕션에서는 httpOnly 쿠키 사용 권장 (추후 개선)

## 📱 다음 단계 (선택사항)

### 카카오/네이버 로그인 추가
현재 Google만 구현되어 있습니다. 카카오/네이버는 추가 구현이 필요합니다.
(`SOCIAL_LOGIN_IMPLEMENTATION_PLAN.md` 참고)

### 안드로이드 앱에 Google 로그인 추가
안드로이드 앱에도 같은 방식으로 구현 가능합니다.

### 기존 이메일 사용자와 Google 계정 연동
현재는 별도 계정으로 생성됩니다. 연동 기능 추가 가능합니다.

---

## 준비되셨나요?

1. Google OAuth 리디렉션 URI 추가
2. Vercel 환경 변수 설정
3. 재배포
4. 테스트!

완료하시면 알려주세요. 함께 테스트하겠습니다!
