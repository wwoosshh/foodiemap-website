import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL에서 해시 파라미터 가져오기
        const hash = window.location.hash;

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
          const user = data.session.user;
          console.log('Google 로그인 성공:', user);

          // Supabase access token을 로컬 스토리지에 저장
          localStorage.setItem('supabase_token', data.session.access_token);

          // 사용자 정보를 AuthContext에 설정
          setUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
            phone: user.user_metadata?.phone || undefined,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined,
            email_verified: user.email_confirmed_at ? true : false,
            created_at: user.created_at || new Date().toISOString()
          });

          // 기존 백엔드와 동기화 (선택사항)
          // TODO: 백엔드에 소셜 로그인 사용자 생성/업데이트 API 호출

          // 홈으로 리다이렉트
          setTimeout(() => {
            navigate('/');
          }, 1000);
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
