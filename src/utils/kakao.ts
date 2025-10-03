// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

// 카카오 SDK 초기화
export const initKakao = () => {
  return new Promise<void>((resolve, reject) => {
    // SDK가 이미 초기화된 경우
    if (window.Kakao && window.Kakao.isInitialized()) {
      console.log('✅ Kakao SDK already initialized');
      resolve();
      return;
    }

    // SDK가 로드되지 않은 경우 대기
    const checkKakaoLoaded = setInterval(() => {
      if (window.Kakao) {
        clearInterval(checkKakaoLoaded);

        if (!window.Kakao.isInitialized()) {
          const kakaoKey = process.env.REACT_APP_KAKAO_JS_KEY || '361fbd23bff0c10f74b2df82729b0756';
          window.Kakao.init(kakaoKey);
          console.log('✅ Kakao SDK initialized:', window.Kakao.isInitialized());
        }

        resolve();
      }
    }, 100);

    // 10초 타임아웃
    setTimeout(() => {
      clearInterval(checkKakaoLoaded);
      if (!window.Kakao) {
        reject(new Error('카카오 SDK 로드 실패'));
      }
    }, 10000);
  });
};

// 카카오 로그인 (OAuth 리다이렉트 방식)
export const loginWithKakao = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const clientId = process.env.REACT_APP_KAKAO_JS_KEY || '361fbd23bff0c10f74b2df82729b0756';
    const redirectUri = `${window.location.origin}/auth/callback`;

    // 카카오 OAuth URL 생성
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

    // 팝업 창 열기
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      kakaoAuthUrl,
      'kakaoLogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      reject(new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.'));
      return;
    }

    let isProcessing = false; // 처리 중 플래그

    // 팝업에서 메시지 받기
    const messageHandler = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'KAKAO_LOGIN_SUCCESS') {
        if (isProcessing) return; // 이미 처리 중이면 무시
        isProcessing = true;

        const code = event.data.code;
        console.log('✅ Kakao authorization code received:', code);

        // 즉시 타이머 정리
        clearInterval(checkPopupClosed);
        window.removeEventListener('message', messageHandler);

        try {
          // 백엔드로 코드 전송하여 사용자 정보 가져오기
          const userInfo = await getKakaoUserInfo(code);
          resolve(userInfo);
        } catch (error) {
          reject(error);
        }
      } else if (event.data.type === 'KAKAO_LOGIN_FAILED') {
        clearInterval(checkPopupClosed);
        window.removeEventListener('message', messageHandler);
        reject(new Error('카카오 로그인에 실패했습니다.'));
      }
    };

    window.addEventListener('message', messageHandler);

    // 팝업이 닫혔는지 체크 (처리 중이 아닐 때만)
    const checkPopupClosed = setInterval(() => {
      if (!isProcessing && popup.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener('message', messageHandler);
        reject(new Error('로그인 창이 닫혔습니다.'));
      }
    }, 1000);
  });
};

// 카카오 사용자 정보 가져오기 (백엔드를 통해)
const getKakaoUserInfo = async (code: string): Promise<any> => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'https://foodiemap-backend.onrender.com';
    const response = await fetch(`${apiUrl}/api/auth/kakao/user-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        redirect_uri: `${window.location.origin}/auth/callback`
      })
    });

    const data = await response.json();
    console.log('✅ Kakao user info:', data);

    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.message || '카카오 사용자 정보를 가져올 수 없습니다.');
    }
  } catch (error) {
    console.error('❌ Kakao user info failed:', error);
    throw error;
  }
};

// 카카오 로그아웃
export const logoutKakao = () => {
  if (window.Kakao && window.Kakao.Auth) {
    window.Kakao.Auth.logout(() => {
      console.log('✅ Kakao logout success');
    });
  }
};
