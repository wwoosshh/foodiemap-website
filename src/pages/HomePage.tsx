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
  Alert,
  AlertTitle,
  IconButton,
  Collapse,
} from '@mui/material';
import { Person, Logout, Email as EmailIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import RestaurantGrid from '../components/RestaurantGrid';
import BannerCarousel from '../components/BannerCarousel';
import RestaurantSearch from '../components/RestaurantSearch';
import { ApiService } from '../services/api';
import { Banner } from '../types';
import CubeLoader from '../components/CubeLoader';

const HomePage: React.FC = () => {
  const { user, logout: userLogout, setShowEmailVerification } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);

  // 기본 데이터 (배너, 카테고리)
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [homeDataLoading, setHomeDataLoading] = useState(true);

  // 맛집 목록 (서버에서 실시간으로 가져오기)
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);

  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<{
    search?: string;
    categoryId?: number;
    sort?: string;
    page?: number;
  }>({
    sort: 'created_at_desc',
    page: 1
  });

  // 배너와 카테고리 로드 (한 번만)
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setHomeDataLoading(true);
        const response = await ApiService.getHomeData();
        if (response.success && response.data) {
          setBanners(response.data.banners || []);
          setCategories(response.data.categories || []);
        }
      } catch (error) {
        console.error('홈페이지 데이터 로드 실패:', error);
      } finally {
        setHomeDataLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // 맛집 목록 로드 (필터 변경 시마다)
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setRestaurantsLoading(true);
        const response = await ApiService.getRestaurants({
          page: searchFilters.page || 1,
          limit: 20,
          category_id: searchFilters.categoryId,
          search: searchFilters.search,
          sort: searchFilters.sort as any
        });

        if (response.success && response.data) {
          setRestaurants(response.data.restaurants || []);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error('맛집 목록 로드 실패:', error);
      } finally {
        setRestaurantsLoading(false);
      }
    };

    loadRestaurants();
  }, [searchFilters]);

  // 검색 필터 변경 핸들러
  const handleSearchChange = useCallback((filters: { search?: string; categoryId?: number; sort?: string }) => {
    setSearchFilters(prev => ({
      ...filters,
      page: 1 // 필터 변경 시 페이지를 1로 리셋
    }));
  }, []);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((newPage: number) => {
    setSearchFilters(prev => ({
      ...prev,
      page: newPage
    }));

    // 목록 상단으로 스크롤
    setTimeout(() => {
      document.getElementById('restaurants-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, []);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);

    // 섹션으로 스크롤
    if (tab === 'restaurants') {
      document.getElementById('restaurants-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    } else if (tab === 'map') {
      console.log('지도 섹션으로 이동');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
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

      {/* 이메일 미인증 배너 */}
      {user && !user.email_verified && (
        <Collapse in={showVerificationBanner}>
          <Alert
            severity="warning"
            icon={<EmailIcon />}
            sx={{
              borderRadius: 0,
              borderBottom: '1px solid',
              borderColor: 'warning.light',
            }}
            action={
              <>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setShowEmailVerification(true)}
                  sx={{ mr: 1, fontWeight: 600 }}
                >
                  지금 인증하기
                </Button>
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowVerificationBanner(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </>
            }
          >
            <AlertTitle sx={{ fontWeight: 600 }}>이메일 인증이 필요합니다</AlertTitle>
            리뷰를 작성하려면 이메일 인증을 완료해주세요. <strong>{user.email}</strong>로 발송된 인증 코드를 확인하세요.
          </Alert>
        </Collapse>
      )}

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
        {!homeDataLoading && banners && banners.length > 0 && (
          <BannerCarousel
            banners={banners}
            height={350}
            autoPlay={true}
            autoPlayInterval={6000}
          />
        )}
      </Container>

      {/* Restaurant Search */}
      {!homeDataLoading && categories && (
        <RestaurantSearch
          categories={categories}
          onSearchChange={handleSearchChange}
          loading={restaurantsLoading}
        />
      )}

      {/* Restaurants List */}
      <Container maxWidth="lg" id="restaurants-section">
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              fontWeight: 300,
              letterSpacing: 4,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              color: '#1a1a1a',
              mb: 1,
              textTransform: 'uppercase',
              fontFamily: '"Times New Roman", serif'
            }}
          >
            Restaurants
          </Typography>
          <Box sx={{ width: 40, height: 1, backgroundColor: '#000', mx: 'auto', mb: 4 }} />

          {/* 로딩 상태 */}
          {restaurantsLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CubeLoader size={80} message="맛집 정보 불러오는 중..." />
            </Box>
          )}

          {/* 맛집 그리드 */}
          {!restaurantsLoading && (
            <>
              <RestaurantGrid
                restaurants={restaurants}
                limit={20}
                showTitle={false}
              />

              {/* 페이지네이션 */}
              {pagination && pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
                  <Button
                    variant="outlined"
                    disabled={!pagination.hasPrev}
                    onClick={() => handlePageChange(searchFilters.page! - 1)}
                    sx={{
                      borderRadius: 0,
                      borderColor: '#e0e0e0',
                      color: '#666',
                      '&:hover': {
                        borderColor: '#1a1a1a',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 3 }}>
                    <Typography variant="body2" sx={{ color: '#666', letterSpacing: 1 }}>
                      Page {pagination.page} of {pagination.totalPages}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    disabled={!pagination.hasNext}
                    onClick={() => handlePageChange(searchFilters.page! + 1)}
                    sx={{
                      borderRadius: 0,
                      borderColor: '#e0e0e0',
                      color: '#666',
                      '&:hover': {
                        borderColor: '#1a1a1a',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 3, mt: 8 }}>
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
