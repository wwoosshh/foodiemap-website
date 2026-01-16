import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
  Dialog,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useAuth } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import LoginModal from '../LoginModal';
import MobileBottomNav from '../MobileBottomNav';
import FloatingContactButton from '../FloatingContactButton';
import SearchAutocomplete from '../SearchAutocomplete';
import {
  CubeLogoIcon,
  UserIcon,
  LogoutIcon,
  RestaurantIcon,
  GiftIcon,
  InfoIcon,
  SearchIcon,
  CloseIcon,
  CommunityIcon,
} from '../icons/CustomIcons';

// 검색 모달 슬라이드 트랜지션
const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// 헤더 가시성 및 높이 Context
export const HeaderVisibilityContext = createContext<{ isHeaderVisible: boolean; headerHeight: number }>({ isHeaderVisible: true, headerHeight: 73 });
export const useHeaderVisibility = () => useContext(HeaderVisibilityContext);

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { currentTheme } = useThemeContext();
  const { t } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isVisible: isHeaderVisible } = useScrollDirection({ threshold: 10, alwaysShowAtTop: true });

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(73); // 기본값 73px
  const appBarRef = useRef<HTMLDivElement>(null);

  // 헤더 높이 측정 (DOM이 완전히 렌더링된 후 측정)
  useEffect(() => {
    const measureHeaderHeight = () => {
      if (appBarRef.current) {
        const height = appBarRef.current.offsetHeight;
        if (height > 0 && height < 150) { // 유효한 범위 내에서만 업데이트
          setHeaderHeight(height);
        }
      }
    };

    // 초기 렌더링 후 약간의 지연을 두고 측정
    const timer = setTimeout(measureHeaderHeight, 100);
    window.addEventListener('resize', measureHeaderHeight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureHeaderHeight);
    };
  }, []);

  const menuItems = [
    { label: t.nav.home, path: '/', icon: <RestaurantIcon /> },
    { label: t.nav.restaurantSearch, path: '/restaurants', icon: <RestaurantIcon /> },
    { label: t.nav.events, path: '/events', icon: <GiftIcon /> },
    { label: t.nav.notices, path: '/notices', icon: <InfoIcon /> },
    { label: t.nav.community, path: '/community', icon: <CommunityIcon /> },
  ];

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <HeaderVisibilityContext.Provider value={{ isHeaderVisible, headerHeight }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100vw' }}>
      {/* 헤더 */}
      <AppBar
        ref={appBarRef}
        position={isMobile ? 'fixed' : 'sticky'}
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          // 모바일에서 스크롤 방향에 따라 숨김/표시
          ...(isMobile && {
            transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }),
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* 로고 */}
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <CubeLogoIcon
                sx={{
                  fontSize: { xs: 32, sm: 36 },
                  color: 'primary.main',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.1rem', sm: '1.35rem' },
                }}
              >
                {t.footer.companyName}
              </Typography>
            </Link>

            {/* 데스크탑 메뉴 */}
            {!isMobile && (
              <Box sx={{ display: 'flex', ml: 6, gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: isActivePath(item.path) ? 'primary.main' : 'text.primary',
                      fontWeight: isActivePath(item.path) ? 700 : 500,
                      px: 2.5,
                      py: 1,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: isActivePath(item.path) ? '80%' : '0%',
                        height: '3px',
                        backgroundColor: 'primary.main',
                        borderRadius: '3px 3px 0 0',
                        transition: 'width 0.3s ease',
                      },
                      '&:hover::after': {
                        width: '80%',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            {/* 모바일 검색 버튼 */}
            {isMobile && (
              <IconButton
                onClick={() => setSearchModalOpen(true)}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            )}

            {/* 검색 바 - SearchAutocomplete 컴포넌트 사용 (PC) */}
            {!isMobile && (
              <SearchAutocomplete variant="navbar" />
            )}

            {/* 로그인/사용자 메뉴 */}
            {user ? (
              <>
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{ ml: 2 }}
                >
                  <Avatar
                    src={user.avatar_url}
                    sx={{
                      width: 40,
                      height: 40,
                      border: '2px solid',
                      borderColor: 'primary.light',
                    }}
                  >
                    <UserIcon />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      navigate('/profile');
                      handleUserMenuClose();
                    }}
                  >
                    <UserIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    {t.nav.myProfile}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    {t.nav.logout}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              !isMobile && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setLoginModalOpen(true)}
                  sx={{ ml: 2 }}
                >
                  {t.nav.login}
                </Button>
              )
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* 메인 콘텐츠 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
          // 모바일에서 고정 헤더 높이만큼 상단 패딩 추가
          paddingTop: isMobile ? `${headerHeight}px` : 0,
          // 모바일에서 하단 네비게이션 바의 높이만큼 하단 패딩 추가
          paddingBottom: isMobile ? '90px' : 0,
        }}
      >
        {children}
      </Box>

      {/* 푸터 */}
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: { xs: 4, md: 6 },
          px: 2,
          backgroundColor: currentTheme === 'dark' ? '#0A0A0A' : '#1A1A1A',
          color: 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {/* 회사 정보 */}
            <Box
              sx={{
                gridColumn: { xs: '1 / -1', sm: '1 / -1', md: 'auto' },
              }}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}>
                {/* 로고 + 회사명 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <CubeLogoIcon
                    sx={{
                      fontSize: { xs: 28, md: 32 },
                      color: '#E8505B',
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      color: '#FFFFFF',
                    }}
                  >
                    {t.footer.companyName}
                  </Typography>
                </Box>

                {/* 설명 텍스트 */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.7,
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    whiteSpace: 'pre-line',
                    maxWidth: '280px',
                  }}
                >
                  {t.footer.description}
                </Typography>
              </Box>
            </Box>

            {/* 바로가기 */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                gutterBottom
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.85rem',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t.footer.quickLinks}
              </Typography>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                gap: { xs: '8px 12px', md: 1 },
              }}>
                <Link
                  to="/restaurants"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  {t.nav.restaurantSearch}
                </Link>
                <Link
                  to="/events"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  {t.nav.events}
                </Link>
                <Link
                  to="/notices"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  {t.nav.notices}
                </Link>
                <Link
                  to="/community"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  {t.nav.community}
                </Link>
                <Link
                  to="/contact"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  {t.footer.contact}
                </Link>
              </Box>
            </Box>

            {/* 정책 */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                gutterBottom
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.85rem',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t.footer.policies}
              </Typography>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                gap: { xs: '8px 12px', md: 1 },
              }}>
                <Link
                  to="/terms"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  {t.footer.terms}
                </Link>
                <Link
                  to="/privacy"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  {t.footer.privacy}
                </Link>
              </Box>
            </Box>

            {/* 회사 정보 */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                gutterBottom
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.85rem',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t.footer.companyInfo}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  {t.footer.businessName}: {t.footer.companyName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  {t.footer.businessNumber}: {t.footer.notYetRegistered}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  {t.footer.address}: {t.footer.notYetRegistered}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  {t.footer.adminEmail}: ccjsrnl@naver.com
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: 'rgba(255,255,255,0.1)' }} />

          <Typography
            variant="body2"
            align="center"
            sx={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {t.footer.copyright}
          </Typography>
        </Container>
      </Box>

      {/* 로그인 모달 */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* 모바일 플로팅 검색 모달 */}
      <Dialog
        fullWidth
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        TransitionComponent={SlideTransition}
        PaperProps={{
          sx: {
            position: 'fixed',
            top: 0,
            m: 0,
            borderRadius: '0 0 16px 16px',
            maxHeight: '80vh',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
              맛집 검색
            </Typography>
            <IconButton onClick={() => setSearchModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <SearchAutocomplete
            variant="mobile"
            placeholder=""
            autoFocus
            onResultClick={() => setSearchModalOpen(false)}
            onSearch={() => setSearchModalOpen(false)}
          />
        </Box>
      </Dialog>

      {/* 모바일 하단 네비게이션 바 */}
      {isMobile && (
        <MobileBottomNav
          onLoginClick={() => setLoginModalOpen(true)}
        />
      )}

      {/* 플로팅 문의하기 버튼 */}
      <FloatingContactButton />
    </Box>
    </HeaderVisibilityContext.Provider>
  );
};

export default MainLayout;
