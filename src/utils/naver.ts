// 네이버 SDK 타입 선언
declare global {
  interface Window {
    naver: any;
  }
}

// 네이버 로그인 (간편한 팝업 방식)
export const loginWithNaver = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID || 'zV0gfacULb5LJcX7WiwW';
    const callbackUrl = `${window.location.origin}/auth/callback`;
    const state = Math.random().toString(36).substring(2, 15);

    // 네이버 로그인 URL 생성
    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}`;

    // 팝업 창 열기
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      naverLoginUrl,
      'naverLogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      reject(new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.'));
      return;
    }

    // 팝업에서 메시지 받기
    const messageHandler = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'NAVER_LOGIN_SUCCESS') {
        const accessToken = event.data.accessToken;
        console.log('✅ Naver access token received:', accessToken);

        try {
          // 네이버 사용자 정보 가져오기
          const userInfo = await getNaverUserInfo(accessToken);
          window.removeEventListener('message', messageHandler);
          resolve(userInfo);
        } catch (error) {
          window.removeEventListener('message', messageHandler);
          reject(error);
        }
      } else if (event.data.type === 'NAVER_LOGIN_FAILED') {
        window.removeEventListener('message', messageHandler);
        reject(new Error('네이버 로그인에 실패했습니다.'));
      }
    };

    window.addEventListener('message', messageHandler);

    // 팝업이 닫혔는지 체크
    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener('message', messageHandler);
        reject(new Error('로그인 창이 닫혔습니다.'));
      }
    }, 1000);
  });
};

// 네이버 사용자 정보 가져오기
const getNaverUserInfo = async (accessToken: string): Promise<any> => {
  try {
    const response = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();
    console.log('✅ Naver user info:', data);

    if (data.resultcode === '00' && data.response) {
      const user = data.response;
      return {
        social_id: user.id,
        email: user.email || '',
        name: user.name || user.nickname || '사용자',
        phone: user.mobile || user.mobile_e164 || undefined,
        avatar_url: user.profile_image || undefined,
        auth_provider: 'naver',
        social_data: user
      };
    } else {
      throw new Error('네이버 사용자 정보를 가져올 수 없습니다.');
    }
  } catch (error) {
    console.error('❌ Naver user info failed:', error);
    throw error;
  }
};
