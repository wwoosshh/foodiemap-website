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

const NewHomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [latestRestaurants, setLatestRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getHomeData();

      if (response.success && response.data) {
        setBanners(response.data.banners || []);
        setCategories(response.data.categories || []);
        setFeaturedRestaurants(response.data.featuredRestaurants || []);
        setLatestRestaurants(response.data.restaurants || []);
      }
    } catch (err: any) {
      setError(err.userMessage || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/restaurants?category=${categoryId}`);
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
          image={restaurant.images?.[0] || '/placeholder-restaurant.jpg'}
          alt={restaurant.name}
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
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
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

  return (
    <MainLayout>
      {/* 히어로 섹션 with 배너 */}
      {banners.length > 0 && (
        <Box sx={{ mb: 6 }}>
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

        {/* 카테고리 섹션 */}
        {categories.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
              카테고리
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" }, gap: 2 }}>
              {categories.map((category) => (
                <Box key={category.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      border: '2px solid transparent',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        transform: 'translateY(-4px)',
                      },
                    }}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 12px',
                          color: 'primary.main',
                        }}
                      >
                        <RestaurantIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Typography variant="body1" fontWeight={600}>
                        {category.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* 인기 맛집 섹션 */}
        {featuredRestaurants.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" fontWeight={700}>
                인기 맛집
              </Typography>
              <Button
                endIcon={<ArrowRightIcon />}
                onClick={() => navigate('/restaurants?sort=rating_desc')}
              >
                더보기
              </Button>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3 }}>
              {featuredRestaurants.slice(0, 4).map((restaurant) => (
                <Box key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* 최신 맛집 섹션 */}
        {latestRestaurants.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" fontWeight={700}>
                최신 맛집
              </Typography>
              <Button
                endIcon={<ArrowRightIcon />}
                onClick={() => navigate('/restaurants?sort=created_at_desc')}
              >
                더보기
              </Button>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3 }}>
              {latestRestaurants.slice(0, 8).map((restaurant) => (
                <Box key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* 통계 섹션 */}
        <Box
          sx={{
            py: 6,
            px: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            mb: 8,
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 4, textAlign: "center" }}>
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
