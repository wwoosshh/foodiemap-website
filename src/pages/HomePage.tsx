import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { Person, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import RestaurantGrid from '../components/RestaurantGrid';
import BannerCarousel from '../components/BannerCarousel';
import FeaturedRestaurants from '../components/FeaturedRestaurants';
import RestaurantSearch from '../components/RestaurantSearch';
import { ApiService } from '../services/api';
import { Banner } from '../types';

const HomePage: React.FC = () => {
  const { user, logout: userLogout } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  // 홈페이지 통합 데이터 상태
  const [homeData, setHomeData] = useState<{
    banners: Banner[];
    categories: any[];
    featuredRestaurants: any[];
    restaurants: any[];
  } | null>(null);
  const [homeDataLoading, setHomeDataLoading] = useState(true);

  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<{
    search?: string;
    categoryId?: number;
  }>({});
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);

  // 홈페이지 통합 데이터 로드
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setHomeDataLoading(true);
        const response = await ApiService.getHomeData();
        if (response.success && response.data) {
          setHomeData(response.data);
        }
      } catch (error) {
        console.error('홈페이지 데이터 로드 실패:', error);
      } finally {
        setHomeDataLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // 검색 필터 변경 핸들러
  const handleSearchChange = useCallback((filters: { search?: string; categoryId?: number }) => {
    setSearchFilters(filters);
    setRestaurantsLoading(true);

    // 검색 결과 섹션으로 부드럽게 스크롤 (검색어가 있을 때만)
    if (filters.search || filters.categoryId) {
      setTimeout(() => {
        document.getElementById('search-results-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        setRestaurantsLoading(false);
      }, 300);
    } else {
      setRestaurantsLoading(false);
    }
  }, []);

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
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 300,
                letterSpacing: 4,
                fontSize: '1.5rem',
                fontFamily: '"Times New Roman", serif',
                textTransform: 'uppercase'
              }}
            >
              CUBE
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

      {/* Elegant Site Header */}
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center', borderBottom: '1px solid #f0f0f0', mb: 6 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontFamily: '"Times New Roman", "Noto Serif KR", serif',
              fontWeight: 300,
              color: '#1a1a1a',
              mb: 2,
              letterSpacing: 6,
              fontSize: { xs: '2.5rem', md: '4rem' },
              textTransform: 'uppercase'
            }}
          >
            CUBE
          </Typography>
          <Box sx={{ width: 60, height: 1, backgroundColor: '#000', mx: 'auto', mb: 3 }} />
          <Typography
            variant="subtitle1"
            sx={{
              color: '#666',
              fontWeight: 400,
              letterSpacing: 3,
              fontSize: { xs: '0.8rem', md: '1rem' },
              textTransform: 'uppercase',
              fontFamily: '"Inter", sans-serif'
            }}
          >
            Fine Dining Experience
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#999',
              fontWeight: 300,
              letterSpacing: 1,
              fontSize: { xs: '0.7rem', md: '0.85rem' },
              mt: 1,
              fontStyle: 'italic'
            }}
          >
            Curated Excellence in Every Taste
          </Typography>
        </Box>

        {/* 광고 배너 캐러셀 */}
        {!homeDataLoading && homeData?.banners && homeData.banners.length > 0 && (
          <BannerCarousel
            banners={homeData.banners}
            height={350}
            autoPlay={true}
            autoPlayInterval={6000}
          />
        )}
      </Container>

      {/* Featured Restaurants */}
      {!homeDataLoading && homeData?.featuredRestaurants && (
        <FeaturedRestaurants restaurants={homeData.featuredRestaurants} />
      )}

      {/* Restaurant Search */}
      {!homeDataLoading && homeData?.categories && (
        <RestaurantSearch
          categories={homeData.categories}
          onSearchChange={handleSearchChange}
          loading={restaurantsLoading}
        />
      )}

      {/* Search Results */}
      <Container maxWidth="lg" id="search-results-section">
        {!homeDataLoading && homeData?.restaurants && (
          <RestaurantGrid
            restaurants={homeData.restaurants}
            categoryId={searchFilters.categoryId}
            search={searchFilters.search}
            limit={12}
            showTitle={false}
          />
        )}
      </Container>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#1a1a1a', borderRadius: 0, mt: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: 'white',
              fontWeight: 300,
              letterSpacing: 3,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              mb: 2,
              textTransform: 'uppercase',
              fontFamily: '"Times New Roman", serif'
            }}
          >
            Join the Experience
          </Typography>
          <Box sx={{ width: 50, height: 1, backgroundColor: 'white', mx: 'auto', mb: 3 }} />
          <Typography
            variant="body1"
            sx={{
              color: '#ccc',
              mb: 4,
              fontSize: '1rem',
              letterSpacing: 1,
              fontWeight: 300,
              fontStyle: 'italic',
              maxWidth: '400px',
              mx: 'auto'
            }}
          >
            Begin your culinary journey with carefully curated dining experiences
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={handleSignUp}
            sx={{
              color: 'white',
              borderColor: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 400,
              letterSpacing: 2,
              textTransform: 'uppercase',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'white',
                color: '#1a1a1a',
                borderColor: 'white'
              }
            }}
          >
            Register Now
          </Button>
        </Box>

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