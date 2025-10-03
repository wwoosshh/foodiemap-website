import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 카카오 로그인 콜백 처리 (팝업 창인 경우 - code 파라미터)
        const urlParams = new URLSearchParams(window.location.search);
        const kakaoCode = urlParams.get('code');

        if (kakaoCode && window.opener) {
          // 팝업 창에서 카카오 코드를 부모 창으로 전송
          window.opener.postMessage({
            type: 'KAKAO_LOGIN_SUCCESS',
            code: kakaoCode
          }, window.location.origin);
          window.close();
          return;
        }

        // 네이버 로그인 콜백 처리 (팝업 창인 경우 - hash 파라미터)
        const hash = window.location.hash;
        if (hash && window.opener) {
          // 팝업 창에서 네이버 토큰을 부모 창으로 전송
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const state = params.get('state');

          if (accessToken) {
            window.opener.postMessage({
              type: 'NAVER_LOGIN_SUCCESS',
              accessToken,
              state
            }, window.location.origin);
            window.close();
            return;
          }
        }

        // URL에서 해시 파라미터 가져오기 (구글 로그인용)
        if (!hash) {
          setError('인증 정보가 없습니다.');
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        // Supabase 세션 가져오기
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('세션 가져오기 오류:', sessionError);
          setError('로그인 처리 중 오류가 발생했습니다.');
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        if (data.session) {
          const supabaseUser = data.session.user;
          console.log('Google 로그인 성공:', supabaseUser);

          // Supabase access token을 로컬 스토리지에 저장
          localStorage.setItem('supabase_token', data.session.access_token);

          // 백엔드에 소셜 로그인 사용자 생성/조회 API 호출
          try {
            const response = await ApiService.socialLogin({
              social_id: supabaseUser.id,
              auth_provider: 'google',
              email: supabaseUser.email || '',
              name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '사용자',
              phone: supabaseUser.user_metadata?.phone || undefined,
              avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || undefined,
              social_data: supabaseUser.user_metadata
            });

            if (response.success && response.data) {
              const { user, token } = response.data;

              // 백엔드 JWT 토큰과 사용자 정보 저장
              localStorage.setItem('user_token', token);
              localStorage.setItem('user_data', JSON.stringify(user));

              // 사용자 정보를 AuthContext에 설정
              setUser(user || null);

              console.log('백엔드 DB에 사용자 저장 완료:', user);

              // 홈으로 리다이렉트
              setTimeout(() => {
                navigate('/');
              }, 1000);
            } else {
              setError('사용자 정보 저장 중 오류가 발생했습니다.');
              setTimeout(() => navigate('/'), 2000);
            }
          } catch (apiError: any) {
            console.error('백엔드 API 호출 오류:', apiError);
            setError(apiError.userMessage || '사용자 정보 처리 중 오류가 발생했습니다.');
            setTimeout(() => navigate('/'), 2000);
          }
        } else {
          setError('로그인 세션을 찾을 수 없습니다.');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (err) {
        console.error('OAuth 콜백 처리 오류:', err);
        setError('로그인 처리 중 예기치 않은 오류가 발생했습니다.');
        setTimeout(() => navigate('/'), 2000);
      }
    };

    handleCallback();
  }, [navigate, setUser]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          gap: 2
        }}
      >
        <Typography variant="h5" color="error">
          로그인 실패
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          잠시 후 홈으로 이동합니다...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        gap: 3
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h5" sx={{ fontWeight: 300, letterSpacing: 2 }}>
        로그인 처리 중...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        잠시만 기다려주세요
      </Typography>
    </Box>
  );
};

export default AuthCallbackPage;
