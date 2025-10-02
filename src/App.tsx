import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Pages
import HomePage from './pages/HomePage';
import AuthCallbackPage from './pages/AuthCallbackPage';

// Components
import EmailVerificationModal from './components/EmailVerificationModal';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// 미니멀 블랙&화이트 테마
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#757575',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FAFAFA',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#000000',
    },
    h2: {
      fontWeight: 600,
      color: '#000000',
    },
    h3: {
      fontWeight: 600,
      color: '#212121',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
          {/* 홈페이지 - 사용자 전용 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<HomePage />} />
          <Route path="/map" element={<HomePage />} />

          {/* OAuth 콜백 */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

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