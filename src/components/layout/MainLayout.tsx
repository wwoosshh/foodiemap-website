import React, { useState } from 'react';
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
  InputBase,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import LoginModal from '../LoginModal';
import MobileBottomNav from '../MobileBottomNav';
import {
  CubeLogoIcon,
  SearchIcon,
  UserIcon,
  LogoutIcon,
  RestaurantIcon,
  GiftIcon,
  InfoIcon,
} from '../icons/CustomIcons';

// 검색 바 스타일
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.common.white, 0.95),
  border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.background.paper
      : theme.palette.common.white,
    borderColor: theme.palette.primary.main,
  },
  '&:focus-within': {
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.background.paper
      : theme.palette.common.white,
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
  transition: 'all 0.3s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: theme.palette.text.primary,
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.8,
    },
  },
}));

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

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const menuItems = [
    { label: t.nav.home, path: '/', icon: <RestaurantIcon /> },
    { label: t.nav.restaurantSearch, path: '/restaurants', icon: <RestaurantIcon /> },
    { label: t.nav.events, path: '/events', icon: <GiftIcon /> },
    { label: t.nav.notices, path: '/notices', icon: <InfoIcon /> },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 헤더 */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
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
                gap: '8px',
              }}
            >
              <CubeLogoIcon
                sx={{
                  fontSize: 40,
                  color: 'primary.main',
                  filter: 'drop-shadow(0 2px 4px rgba(255,107,107,0.3))',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'rotate(15deg) scale(1.15)',
                    filter: 'drop-shadow(0 4px 8px rgba(255,107,107,0.5))',
                  },
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.03em',
                  fontSize: { xs: '1.1rem', sm: '1.5rem' },
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

            {/* 검색 바 */}
            {!isMobile && (
              <Box component="form" onSubmit={handleSearch}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder={t.nav.searchPlaceholder}
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Search>
              </Box>
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
          background: currentTheme === 'dark'
            ? 'linear-gradient(180deg, #0D0D0D 0%, #121212 50%, #0F0F0F 100%)'
            : 'linear-gradient(180deg, #FFF5F0 0%, #FFF8F5 50%, #FFFBF8 100%)',
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
          py: 6,
          px: 2,
          background: currentTheme === 'dark'
            ? 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0F0F0F 100%)'
            : 'linear-gradient(135deg, #1a252f 0%, #2C3E50 50%, #34495e 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 50%, #FFD93D 100%)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 3, sm: 3, md: 4 },
            }}
          >
            {/* 회사 정보 */}
            <Box
              sx={{
                gridColumn: { xs: '1 / -1', sm: '1 / -1', md: 'auto' },
                animation: 'fadeInUp 0.6s ease-out',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CubeLogoIcon
                  sx={{
                    fontSize: { xs: 28, md: 36 },
                    color: '#FF6B6B',
                    filter: 'drop-shadow(0 2px 8px rgba(255, 107, 107, 0.4))',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(15deg) scale(1.1)',
                    },
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    color: '#FFFFFF',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t.footer.companyName}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.8,
                  fontSize: { xs: '0.8rem', md: '0.875rem' },
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  whiteSpace: 'pre-line',
                }}
              >
                {t.footer.description}
              </Typography>
            </Box>

            {/* 바로가기 */}
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  color: '#FFFFFF',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  fontSize: { xs: '0.95rem', md: '1.25rem' },
                }}
              >
                {t.footer.quickLinks}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  color: '#FFFFFF',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  fontSize: { xs: '0.95rem', md: '1.25rem' },
                }}
              >
                {t.footer.policies}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  color: '#FFFFFF',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  fontSize: { xs: '0.95rem', md: '1.25rem' },
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
                  {t.footer.adminEmail}: nunconnect1@gmail.com
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

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

      {/* 모바일 하단 네비게이션 바 */}
      {isMobile && (
        <MobileBottomNav
          onLoginClick={() => setLoginModalOpen(true)}
        />
      )}
    </Box>
  );
};

export default MainLayout;
