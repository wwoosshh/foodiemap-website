import React, { useState, useEffect } from 'react';
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
} from '../components/icons/CustomIcons';

const DEFAULT_RESTAURANT_IMAGE = 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=%EB%A7%9B%EC%A7%91+%EC%9D%B4%EB%AF%B8%EC%A7%80';

const NewHomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // 다양한 알고리즘별 맛집 상태
  const [ratingRestaurants, setRatingRestaurants] = useState<Restaurant[]>([]);
  const [reviewCountRestaurants, setReviewCountRestaurants] = useState<Restaurant[]>([]);
  const [viewCountRestaurants, setViewCountRestaurants] = useState<Restaurant[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [latestRestaurants, setLatestRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadRestaurantsByCategory(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // 배너와 카테고리만 먼저 로드
      const [bannersRes, categoriesRes] = await Promise.all([
        ApiService.getPublicBanners(),
        ApiService.getPublicCategories(),
      ]);

      if (bannersRes.success) setBanners(bannersRes.data.banners || []);
      if (categoriesRes.success) setCategories(categoriesRes.data.categories || []);

      // 전체 맛집 로드
      await loadRestaurantsByCategory(null);
    } catch (err: any) {
      setError(err.userMessage || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurantsByCategory = async (categoryId: number | null) => {
    try {
      // 다양한 정렬 기준으로 맛집 로드
      const params = categoryId ? { category_id: categoryId, limit: 8 } : { limit: 8 };

      const [ratingRes, reviewRes, viewRes, favoriteRes, latestRes] = await Promise.all([
        ApiService.getRestaurants({ ...params, sort: 'rating_desc' }),
        ApiService.getRestaurants({ ...params, sort: 'review_count_desc' }),
        ApiService.getRestaurants({ ...params, sort: 'view_count_desc' }),
        ApiService.getRestaurants({ ...params, sort: 'favorite_count_desc' }),
        ApiService.getRestaurants({ ...params, sort: 'created_at_desc' }),
      ]);

      if (ratingRes.success && ratingRes.data) {
        setRatingRestaurants(ratingRes.data.restaurants || []);
      }
      if (reviewRes.success && reviewRes.data) {
        setReviewCountRestaurants(reviewRes.data.restaurants || []);
      }
      if (viewRes.success && viewRes.data) {
        setViewCountRestaurants(viewRes.data.restaurants || []);
      }
      if (favoriteRes.success && favoriteRes.data) {
        setFavoriteRestaurants(favoriteRes.data.restaurants || []);
      }
      if (latestRes.success && latestRes.data) {
        setLatestRestaurants(latestRes.data.restaurants || []);
      }
    } catch (err: any) {
      console.error('Failed to load restaurants:', err);
    }
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    // 페이지 상단으로 스크롤
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
          height="200"
          image={restaurant.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
          alt={restaurant.name}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = DEFAULT_RESTAURANT_IMAGE;
          }}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ flex: 1 }}>
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
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.dark,
                fontWeight: 600,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
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
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '40px',
            }}
          >
            {restaurant.description || '맛있는 음식을 만나보세요'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <LocationIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" noWrap>
              {restaurant.address}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              리뷰 {restaurant.review_count || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              조회 {restaurant.view_count || 0}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  const RestaurantSection: React.FC<{
    title: string;
    restaurants: Restaurant[];
    sortParam: string;
  }> = ({ title, restaurants, sortParam }) => {
    if (restaurants.length === 0) return null;

    return (
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
          <Button
            endIcon={<ArrowRightIcon />}
            onClick={() => {
              const categoryParam = selectedCategoryId ? `&category=${selectedCategoryId}` : '';
              navigate(`/restaurants?sort=${sortParam}${categoryParam}`);
            }}
          >
            더보기
          </Button>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {restaurants.slice(0, 8).map((restaurant) => (
            <Box key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 4 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
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
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </MainLayout>
    );
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <MainLayout>
      {/* 히어로 섹션 with 배너 */}
      {banners.length > 0 && (
        <Box sx={{ mb: 8, mt: 3 }}>
          <BannerCarousel banners={banners} />
        </Box>
      )}

      {/* 히어로 텍스트 */}
      <Container maxWidth="xl">
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
              theme.palette.secondary.main,
              0.05
            )} 100%)`,
            borderRadius: 4,
            mb: 8,
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
            }}
          >
            당신의 맛있는 순간
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            전국의 숨은 맛집을 찾아보세요
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRightIcon />}
            onClick={() => navigate('/restaurants')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            맛집 탐색하기
          </Button>
        </Box>

        {/* 메인 레이아웃: 콘텐츠 + 카테고리 사이드바 */}
        <Box sx={{ display: 'flex', gap: 4, position: 'relative' }}>
          {/* 메인 콘텐츠 영역 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* 선택된 카테고리 표시 */}
            {selectedCategoryId && selectedCategory && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={selectedCategory.name}
                    onDelete={() => handleCategoryClick(null)}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      py: 2.5,
                      '& .MuiChip-deleteIcon': {
                        color: 'white',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    선택된 카테고리
                  </Typography>
                </Box>
                <Divider />
              </Box>
            )}

            {/* 다양한 알고리즘별 맛집 섹션 */}
            <RestaurantSection
              title="⭐ 별점이 높은 맛집"
              restaurants={ratingRestaurants}
              sortParam="rating_desc"
            />
            <RestaurantSection
              title="💬 리뷰가 많은 맛집"
              restaurants={reviewCountRestaurants}
              sortParam="review_count_desc"
            />
            <RestaurantSection
              title="👀 조회수가 많은 맛집"
              restaurants={viewCountRestaurants}
              sortParam="view_count_desc"
            />
            <RestaurantSection
              title="❤️ 좋아요가 많은 맛집"
              restaurants={favoriteRestaurants}
              sortParam="favorite_count_desc"
            />
            <RestaurantSection
              title="🆕 최신 맛집"
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

              {/* 카테고리 버튼들 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    fullWidth
                    variant={selectedCategoryId === category.id ? 'contained' : 'outlined'}
                    onClick={() => handleCategoryClick(category.id)}
                    startIcon={<RestaurantIcon />}
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      py: 1.5,
                      fontWeight: selectedCategoryId === category.id ? 700 : 500,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* 통계 섹션 */}
        <Box
          sx={{
            py: 6,
            px: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            mb: 8,
            mt: 8,
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 4, textAlign: 'center' }}>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                1,000+
              </Typography>
              <Typography variant="h6">등록된 맛집</Typography>
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                10,000+
              </Typography>
              <Typography variant="h6">작성된 리뷰</Typography>
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                5,000+
              </Typography>
              <Typography variant="h6">활성 사용자</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default NewHomePage;
