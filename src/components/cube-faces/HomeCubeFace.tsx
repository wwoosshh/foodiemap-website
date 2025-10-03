import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Button, CircularProgress } from '@mui/material';
import { Restaurant as RestaurantIcon, TrendingUp } from '@mui/icons-material';
import BannerCarousel from '../BannerCarousel';
import { ApiService } from '../../services/api';
import { Banner } from '../../types';

interface HomeCubeFaceProps {
  onNavigate: (face: string) => void;
}

const HomeCubeFace: React.FC<HomeCubeFaceProps> = ({ onNavigate }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const response = await ApiService.getHomeData();
        if (response.success && response.data) {
          setBanners(response.data.banners || []);
          setFeaturedRestaurants(response.data.featuredRestaurants?.slice(0, 6) || []);
        }
      } catch (error) {
        console.error('홈 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#fafafa',
      }}
    >
      {/* 배너 캐러셀 */}
      <Box sx={{ mb: 4 }}>
        <BannerCarousel banners={banners} />
      </Box>

      <Container maxWidth="lg">
        {/* 서비스 소개 */}
        <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
          <Typography variant="h3" gutterBottom fontWeight={700}>
            Cube
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            3D로 탐색하는 새로운 맛집 경험
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            카테고리별로 분류된 맛집을 3D 큐브를 회전하며 탐색해보세요
          </Typography>
        </Box>

        {/* 추천 맛집 */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight={600}>
              추천 맛집
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {featuredRestaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={restaurant.image_url || '/placeholder-restaurant.jpg'}
                    alt={restaurant.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>
                      {restaurant.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {restaurant.address}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" color="primary" fontWeight={600}>
                        평점: {restaurant.rating || 'N/A'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* 탐색 시작 버튼 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<RestaurantIcon />}
            onClick={() => onNavigate('category')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            맛집 탐색 시작하기
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeCubeFace;
