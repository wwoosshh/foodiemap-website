import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Skeleton,
} from '@mui/material';
import { ApiService } from '../services/api';
import { Restaurant } from '../types';
import RestaurantDetailModal from './RestaurantDetailModal';

interface FeaturedRestaurantsProps {
  restaurants: Restaurant[];
}

const FeaturedRestaurants: React.FC<FeaturedRestaurantsProps> = ({ restaurants }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const loading = false; // props로 받으므로 로딩 없음

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
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
          Featured
        </Typography>
        <Box sx={{ width: 40, height: 1, backgroundColor: '#000', mx: 'auto', mb: 6 }} />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4
          }}
        >
          {[1, 2, 3].map((index) => (
            <Card key={index} sx={{ borderRadius: 1, border: '1px solid #f0f0f0' }}>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    );
  }

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setDetailModalOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
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
        Featured
      </Typography>
      <Box sx={{ width: 40, height: 1, backgroundColor: '#000', mx: 'auto', mb: 2 }} />
      <Typography
        variant="body1"
        sx={{
          mb: 6,
          textAlign: 'center',
          color: '#666',
          fontSize: '1rem',
          letterSpacing: 1,
          fontWeight: 300,
          fontStyle: 'italic'
        }}
      >
        Our most highly rated establishments
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4
        }}
      >
        {restaurants.map((restaurant, index) => (
          <Card
            key={restaurant.id}
            sx={{
              cursor: 'pointer',
              borderRadius: 1,
              border: '1px solid #f0f0f0',
              boxShadow: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: '#ffffff',
              position: 'relative',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                borderColor: '#e0e0e0'
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
                backgroundColor: '#f8f8f8',
                borderBottom: '1px solid #f0f0f0'
              }}
              onError={(e: any) => {
                e.target.src = '/api/placeholder/600/400';
              }}
            />
            <CardContent sx={{ p: 3 }}>
              {/* 순위 표시 */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                {index + 1}
              </Box>

              {/* 카테고리 */}
              {restaurant.categories && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#666',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    mb: 1.5,
                    display: 'block'
                  }}
                >
                  {restaurant.categories.name}
                </Typography>
              )}

              {/* 맛집 이름 */}
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  mb: 1.5,
                  color: '#1a1a1a',
                  lineHeight: 1.3,
                  fontFamily: '"Noto Sans KR", "Inter", sans-serif'
                }}
              >
                {restaurant.name}
              </Typography>

              {/* 평점 */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#2e7d32',
                    mr: 1
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: '#333',
                    mr: 2
                  }}
                >
                  {restaurant.rating.toFixed(1)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '0.85rem'
                  }}
                >
                  {restaurant.review_count} Reviews
                </Typography>
              </Box>

              {/* 주소 */}
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                  fontSize: '0.85rem',
                  lineHeight: 1.4
                }}
              >
                {restaurant.address}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 맛집 상세 모달 */}
      <RestaurantDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        restaurant={selectedRestaurant}
      />
    </Container>
  );
};

export default FeaturedRestaurants;