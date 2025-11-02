import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Chip,
  Alert,
  useTheme,
  alpha,
  Skeleton,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import BannerCarousel from '../components/BannerCarousel';
import { ApiService } from '../services/api';
import { Restaurant, Category, Banner } from '../types';
import {
  StarFilledIcon,
  LocationIcon,
  RestaurantIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ReviewIcon,
  EyeIcon,
  HeartFilledIcon,
  NewIcon,
} from '../components/icons/CustomIcons';
import { DEFAULT_RESTAURANT_IMAGE, handleImageError } from '../constants/images';

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [pushedRestaurants, setPushedRestaurants] = useState<PushedRestaurant[]>([]);
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

  const loadRestaurantsByCategory = useCallback(async (categoryId: number | null) => {
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
      // 배너, 카테고리, 푸시 맛집 로드
      const homeDataRes = await ApiService.getHomeData();

      if (homeDataRes.success && homeDataRes.data) {
        setBanners(homeDataRes.data.banners || []);
        setCategories(homeDataRes.data.categories || []);
        setPushedRestaurants(homeDataRes.data.pushedRestaurants || []);
        setStats(homeDataRes.data.stats || { totalRestaurants: 0, totalReviews: 0, totalUsers: 0 });
      }

      // 전체 맛집 로드
      await loadRestaurantsByCategory(null);
    } catch (err: any) {
      setError(err.userMessage || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [loadRestaurantsByCategory]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    // 초기 로드가 완료되고, 카테고리가 실제로 변경되었을 때만 실행
    if (!isInitialLoad && selectedCategoryId !== null) {
      loadRestaurantsByCategory(selectedCategoryId);
    }
  }, [selectedCategoryId, isInitialLoad, loadRestaurantsByCategory]);

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurants/${restaurantId}`);
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
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardActionArea onClick={() => handleRestaurantClick(restaurant.id)}>
        <CardMedia
          component="img"
          sx={{
            height: { xs: 140, sm: 180, md: 200 },
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
        <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, md: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 0.5 }}>
            <Typography variant="h6" fontWeight={700} sx={{ flex: 1, fontSize: { xs: '0.95rem', md: '1.25rem' } }}>
              {restaurant.name}
            </Typography>
            {renderRating(restaurant.rating)}
          </Box>

          {restaurant.categories && (
            <Chip
              label={restaurant.categories.name}
              size="small"
              sx={{
                mb: 1,
                backgroundColor: theme.palette.primary.main,
                color: '#FFFFFF',
                fontWeight: 600,
                border: 'none',
                height: { xs: 20, md: 24 },
                fontSize: { xs: '0.7rem', md: '0.8125rem' },
              }}
            />
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: { xs: 1, md: 2 },
              WebkitBoxOrient: 'vertical',
              minHeight: { xs: '20px', md: '40px' },
              fontSize: { xs: '0.8rem', md: '0.875rem' },
            }}
          >
            {restaurant.description || '맛있는 음식을 만나보세요'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
            <LocationIcon sx={{ fontSize: { xs: 12, md: 16 } }} />
            <Typography variant="caption" noWrap sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              {restaurant.address}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              리뷰 {restaurant.review_count || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              조회 {restaurant.view_count || 0}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  const RestaurantSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    restaurants: Restaurant[];
    sortParam: string;
  }> = ({ title, icon, restaurants, sortParam }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const scrollAmount = 240; // 카드 너비 + gap
        scrollRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        });
      }
    };

    if (restaurants.length === 0) return null;

    return (
      <Box sx={{ mb: { xs: 4, md: 8 }, position: 'relative' }}>
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
            더보기
          </Button>
        </Box>

        {/* 캐러셀 컨트롤 */}
        <Box sx={{ position: 'relative' }}>
          {/* 왼쪽 버튼 - 모바일에서 숨김 */}
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'white',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: 'white',
                boxShadow: 6,
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* 가로 스크롤 캐러셀 */}
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              gap: { xs: 2, md: 3 },
              overflowX: 'auto',
              overflowY: 'hidden',
              pb: 2,
              scrollbarWidth: { xs: 'none', md: 'thin' },
              '&::-webkit-scrollbar': {
                height: { xs: 0, md: 8 },
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: alpha(theme.palette.primary.main, 0.5),
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            }}
          >
            {restaurants.slice(0, 10).map((restaurant) => (
              <Box
                key={restaurant.id}
                sx={{
                  minWidth: { xs: '220px', sm: '240px', md: '280px' },
                  maxWidth: { xs: '220px', sm: '240px', md: '280px' },
                  flex: '0 0 auto',
                }}
              >
                <RestaurantCard restaurant={restaurant} />
              </Box>
            ))}
          </Box>

          {/* 오른쪽 버튼 - 모바일에서 숨김 */}
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'white',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: 'white',
                boxShadow: 6,
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
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
      {/* 히어로 텍스트 - 최상단 배치 */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2, md: 4 },
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
              theme.palette.secondary.main,
              0.05
            )} 100%)`,
            borderRadius: { xs: 2, md: 4 },
            mb: { xs: 4, md: 8 },
            mt: { xs: 2, md: 3 },
          }}
        >
          <Typography
            variant="h2"
            fontWeight={800}
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.75rem' },
            }}
          >
            당신의 맛있는 순간
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: { xs: 3, md: 4 }, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            전국의 숨은 맛집을 찾아보세요
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRightIcon />}
            onClick={() => navigate('/restaurants')}
            sx={{
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: '0.9rem', md: '1.1rem' },
            }}
          >
            맛집 탐색하기
          </Button>
        </Box>
      </Container>

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
              지금 꼭 가봐야 할 맛집
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
                      height: { xs: 180, sm: 220, md: 250 },
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

                  <CardContent sx={{ p: { xs: 2, md: 2 } }}>
                    <Typography variant="overline" color="primary" fontWeight={700} sx={{ display: 'block', mb: 1, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                      {pushed.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
                      {pushed.restaurant.name}
                    </Typography>
                    {pushed.subtitle && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                        {pushed.subtitle}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                      {renderRating(pushed.restaurant.rating)}
                      <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                          리뷰 {pushed.restaurant.review_count || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                          조회 {pushed.restaurant.view_count || 0}
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

      {/* 배너 캐러셀 - 세 번째 배치 */}
      {banners.length > 0 && (
        <Box sx={{ mb: { xs: 4, md: 8 } }}>
          <BannerCarousel banners={banners} />
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
                    선택된 카테고리
                  </Typography>
                </Box>
                <Divider />
              </Box>
            )}

            {/* 다양한 알고리즘별 맛집 섹션 */}
            <RestaurantSection
              title="별점이 높은 맛집"
              icon={<StarFilledIcon />}
              restaurants={ratingRestaurants}
              sortParam="rating_desc"
            />
            <RestaurantSection
              title="리뷰가 많은 맛집"
              icon={<ReviewIcon />}
              restaurants={reviewCountRestaurants}
              sortParam="review_count_desc"
            />
            <RestaurantSection
              title="조회수가 많은 맛집"
              icon={<EyeIcon />}
              restaurants={viewCountRestaurants}
              sortParam="view_count_desc"
            />
            <RestaurantSection
              title="좋아요가 많은 맛집"
              icon={<HeartFilledIcon />}
              restaurants={favoriteRestaurants}
              sortParam="favorite_count_desc"
            />
            <RestaurantSection
              title="최신 맛집"
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
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F5 100%)',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                카테고리
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
                전체 보기
              </Button>

              <Divider sx={{ my: 2 }} />

              {/* 카테고리 버튼들 - 2열 grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? 'contained' : 'outlined'}
                    onClick={() => handleCategoryClick(category.id)}
                    startIcon={<RestaurantIcon sx={{ fontSize: 16 }} />}
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
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>등록된 맛집</Typography>
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
                {stats.totalReviews.toLocaleString()}+
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>작성된 리뷰</Typography>
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
                {stats.totalUsers.toLocaleString()}+
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>활성 사용자</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default NewHomePage;
