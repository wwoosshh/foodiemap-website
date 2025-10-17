import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
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
import LoginModal from '../LoginModal';
import {
  CubeLogoIcon,
  SearchIcon,
  MenuIcon,
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
  backgroundColor: alpha(theme.palette.common.white, 0.95),
  border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    backgroundColor: theme.palette.common.white,
    borderColor: theme.palette.primary.main,
  },
  '&:focus-within': {
    backgroundColor: theme.palette.common.white,
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
  color: '#2C3E50', // 명시적으로 어두운 색상 지정
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: '#2C3E50', // 입력 텍스트 색상 명시
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
    '&::placeholder': {
      color: '#6C7A89',
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const menuItems = [
    { label: '홈', path: '/', icon: <RestaurantIcon /> },
    { label: '맛집 찾기', path: '/restaurants', icon: <RestaurantIcon /> },
    { label: '이벤트', path: '/events', icon: <GiftIcon /> },
    { label: '공지사항', path: '/notices', icon: <InfoIcon /> },
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
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                맛집큐브
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
                    placeholder="맛집 검색..."
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
                    내 프로필
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setLoginModalOpen(true)}
                sx={{ ml: 2 }}
              >
                로그인
              </Button>
            )}

            {/* 모바일 메뉴 버튼 */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* 모바일 드로어 */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'background.default',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom>
            메뉴
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                selected={isActivePath(item.path)}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box sx={{ mr: 2, color: 'primary.main' }}>{item.icon}</Box>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActivePath(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* 메인 콘텐츠 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: 'linear-gradient(180deg, #FFF5F0 0%, #FFF8F5 50%, #FFFBF8 100%)',
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
          background: 'linear-gradient(135deg, #1a252f 0%, #2C3E50 50%, #34495e 100%)',
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
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            {/* 회사 정보 */}
            <Box
              sx={{
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
                    fontSize: 36,
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
                    color: '#FFFFFF',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '0.5px',
                  }}
                >
                  맛집큐브
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.8,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              >
                전국의 숨은 맛집을 찾아드립니다.
                <br />
                당신의 맛있는 순간을 함께하세요.
              </Typography>
            </Box>

            {/* 링크 */}
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  color: '#FFFFFF',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                바로가기
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link
                  to="/restaurants"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  맛집 찾기
                </Link>
                <Link
                  to="/events"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  이벤트
                </Link>
                <Link
                  to="/notices"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  공지사항
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
                }}
              >
                정책
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link
                  to="/terms"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  이용약관
                </Link>
                <Link
                  to="/privacy"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B6B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  개인정보처리방침
                </Link>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

          <Typography
            variant="body2"
            align="center"
            sx={{ color: 'rgba(255,255,255,0.5)' }}
          >
            © 2025 맛집큐브. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* 로그인 모달 */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </Box>
  );
};

export default MainLayout;
