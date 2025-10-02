import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { Restaurant } from '../types';
import RestaurantDetailModal from './RestaurantDetailModal';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  limit?: number;
  title?: string;
  showTitle?: boolean;
}

const RestaurantGrid: React.FC<RestaurantGridProps> = ({
  restaurants,
  limit = 20,
  title = "Restaurants",
  showTitle = true
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // 빈 상태를 위한 메시지 컴포넌트
  const renderEmptyState = () => (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        backgroundColor: 'grey.50',
        borderRadius: 2,
        border: '1px solid #f0f0f0'
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: 'text.secondary',
          fontWeight: 300,
          letterSpacing: 1.5,
          mb: 2
        }}
      >
        NO RESTAURANTS FOUND
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Try adjusting your search criteria
      </Typography>
    </Box>
  );

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setDetailModalOpen(true);
  };

  // 표시할 맛집 목록
  const displayRestaurants = restaurants.slice(0, limit);

  return (
    <Box sx={{ py: showTitle ? 6 : 3 }}>
      {showTitle && (
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
          {title}
        </Typography>
      )}
      {showTitle && <Box sx={{ width: 40, height: 1, backgroundColor: '#000', mx: 'auto', mb: 6 }} />}

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
        {displayRestaurants.length === 0 ? (
          renderEmptyState()
        ) : (
          displayRestaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              sx={{
                height: '100%',
                cursor: 'pointer',
                borderRadius: 1,
                border: '1px solid #f0f0f0',
                boxShadow: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: '#ffffff',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  borderColor: '#e0e0e0'
                }
              }}
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <CardMedia
                component="img"
                height="240"
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
              <CardContent sx={{ p: 3, pb: 3 }}>
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
                    fontSize: '1.25rem',
                    mb: 2,
                    color: '#1a1a1a',
                    lineHeight: 1.3,
                    fontFamily: '"Noto Sans KR", "Inter", sans-serif'
                  }}
                >
                  {restaurant.name}
                </Typography>

                {/* 평점, 리뷰 수, 조회수, 즐겨찾기 수 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: restaurant.rating >= 4.5 ? '#2e7d32' : restaurant.rating >= 4.0 ? '#ed6c02' : '#d32f2f',
                        mr: 1
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: '#333'
                      }}
                    >
                      {restaurant.rating.toFixed(1)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      fontSize: '0.85rem',
                      fontWeight: 400
                    }}
                  >
                    {restaurant.review_count} Reviews
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      fontSize: '0.85rem',
                      fontWeight: 400
                    }}
                  >
                    • {restaurant.view_count || 0} Views
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      fontSize: '0.85rem',
                      fontWeight: 400
                    }}
                  >
                    • {restaurant.favorite_count || 0} Favorites
                  </Typography>
                </Box>

                {/* 주소 */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '0.9rem',
                    mb: 1,
                    fontWeight: 400,
                    lineHeight: 1.4
                  }}
                >
                  {restaurant.address}
                </Typography>

                {/* 설명 */}
                {restaurant.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#999',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontWeight: 400,
                      mt: 1.5
                    }}
                  >
                    {restaurant.description}
                  </Typography>
                )}

                {/* 전화번호 */}
                {restaurant.phone && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      fontSize: '0.85rem',
                      mt: 1.5,
                      fontFamily: 'monospace',
                      letterSpacing: 0.5
                    }}
                  >
                    {restaurant.phone}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* 맛집 상세 모달 */}
      <RestaurantDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        restaurant={selectedRestaurant}
      />
    </Box>
  );
};

export default RestaurantGrid;
