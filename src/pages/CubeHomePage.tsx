import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Home,
  Category,
  Restaurant,
  Person,
  Event,
  Info,
  Logout,
  Menu as MenuIcon,
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import CubeContainer from '../components/CubeContainer';

type CubeFace = 'home' | 'category' | 'restaurants' | 'profile' | 'event' | 'info';

const CubeHomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [currentFace, setCurrentFace] = useState<CubeFace>('home');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();

  const handleNavigate = (face: CubeFace, categoryId?: number) => {
    setCurrentFace(face);
    if (categoryId) {
      setSelectedCategoryId(categoryId);
    }
    setMobileMenuOpen(false);
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
    setCurrentFace('home');
  };

  const navItems = [
    { label: '홈', icon: <Home />, face: 'home' as CubeFace },
    { label: '카테고리', icon: <Category />, face: 'category' as CubeFace },
    { label: '맛집', icon: <Restaurant />, face: 'restaurants' as CubeFace },
    { label: '프로필', icon: <Person />, face: 'profile' as CubeFace },
    { label: '이벤트', icon: <Event />, face: 'event' as CubeFace },
    { label: '정보', icon: <Info />, face: 'info' as CubeFace },
  ];

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 네비게이션 바 */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          {/* Cube 로고 (홈으로 이동 버튼) */}
          <Button
            onClick={() => handleNavigate('home')}
            sx={{
              fontWeight: 700,
              fontSize: '1.5rem',
              textTransform: 'none',
              color: 'primary.main',
              mr: 4,
              '&:hover': {
                backgroundColor: 'transparent',
                transform: 'scale(1.05)',
              },
              transition: 'transform 0.2s',
            }}
          >
            Cube
          </Button>

          {/* 데스크탑 메뉴 */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.face}
                  startIcon={item.icon}
                  onClick={() => handleNavigate(item.face)}
                  sx={{
                    color: currentFace === item.face ? 'primary.main' : 'text.primary',
                    fontWeight: currentFace === item.face ? 600 : 400,
                    backgroundColor: 'transparent',
                    border: currentFace === item.face ? '2px solid' : '2px solid transparent',
                    borderColor: currentFace === item.face ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      borderColor: currentFace === item.face ? 'primary.main' : 'rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* 모바일 메뉴 버튼 */}
          {isMobile && (
            <Box sx={{ flex: 1 }}>
              <IconButton onClick={() => setMobileMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          {/* 사용자 메뉴 */}
          {user ? (
            <>
              <IconButton onClick={handleUserMenuOpen}>
                <Avatar src={user.avatar_url} sx={{ width: 36, height: 36 }}>
                  <Person />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                <MenuItem disabled>
                  <Box>
                    <div>{user.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>{user.email}</div>
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => { handleNavigate('profile'); handleUserMenuClose(); }}>
                  <Person sx={{ mr: 1 }} /> 프로필
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> 로그아웃
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => handleNavigate('profile')}
              sx={{ ml: 2 }}
            >
              로그인
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* 모바일 드로어 메뉴 */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.face}
                onClick={() => handleNavigate(item.face)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  borderLeft: currentFace === item.face ? '4px solid' : '4px solid transparent',
                  borderColor: currentFace === item.face ? 'primary.main' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', color: currentFace === item.face ? 'primary.main' : 'text.primary' }}>
                  {item.icon}
                </Box>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: currentFace === item.face ? 600 : 400,
                    color: currentFace === item.face ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* 3D 큐브 컨테이너 */}
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <CubeContainer
          currentFace={currentFace}
          onNavigate={handleNavigate}
          selectedCategoryId={selectedCategoryId}
        />

        {/* 화살표 네비게이션 */}
        {/* 왼쪽 화살표 - 프로필 */}
        <IconButton
          onClick={() => handleNavigate('profile')}
          sx={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
            zIndex: 10,
          }}
        >
          <ArrowBack sx={{ fontSize: 28 }} />
        </IconButton>

        {/* 오른쪽 화살표 - 맛집 */}
        <IconButton
          onClick={() => handleNavigate('restaurants')}
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
            zIndex: 10,
          }}
        >
          <ArrowForward sx={{ fontSize: 28 }} />
        </IconButton>

        {/* 위쪽 화살표 - 카테고리 */}
        <IconButton
          onClick={() => handleNavigate('category')}
          sx={{
            position: 'absolute',
            left: '50%',
            top: 20,
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
            zIndex: 10,
          }}
        >
          <ArrowUpward sx={{ fontSize: 28 }} />
        </IconButton>

        {/* 아래쪽 화살표 - 이벤트 */}
        <IconButton
          onClick={() => handleNavigate('event')}
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: 20,
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
            zIndex: 10,
          }}
        >
          <ArrowDownward sx={{ fontSize: 28 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CubeHomePage;
