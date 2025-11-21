import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import PageTransition from './components/PageTransition';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TransitionProvider } from './context/TransitionContext';

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
        <PageTransition>
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
        </PageTransition>
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
    <ThemeContextProvider>
      <CssBaseline />
      <LanguageProvider>
        <TransitionProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </TransitionProvider>
      </LanguageProvider>
    </ThemeContextProvider>
  );
}

export default App;