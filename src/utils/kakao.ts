// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

// 카카오 SDK 초기화
export const initKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
    const kakaoKey = process.env.REACT_APP_KAKAO_JS_KEY || '361fbd23bff0c10f74b2df82729b0756';
    window.Kakao.init(kakaoKey);
    console.log('✅ Kakao SDK initialized:', window.Kakao.isInitialized());
  }
};

// 카카오 로그인
export const loginWithKakao = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      reject(new Error('Kakao SDK not initialized'));
      return;
    }

    window.Kakao.Auth.login({
      success: (authObj: any) => {
        console.log('✅ Kakao login success:', authObj);

        // 사용자 정보 가져오기
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res: any) => {
            console.log('✅ Kakao user info:', res);

            const userData = {
              social_id: res.id.toString(),
              email: res.kakao_account?.email || '',
              name: res.properties?.nickname || res.kakao_account?.profile?.nickname || '사용자',
              avatar_url: res.properties?.profile_image || res.kakao_account?.profile?.profile_image_url || undefined,
              auth_provider: 'kakao',
              social_data: res
            };

            resolve(userData);
          },
          fail: (err: any) => {
            console.error('❌ Kakao user info failed:', err);
            reject(err);
          }
        });
      },
      fail: (err: any) => {
        console.error('❌ Kakao login failed:', err);
        reject(err);
      }
    });
  });
};

// 카카오 로그아웃
export const logoutKakao = () => {
  if (window.Kakao && window.Kakao.Auth) {
    window.Kakao.Auth.logout(() => {
      console.log('✅ Kakao logout success');
    });
  }
};
