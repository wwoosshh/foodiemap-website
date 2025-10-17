import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Pages
import NewHomePage from './pages/NewHomePage';
import RestaurantsListPage from './pages/RestaurantsListPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import NoticeListPage from './pages/NoticeListPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// Components
import EmailVerificationModal from './components/EmailVerificationModal';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// 맛집큐브 테마 - 세련되고 생동감 있는 디자인
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B6B', // 시그니처 코랄 레드
      light: '#FF9999',
      dark: '#E85555',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4ECDC4', // 세련된 터콰이즈
      light: '#7EDBD4',
      dark: '#3AB5AD',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#95E1D3', // 부드러운 민트
      light: '#B4EBE0',
      dark: '#76C7BB',
    },
    warning: {
      main: '#FFD93D', // 생동감 있는 골드
      light: '#FFE570',
      dark: '#F5C400',
    },
    error: {
      main: '#FF6B6B',
      light: '#FF9999',
      dark: '#E85555',
    },
    info: {
      main: '#6C7A89',
      light: '#95A5A6',
      dark: '#556370',
    },
    background: {
      default: '#FFF5F0', // 따뜻한 핑크빛 화이트 (더 색감 있게)
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50', // 깊이 있는 다크 블루
      secondary: '#6C7A89',
      disabled: '#BDC3C7',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      color: '#2C3E50',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#2C3E50',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      color: '#2C3E50',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#2C3E50',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
      color: '#2C3E50',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#2C3E50',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 6px 12px rgba(0, 0, 0, 0.1)',
    '0px 8px 16px rgba(0, 0, 0, 0.12)',
    '0px 10px 20px rgba(0, 0, 0, 0.14)',
    '0px 12px 24px rgba(0, 0, 0, 0.16)',
    '0px 14px 28px rgba(0, 0, 0, 0.18)',
    '0px 16px 32px rgba(0, 0, 0, 0.2)',
    '0px 18px 36px rgba(0, 0, 0, 0.22)',
    '0px 20px 40px rgba(0, 0, 0, 0.24)',
    '0px 22px 44px rgba(0, 0, 0, 0.26)',
    '0px 24px 48px rgba(0, 0, 0, 0.28)',
    '0px 26px 52px rgba(0, 0, 0, 0.3)',
    '0px 28px 56px rgba(0, 0, 0, 0.32)',
    '0px 30px 60px rgba(0, 0, 0, 0.34)',
    '0px 32px 64px rgba(0, 0, 0, 0.36)',
    '0px 34px 68px rgba(0, 0, 0, 0.38)',
    '0px 36px 72px rgba(0, 0, 0, 0.4)',
    '0px 38px 76px rgba(0, 0, 0, 0.42)',
    '0px 40px 80px rgba(0, 0, 0, 0.44)',
    '0px 42px 84px rgba(0, 0, 0, 0.46)',
    '0px 44px 88px rgba(0, 0, 0, 0.48)',
    '0px 46px 92px rgba(0, 0, 0, 0.5)',
    '0px 48px 96px rgba(0, 0, 0, 0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '10px 24px',
          fontSize: '0.95rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s ease',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 20px rgba(255, 107, 107, 0.25)',
            '&::before': {
              transform: 'translateX(100%)',
            },
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        contained: {
          boxShadow: '0px 4px 14px rgba(255, 107, 107, 0.35)',
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF8E8E 0%, #FF6B6B 100%)',
            boxShadow: '0px 8px 24px rgba(255, 107, 107, 0.4)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(255, 107, 107, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          '&:hover': {
            boxShadow: '0px 12px 32px rgba(255, 107, 107, 0.15)',
            transform: 'translateY(-8px)',
            borderColor: 'rgba(255, 107, 107, 0.2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        filled: {
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover fieldset': {
              borderColor: '#FF6B6B',
              borderWidth: 2,
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF6B6B',
              borderWidth: 2,
              boxShadow: '0 0 0 4px rgba(255, 107, 107, 0.1)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'box-shadow 0.3s ease',
        },
        elevation1: {
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
        },
      },
    },
  },
});

// 이메일 인증 모달을 포함한 앱 컨텐츠
const AppContent = () => {
  const { user, showEmailVerification, setShowEmailVerification, refreshUser } = useAuth();

  const handleVerificationSuccess = () => {
    // 인증 완료 후 사용자 정보 업데이트
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        parsedUser.email_verified = true;
        localStorage.setItem('user_data', JSON.stringify(parsedUser));
        refreshUser();
      } catch (error) {
        console.error('Failed to update user data:', error);
      }
    }
  };

  return (
    <>
      <Router>
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<NewHomePage />} />

          {/* 맛집 페이지 */}
          <Route path="/restaurants" element={<RestaurantsListPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />

          {/* 프로필 페이지 */}
          <Route path="/profile" element={<UserProfilePage />} />

          {/* OAuth 콜백 */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* 이벤트 목록 및 상세 */}
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          {/* 공지사항 목록 및 상세 */}
          <Route path="/notices" element={<NoticeListPage />} />
          <Route path="/notices/:id" element={<NoticeDetailPage />} />

          {/* 정책 페이지 */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />

          {/* 404 페이지 - 모든 미지정 경로는 홈으로 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* 이메일 인증 모달 */}
      {user && !user.email_verified && (
        <EmailVerificationModal
          open={showEmailVerification}
          onClose={() => setShowEmailVerification(false)}
          email={user.email}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )}
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;