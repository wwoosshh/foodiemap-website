import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import { LocationOn, Phone, Star } from '@mui/icons-material';
import { ApiService } from '../services/api';
import { Restaurant } from '../types';

interface RestaurantGridProps {
  category?: string;
  limit?: number;
  title?: string;
}

const RestaurantGrid: React.FC<RestaurantGridProps> = ({
  category,
  limit = 12,
  title = "인기 맛집"
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRestaurants();
  }, [category, limit]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await ApiService.getPublicRestaurants({
        limit,
        category: category || undefined,
      });

      if (response.success && response.data) {
        // PaginationData 구조에서 restaurants 배열 추출
        const restaurantList = response.data.restaurants || response.data.items || [];
        setRestaurants(restaurantList);
      } else {
        throw new Error(response.message || '맛집 데이터를 불러올 수 없습니다.');
      }
    } catch (err: any) {
      console.error('맛집 데이터 로딩 실패:', err);
      setError(err.message || '맛집 데이터를 불러오는 중 오류가 발생했습니다.');
      // 에러 시 더미 데이터 표시
      setRestaurants(generateDummyRestaurants(limit));
    } finally {
      setLoading(false);
    }
  };

  // 더미 데이터 생성 (API 오류 시 대체용)
  const generateDummyRestaurants = (count: number): Restaurant[] => {
    const dummyCategories = ['한식', '중식', '일식', '양식', '카페', '치킨', '피자'];
    const dummyNames = [
      '맛있는 한식당', '서울 불고기', '전주 비빔밥', '부산 회센터',
      '이탈리아 파스타', '도쿄 라멘', '베이징 짜장면', '프랑스 비스트로',
      '홍콩 딤섬', '태국 팟타이', '인도 커리', '멕시코 타코'
    ];

    return Array.from({ length: Math.min(count, 12) }, (_, index) => ({
      id: `dummy-${index}`,
      name: dummyNames[index] || `맛집 ${index + 1}`,
      description: '신선한 재료로 만드는 정통 요리를 맛보세요.',
      address: `서울시 강남구 ${index + 1}번지`,
      phone: `02-${1000 + index}-${1000 + index}`,
      category_id: index % 7 + 1,
      rating: 4.0 + (Math.random() * 1.0),
      review_count: Math.floor(Math.random() * 200) + 10,
      images: [`/api/placeholder/restaurant-${index % 5 + 1}.jpg`],
      created_at: new Date().toISOString(),
      categories: {
        id: index % 7 + 1,
        name: dummyCategories[index % 7],
        icon: '🍽️'
      }
    }));
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    console.log('맛집 클릭:', restaurant.name);
    // TODO: 맛집 상세 페이지로 이동
  };

  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight={600}>
          {title}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
            mt: 2
          }}
        >
          {Array.from({ length: limit }, (_, index) => (
            <Card key={index}>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight={600}>
        {title}
      </Typography>

      {error && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          🔧 현재 서비스 점검 중입니다. 샘플 데이터를 표시합니다.
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3,
          mt: 2
        }}
      >
        {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <CardMedia
                component="img"
                height="200"
                image={restaurant.images?.[0] || '/api/placeholder/600/400'}
                alt={restaurant.name}
                sx={{
                  objectFit: 'cover',
                  backgroundColor: 'grey.200'
                }}
                onError={(e: any) => {
                  e.target.src = '/api/placeholder/600/400';
                }}
              />
              <CardContent sx={{ p: 2, pb: 2 }}>
                {/* 카테고리 */}
                {restaurant.categories && (
                  <Chip
                    label={restaurant.categories.name}
                    size="small"
                    sx={{
                      mb: 1,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}
                  />
                )}

                {/* 맛집 이름 */}
                <Typography
                  variant="h6"
                  component="h3"
                  noWrap
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    mb: 1,
                    color: 'text.primary'
                  }}
                >
                  {restaurant.name}
                </Typography>

                {/* 평점 및 리뷰 수 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Star sx={{ color: '#ffc107', fontSize: '1.2rem', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                    {restaurant.rating.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({restaurant.review_count}개 리뷰)
                  </Typography>
                </Box>

                {/* 주소 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{ fontSize: '0.85rem' }}
                  >
                    {restaurant.address}
                  </Typography>
                </Box>

                {/* 전화번호 */}
                {restaurant.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: '0.85rem' }}
                    >
                      {restaurant.phone}
                    </Typography>
                  </Box>
                )}

                {/* 설명 */}
                {restaurant.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      fontSize: '0.85rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {restaurant.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
        ))}
      </Box>

      {/* 더보기 버튼 */}
      {restaurants.length >= limit && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => console.log('더보기 클릭')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            더 많은 맛집 보기
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RestaurantGrid;