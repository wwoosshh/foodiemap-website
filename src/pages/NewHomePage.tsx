import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Alert,
  useTheme,
  alpha,
  Skeleton,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import BannerCarousel from '../components/BannerCarousel';
import { ApiService } from '../services/api';
import { Restaurant, Category, Banner } from '../types';
import {
  StarFilledIcon,
  LocationIcon,
  ArrowRightIcon,
  ReviewIcon,
  EyeIcon,
  HeartFilledIcon,
  NewIcon,
} from '../components/icons/CustomIcons';
import { DEFAULT_RESTAURANT_IMAGE, handleImageError } from '../constants/images';
import { useLanguage } from '../context/LanguageContext';

interface PushedRestaurant {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  badge_text?: string;
  badge_color?: string;
  restaurant: Restaurant;
}

const NewHomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t, language } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [pushedRestaurants, setPushedRestaurants] = useState<PushedRestaurant[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalReviews: 0,
    totalUsers: 0,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 다양한 알고리즘별 맛집 상태
  const [ratingRestaurants, setRatingRestaurants] = useState<Restaurant[]>([]);
  const [reviewCountRestaurants, setReviewCountRestaurants] = useState<Restaurant[]>([]);
  const [viewCountRestaurants, setViewCountRestaurants] = useState<Restaurant[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [latestRestaurants, setLatestRestaurants] = useState<Restaurant[]>([]);

  const loadRestaurantsByCategory = useCallback(async (categoryId: string | null) => {
    try {
      // 통합 API로 한 번에 모든 정렬 방식의 맛집 로드
      const params = categoryId ? { category_id: categoryId, limit: 10 } : { limit: 10 };

      const multiSortRes = await ApiService.getRestaurantsMultiSort(params);

      if (multiSortRes.success && multiSortRes.data) {
        setRatingRestaurants(multiSortRes.data.byRating || []);
        setReviewCountRestaurants(multiSortRes.data.byReviewCount || []);
        setViewCountRestaurants(multiSortRes.data.byViewCount || []);
        setFavoriteRestaurants(multiSortRes.data.byFavoriteCount || []);
        setLatestRestaurants(multiSortRes.data.byLatest || []);
      }
    } catch (err: any) {
      console.error('Failed to load restaurants:', err);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      // 배너, 푸시 맛집 로드
      const homeDataRes = await ApiService.getHomeData();

      if (homeDataRes.success && homeDataRes.data) {
        setBanners(homeDataRes.data.banners || []);
        setPushedRestaurants(homeDataRes.data.pushedRestaurants || []);
        setEvents(homeDataRes.data.events || []);
        setStats(homeDataRes.data.stats || { totalRestaurants: 0, totalReviews: 0, totalUsers: 0 });
        console.log('이벤트 데이터 로드:', homeDataRes.data.events);
      }

      // 언어별 카테고리 로드
      const categoriesRes = await ApiService.getCategoriesWithLang(language);
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data.categories || []);
      }

      // 전체 맛집 로드
      await loadRestaurantsByCategory(null);
    } catch (err: any) {
      setError(err.userMessage || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [loadRestaurantsByCategory, language]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    // 초기 로드가 완료되고, 카테고리가 변경되었을 때 실행 (null 포함)
    if (!isInitialLoad) {
      loadRestaurantsByCategory(selectedCategoryId);
    }
  }, [selectedCategoryId, isInitialLoad, loadRestaurantsByCategory]);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    // 자동 스크롤 제거
  };

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderRating = (rating: number) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <StarFilledIcon sx={{ fontSize: 18, color: '#FFD93D' }} />
        <Typography variant="body2" fontWeight={600}>
          {rating.toFixed(1)}
        </Typography>
      </Box>
    );
  };

  const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => (
    <Card
      sx={{
        position: 'relative',
        height: { xs: 180, sm: 200, md: 220 },
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 12px 32px rgba(255, 107, 107, 0.2)',
        },
      }}
      onClick={() => handleRestaurantClick(restaurant.id)}
    >
      {/* 배경 이미지 */}
      <CardMedia
        component="img"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
        image={restaurant.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
        alt={restaurant.name}
        onError={handleImageError}
      />

      {/* 그라데이션 오버레이 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      {/* 정보 오버레이 */}
      <CardContent
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          color: 'white',
          p: { xs: 2, md: 2.5 },
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1, color: 'white', fontSize: { xs: '1rem', md: '1.25rem' } }}>
            {restaurant.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
            <StarFilledIcon sx={{ fontSize: 18, color: '#FFD93D' }} />
            <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
              {restaurant.rating.toFixed(1)}
            </Typography>
          </Box>
        </Box>

        {restaurant.categories && (
          <Chip
            label={restaurant.categories.name}
            size="small"
            sx={{
              mb: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.9),
              color: '#FFFFFF',
              fontWeight: 600,
              border: 'none',
              height: { xs: 22, md: 24 },
              fontSize: { xs: '0.7rem', md: '0.8rem' },
            }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <LocationIcon sx={{ fontSize: { xs: 14, md: 16 }, color: 'white' }} />
          <Typography variant="caption" noWrap sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, color: 'white' }}>
            {restaurant.address}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' }, color: 'rgba(255,255,255,0.9)' }}>
            {t('restaurant.reviewCount')} {restaurant.review_count || 0}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' }, color: 'rgba(255,255,255,0.9)' }}>
            {t('restaurant.viewCount')} {restaurant.view_count || 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const RestaurantSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    restaurants: Restaurant[];
    sortParam: string;
  }> = ({ title, icon, restaurants, sortParam }) => {
    if (restaurants.length === 0) return null;

    return (
      <Box sx={{ mb: { xs: 4, md: 8 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              {icon}
            </Box>
            <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
              {title}
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowRightIcon />}
            onClick={() => {
              const categoryParam = selectedCategoryId ? `&category=${selectedCategoryId}` : '';
              navigate(`/restaurants?sort=${sortParam}${categoryParam}`);
            }}
            sx={{
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              px: { xs: 1, md: 2 },
            }}
          >
            {t('home.viewMore')}
          </Button>
        </Box>

        {/* 리스트 레이아웃 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {restaurants.slice(0, 8).map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
          <Skeleton variant="rectangular" sx={{ height: { xs: 200, md: 400 }, borderRadius: 2, mb: { xs: 2, md: 4 } }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: { xs: 2, md: 3 } }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton variant="rectangular" sx={{ height: { xs: 200, md: 300 }, borderRadius: 2 }} />
              </Box>
            ))}
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </MainLayout>
    );
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <MainLayout>
      {/* 모바일 검색바 - 배너 위 */}
      {isMobile && (
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, mt: 2 }}>
          <TextField
            fullWidth
            placeholder={t('search.placeholder') || '맛집을 검색해보세요...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    ×
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                borderRadius: 3,
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              },
            }}
          />
        </Container>
      )}

      {/* 배너 캐러셀 - 상단 여백 추가, PC 폭 제한 */}
      {banners.length > 0 && (
        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 2, md: 3 },
            mb: { xs: 4, md: 8 },
            px: { xs: 0, md: 3 },
          }}
        >
          <BannerCarousel banners={banners} />
        </Container>
      )}

      {/* 푸시 맛집 섹션 - 두 번째 배치 */}
      {pushedRestaurants.length > 0 && (
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
              theme.palette.secondary.main,
              0.08
            )} 100%)`,
            py: { xs: 3, md: 6 },
            mb: { xs: 3, md: 6 },
          }}
        >
          <Container maxWidth="xl">
            <Typography
              variant="h3"
              fontWeight={800}
              align="center"
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: { xs: 3, md: 5 },
                fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
              }}
            >
              {t('home.featuredTitle')}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: { xs: 2, md: 4 },
              }}
            >
              {pushedRestaurants.map((pushed, index) => (
                <Card
                  key={pushed.id}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                      transform: { xs: 'translateY(-4px)', md: 'translateY(-12px)' },
                      boxShadow: '0px 20px 40px rgba(255, 107, 107, 0.25)',
                    },
                  }}
                  onClick={() => handleRestaurantClick(pushed.restaurant.id)}
                >
                  {/* 배지 */}
                  {pushed.badge_text && (
                    <Chip
                      label={pushed.badge_text}
                      sx={{
                        position: 'absolute',
                        top: { xs: 12, md: 16 },
                        right: { xs: 12, md: 16 },
                        zIndex: 2,
                        backgroundColor: pushed.badge_color || '#FF6B6B',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', md: '0.85rem' },
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }}
                    />
                  )}

                  <CardMedia
                    component="img"
                    sx={{
                      height: { xs: 140, sm: 180, md: 250 },
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                    image={pushed.restaurant.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
                    alt={pushed.restaurant.name}
                    onError={handleImageError}
                  />

                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Typography variant="overline" color="primary" fontWeight={700} sx={{ display: 'block', mb: { xs: 0.5, md: 1 }, fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                      {pushed.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '0.95rem', md: '1.5rem' }, mb: { xs: 0.5, md: 1 } }}>
                      {pushed.restaurant.name}
                    </Typography>
                    {pushed.subtitle && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' }, lineHeight: 1.3 }}>
                        {pushed.subtitle}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: { xs: 1, md: 2 } }}>
                      {renderRating(pushed.restaurant.rating)}
                      <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 2 }, flexWrap: 'wrap' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                          {t('restaurant.reviewCount')} {pushed.restaurant.review_count || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                          {t('restaurant.viewCount')} {pushed.restaurant.view_count || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* 메인 콘텐츠 */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>

        {/* 메인 레이아웃: 콘텐츠 + 카테고리 사이드바 */}
        <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, position: 'relative' }}>
          {/* 메인 콘텐츠 영역 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* 선택된 카테고리 표시 */}
            {selectedCategoryId && selectedCategory && (
              <Box sx={{ mb: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, mb: 2 }}>
                  <Chip
                    label={selectedCategory.name}
                    onDelete={() => handleCategoryClick(null)}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '0.85rem', md: '1rem' },
                      py: { xs: 2, md: 2.5 },
                      '& .MuiChip-deleteIcon': {
                        color: 'white',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    {t('home.selectedCategory')}
                  </Typography>
                </Box>
                <Divider />
              </Box>
            )}

            {/* 다양한 알고리즘별 맛집 섹션 */}
            <RestaurantSection
              title={t.home.highRatedRestaurants}
              icon={<StarFilledIcon />}
              restaurants={ratingRestaurants}
              sortParam="rating_desc"
            />
            <RestaurantSection
              title={t('home.mostReviewedRestaurants')}
              icon={<ReviewIcon />}
              restaurants={reviewCountRestaurants}
              sortParam="review_count_desc"
            />
            <RestaurantSection
              title={t('home.mostViewedRestaurants')}
              icon={<EyeIcon />}
              restaurants={viewCountRestaurants}
              sortParam="view_count_desc"
            />
            <RestaurantSection
              title={t('home.mostLikedRestaurants')}
              icon={<HeartFilledIcon />}
              restaurants={favoriteRestaurants}
              sortParam="favorite_count_desc"
            />
            <RestaurantSection
              title={t('home.newRestaurants')}
              icon={<NewIcon />}
              restaurants={latestRestaurants}
              sortParam="created_at_desc"
            />
          </Box>

          {/* 우측 카테고리 사이드바 (Sticky) */}
          <Box
            sx={{
              width: 250,
              display: { xs: 'none', lg: 'block' },
            }}
          >
            <Paper
              elevation={2}
              sx={{
                position: 'sticky',
                top: 100,
                p: 3,
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1E1E1E 0%, #252525 100%)'
                  : 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F5 100%)',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                {t.home.categories}
              </Typography>

              {/* 전체 보기 버튼 */}
              <Button
                fullWidth
                variant={selectedCategoryId === null ? 'contained' : 'outlined'}
                onClick={() => handleCategoryClick(null)}
                sx={{
                  mb: 2,
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  py: 1.5,
                  fontWeight: selectedCategoryId === null ? 700 : 500,
                }}
              >
                {t('home.viewAll')}
              </Button>

              <Divider sx={{ my: 2 }} />

              {/* 카테고리 버튼들 - 2열 grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? 'contained' : 'outlined'}
                    onClick={() => handleCategoryClick(category.id)}
                    sx={{
                      py: 1,
                      px: 1.5,
                      fontSize: '0.85rem',
                      fontWeight: selectedCategoryId === category.id ? 700 : 500,
                      transition: 'all 0.2s ease',
                      minHeight: '42px',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Typography variant="caption" fontWeight="inherit" noWrap>
                      {category.name}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* 통계 섹션 */}
        <Box
          sx={{
            py: { xs: 3, sm: 4, md: 6 },
            px: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 2, md: 4 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            mb: { xs: 4, md: 8 },
            mt: { xs: 4, md: 8 },
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: { xs: 3, md: 4 }, textAlign: 'center' }}>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
                {stats.totalRestaurants.toLocaleString()}+
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{t('home.registeredRestaurants')}</Typography>
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
                {stats.totalReviews.toLocaleString()}+
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{t('home.writtenReviews')}</Typography>
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
                {stats.totalUsers.toLocaleString()}+
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{t('home.activeUsers')}</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default NewHomePage;
