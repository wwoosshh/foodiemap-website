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
                    backgroundColor: currentFace === item.face ? 'primary.light' : 'transparent',
                    '&:hover': {
                      backgroundColor: currentFace === item.face ? 'primary.light' : 'rgba(0,0,0,0.04)',
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
                  backgroundColor: currentFace === item.face ? 'primary.light' : 'transparent',
                  '&:hover': {
                    backgroundColor: currentFace === item.face ? 'primary.light' : 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </Box>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: currentFace === item.face ? 600 : 400,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* 3D 큐브 컨테이너 */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <CubeContainer
          currentFace={currentFace}
          onNavigate={handleNavigate}
          selectedCategoryId={selectedCategoryId}
        />
      </Box>
    </Box>
  );
};

export default CubeHomePage;
