import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { Restaurant } from '../types';
import RestaurantDetailModal from './RestaurantDetailModal';

// 카테고리별 Material-UI 아이콘 매핑 (이모티콘 대신 커스텀 아이콘 사용)
const getCategoryIconText = (categoryName?: string): string => {
  const iconMap: Record<string, string> = {
    '한식': 'KR',
    '중식': 'CH',
    '일식': 'JP',
    '양식': 'WS',
    '분식': 'ST',
    '치킨': 'CK',
    '피자': 'PZ',
    '카페': 'CF',
    '디저트': 'DS',
    '기타': 'ETC'
  };
  return categoryName ? (iconMap[categoryName] || 'FD') : 'FD';
};

// 대체 이미지 생성 함수 (텍스트 아이콘 사용)
const generateFallbackImage = (restaurantName: string, categoryName?: string): string => {
  const iconText = getCategoryIconText(categoryName);
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f5f5f5"/>
      <circle cx="300" cy="150" r="50" fill="#e0e0e0"/>
      <text x="50%" y="38%" font-family="Arial, sans-serif" font-size="24" font-weight="600" text-anchor="middle" fill="#999">
        ${iconText}
      </text>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#666">
        ${restaurantName}
      </text>
    </svg>
  `)}`;
};

interface RestaurantGridProps {
  restaurants: Restaurant[];
  limit?: number;
  title?: string;
  showTitle?: boolean;
  loading?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange?: (page: number) => void;
}

const RestaurantGrid: React.FC<RestaurantGridProps> = ({
  restaurants,
  limit = 20,
  title = "Restaurants",
  showTitle = true,
  loading = false,
  pagination,
  onPageChange
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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

  const handleImageError = (restaurantId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [restaurantId]: true
    }));
  };

  const getImageSrc = (restaurant: Restaurant): string => {
    if (imageErrors[restaurant.id] || !restaurant.images || restaurant.images.length === 0) {
      return generateFallbackImage(restaurant.name, restaurant.categories?.name);
    }
    return restaurant.images[0];
  };

  // 표시할 맛집 목록
  const displayRestaurants = restaurants.slice(0, limit);

  return (
    <Box sx={{ py: showTitle ? 6 : 3, pointerEvents: 'auto' }}>
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

      {/* 로딩 상태 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ color: '#1a1a1a' }} />
        </Box>
      ) : (
        <>
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
              mt: 2,
            }}
          >
            {displayRestaurants.length === 0 ? (
              renderEmptyState()
            ) : (
              displayRestaurants.map((restaurant) => (
            <Box
              key={restaurant.id}
              onClick={() => handleRestaurantClick(restaurant)}
              sx={{
                height: '100%',
                cursor: 'pointer',
                borderRadius: 1,
                border: '1px solid #f0f0f0',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  borderColor: '#1a1a1a',
                  boxShadow: '0 0 0 1px #1a1a1a',
                }
              }}
            >
              <Box
                component="img"
                src={getImageSrc(restaurant)}
                alt={restaurant.name}
                onError={() => handleImageError(restaurant.id)}
                sx={{
                  width: '100%',
                  height: 240,
                  objectFit: 'cover',
                  backgroundColor: '#f8f8f8',
                  borderBottom: '1px solid #f0f0f0',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ p: 3, pb: 3 }}>
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
              </Box>
            </Box>
              ))
            )}
          </Box>

          {/* 페이지네이션 */}
          {pagination && pagination.totalPages > 1 && onPageChange && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
              <Button
                variant="outlined"
                disabled={!pagination.hasPrev}
                onClick={() => onPageChange(pagination.page - 1)}
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
                onClick={() => onPageChange(pagination.page + 1)}
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
