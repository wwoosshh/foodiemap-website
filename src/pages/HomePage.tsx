import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { Search, Restaurant, Map, Person, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import RestaurantGrid from '../components/RestaurantGrid';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout: userLogout } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);

    // 섹션으로 스크롤
    if (tab === 'restaurants') {
      document.getElementById('restaurants-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    } else if (tab === 'map') {
      // TODO: 지도 섹션 구현 후 스크롤
      console.log('지도 섹션으로 이동');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    setLoginModalOpen(true);
  };

  const handleSignUp = () => {
    setLoginModalOpen(true);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    if (user) {
      userLogout();
    }
    handleUserMenuClose();
  };



  // 현재 로그인된 사용자
  const currentUser = user;

  return (
    <Box>
      {/* Navigation */}
      <AppBar position="static" color="primary" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Cube
            </Typography>
            <Button
              color="inherit"
              sx={{ ml: 2, backgroundColor: currentTab === 'home' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
              onClick={() => handleTabChange('home')}
            >
              홈
            </Button>
            <Button
              color="inherit"
              sx={{ ml: 2, backgroundColor: currentTab === 'restaurants' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
              onClick={() => handleTabChange('restaurants')}
            >
              맛집
            </Button>
            <Button
              color="inherit"
              sx={{ ml: 2, backgroundColor: currentTab === 'map' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
              onClick={() => handleTabChange('map')}
            >
              지도
            </Button>

            {/* 로그인 상태에 따른 UI */}
            {currentUser ? (
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                <Button
                  color="inherit"
                  onClick={handleUserMenuOpen}
                  startIcon={
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <Person fontSize="small" />
                    </Avatar>
                  }
                  sx={{ textTransform: 'none' }}
                >
                  {currentUser.name}
                </Button>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    로그아웃
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button variant="outlined" color="inherit" sx={{ ml: 2 }} onClick={handleLogin}>
                로그인
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            color: 'white',
            mb: 4
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            🍽️ 맛집을 찾는 새로운 방법
          </Typography>
          <Typography variant="h6" sx={{
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            opacity: 0.9,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}>
            Cube와 함께 주변의 숨은 맛집을 발견하고, 리뷰를 공유해보세요.
            간편하고 직관적인 지도 기반 맛집 검색 서비스입니다.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Search />}
            sx={{
              mr: 2,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.3s ease',
              px: 3,
              py: 1.5,
              borderRadius: 2
            }}
            onClick={() => handleTabChange('restaurants')}
          >
            맛집 찾기
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Map />}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.3s ease',
              px: 3,
              py: 1.5,
              borderRadius: 2
            }}
            onClick={() => handleTabChange('map')}
          >
            지도 보기
          </Button>
        </Box>

        {/* 인기 맛집 그리드 */}
        <div id="restaurants-section">
          <RestaurantGrid
            title={selectedCategory ? `${selectedCategory} 맛집` : "지금 인기 있는 맛집"}
            limit={8}
            category={selectedCategory}
          />
        </div>

        {/* 빠른 카테고리 검색 */}
        <Box sx={{ py: 6, backgroundColor: 'grey.50', borderRadius: 2, mt: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight={600}>
            카테고리별 맛집 찾기
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            원하는 종류의 음식을 빠르게 찾아보세요
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Button
              variant={!selectedCategory ? "contained" : "outlined"}
              size="large"
              onClick={() => {
                setSelectedCategory('');
                document.getElementById('restaurants-section')?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
              sx={{
                minWidth: 120,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                }
              }}
            >
              <Typography sx={{ fontSize: '1.5rem' }}>🍽️</Typography>
              전체
            </Button>
            {[
              { name: '한식', icon: '🍚', id: 1 },
              { name: '중식', icon: '🥢', id: 2 },
              { name: '일식', icon: '🍣', id: 3 },
              { name: '양식', icon: '🍝', id: 4 },
              { name: '치킨', icon: '🍗', id: 5 },
              { name: '피자', icon: '🍕', id: 6 },
              { name: '카페', icon: '☕', id: 8 },
            ].map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "contained" : "outlined"}
                size="large"
                onClick={() => {
                  setSelectedCategory(category.name);
                  // 맛집 섹션으로 스크롤
                  document.getElementById('restaurants-section')?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
                sx={{
                  minWidth: 120,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }
                }}
              >
                <Typography sx={{ fontSize: '1.5rem' }}>{category.icon}</Typography>
                {category.name}
              </Button>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', py: 6, backgroundColor: 'grey.50', borderRadius: 2, mt: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            지금 시작해보세요
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            무료로 회원가입하고 맛집 탐험을 시작하세요.
          </Typography>
          <Button variant="contained" size="large" onClick={handleSignUp}>
            회원가입
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 3, mt: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © 2024 Cube. All rights reserved.
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

export default HomePage;