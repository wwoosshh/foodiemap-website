# EmailJS 설정 가이드

문의하기 페이지에서 이메일을 발송하려면 EmailJS를 설정해야 합니다.

## 1. EmailJS 계정 생성

1. [EmailJS 웹사이트](https://www.emailjs.com/)에 접속
2. 무료 계정 생성 (월 200개 이메일 무료)

## 2. 이메일 서비스 연결

1. EmailJS 대시보드에서 **Email Services** 클릭
2. **Add New Service** 클릭
3. **Gmail** 선택 (또는 다른 이메일 서비스)
4. Gmail 계정으로 로그인 및 권한 승인
5. Service ID를 복사해두기 (예: `service_abc123`)

## 3. 이메일 템플릿 생성

1. **Email Templates** 클릭
2. **Create New Template** 클릭
3. 템플릿 작성:

### 템플릿 설정
- **Template Name**: Contact Form
- **Subject**: `[맛집큐브 문의] {{subject}}`

### 템플릿 내용
```
안녕하세요,

맛집큐브 웹사이트에서 새로운 문의가 도착했습니다.

발신자: {{from_name}}
이메일: {{from_email}}
제목: {{subject}}

문의 내용:
{{message}}

---
이 메일은 맛집큐브 문의 양식에서 자동으로 발송되었습니다.
```

4. **Save** 클릭
5. Template ID를 복사해두기 (예: `template_xyz789`)

## 4. Public Key 확인

1. 좌측 메뉴에서 **Account** → **General** 클릭
2. **Public Key** 복사 (예: `AbC123XyZ-_dEfGhI`)

## 5. 환경 변수 설정

`website/.env` 파일에 다음 내용 추가:

```env
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_PUBLIC_KEY=AbC123XyZ-_dEfGhI
```

## 6. 수신 이메일 설정

EmailJS 템플릿에서 수신 이메일을 설정합니다:

1. 템플릿 편집 화면에서 **Settings** 탭
2. **To Email** 필드에 `nunconnect1@gmail.com` 입력
3. 또는 템플릿 내용에 `{{to_email}}` 변수 사용 (이미 설정됨)

## 7. 테스트

1. 개발 서버 재시작: `npm start`
2. 문의하기 페이지(`/contact`)로 이동
3. 테스트 문의 작성 및 전송
4. `nunconnect1@gmail.com`에서 이메일 확인

## 참고사항

- **무료 플랜 제한**: 월 200개 이메일
- **스팸 방지**: reCAPTCHA 추가 권장 (선택사항)
- **보안**: Public Key는 공개되어도 안전함 (Private Key와 다름)
- **지원 언어**: 한국어 포함 모든 언어 지원

## 문제 해결

### 이메일이 발송되지 않는 경우
1. 브라우저 콘솔에서 오류 메시지 확인
2. EmailJS 대시보드에서 **Auto Reply** 확인
3. 환경 변수가 올바르게 설정되었는지 확인
4. Gmail 스팸 폴더 확인

### Service ID, Template ID, Public Key 찾기
- Service ID: Email Services 페이지
- Template ID: Email Templates 페이지
- Public Key: Account → General 페이지
