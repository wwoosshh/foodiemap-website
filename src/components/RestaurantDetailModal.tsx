import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Rating,
  Button,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn,
  Phone,
  AccessTime,
  Language,
  Wifi,
  LocalShipping,
  Bookmark,
  BookmarkBorder,
  Share,
  Directions,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { Restaurant } from '../types';
import { ApiService } from '../services/api';
import RestaurantComments from './RestaurantComments';
import RestaurantReviews from './RestaurantReviews';

// 카테고리별 기본 아이콘 매핑
const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    '한식': '🍚',
    '중식': '🥢',
    '일식': '🍣',
    '양식': '🍝',
    '분식': '🌮',
    '치킨': '🍗',
    '피자': '🍕',
    '카페': '☕',
    '디저트': '🧁',
    '기타': '🍽️'
  };
  return iconMap[categoryName] || '🍽️';
};

interface RestaurantDetailModalProps {
  open: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
}

interface RestaurantDetail {
  id: string;
  restaurant_id: string;
  road_address?: string;
  business_hours?: Record<string, string>;
  menu_info?: Array<{
    name: string;
    price: number;
    description: string;
  }>;
  price_range?: string;
  signature_menu?: string[];
  gallery_images?: string[];
  website_url?: string;
  wifi_available?: boolean;
  delivery_available?: boolean;
  takeout_available?: boolean;
  reservation_available?: boolean;
  directions?: string;
  nearby_landmarks?: string;
  total_views?: number;
  total_favorites?: number;
  total_comments?: number;
  total_reviews?: number;
  average_rating?: number;
}

const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  open,
  onClose,
  restaurant
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [restaurantDetail, setRestaurantDetail] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (restaurant && open) {
      loadRestaurantDetail(restaurant.id);
    }
  }, [restaurant, open]);

  const loadRestaurantDetail = async (restaurantId: string) => {
    try {
      setLoading(true);
      // TODO: API 연동 구현 필요
      // const response = await ApiService.getRestaurantDetail(restaurantId);
      // setRestaurantDetail(response.data);

      // 임시 더미 데이터
      setRestaurantDetail({
        id: 'detail-1',
        restaurant_id: restaurantId,
        road_address: '서울특별시 강남구 테헤란로 123 (역삼동)',
        business_hours: {
          mon: '11:00-22:00',
          tue: '11:00-22:00',
          wed: '11:00-22:00',
          thu: '11:00-22:00',
          fri: '11:00-23:00',
          sat: '11:00-23:00',
          sun: '12:00-21:00'
        },
        menu_info: [
          { name: '대표메뉴 1', price: 15000, description: '맛있는 대표메뉴입니다.' },
          { name: '인기메뉴 2', price: 12000, description: '많은 분들이 좋아하는 메뉴입니다.' },
          { name: '추천메뉴 3', price: 18000, description: '셰프가 추천하는 특별한 메뉴입니다.' }
        ],
        price_range: '10,000-20,000원',
        signature_menu: ['대표메뉴 1', '인기메뉴 2'],
        wifi_available: true,
        delivery_available: true,
        takeout_available: true,
        reservation_available: true,
        directions: '지하철 2호선 강남역 1번 출구에서 도보 5분',
        nearby_landmarks: '강남역, 교보타워',
        total_views: 1234,
        total_favorites: 89,
        total_comments: 45,
        total_reviews: 67,
        average_rating: 4.5
      });
    } catch (error) {
      console.error('맛집 상세 정보 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (imageUrl: string) => {
    setImageError(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  const getImageSrc = (imageUrl: string, fallbackType: 'restaurant' | 'menu' = 'restaurant') => {
    if (imageError[imageUrl]) {
      // 카테고리별 기본 이미지 반환
      const categoryIcon = restaurant?.categories?.name
        ? getCategoryIcon(restaurant.categories.name)
        : '🍽️';

      return `data:image/svg+xml,${encodeURIComponent(`
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f5f5f5"/>
          <text x="50%" y="45%" font-family="Arial" font-size="48" text-anchor="middle" fill="#999">
            ${categoryIcon}
          </text>
          <text x="50%" y="65%" font-family="Arial" font-size="14" text-anchor="middle" fill="#666">
            ${fallbackType === 'restaurant' ? 'Restaurant Image' : 'Menu Image'}
          </text>
        </svg>
      `)}`;
    }
    return imageUrl;
  };

  const formatBusinessHours = (hours: Record<string, string>) => {
    const dayNames = {
      mon: '월', tue: '화', wed: '수', thu: '목',
      fri: '금', sat: '토', sun: '일'
    };

    return Object.entries(hours).map(([day, time]) => (
      <Typography key={day} variant="body2" sx={{ mb: 0.5 }}>
        <strong>{dayNames[day as keyof typeof dayNames]}:</strong> {time === 'closed' ? '휴무' : time}
      </Typography>
    ));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  if (!restaurant) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
          margin: { xs: 1, sm: 2 }
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* 헤더 */}
        <Box
          sx={{
            position: 'relative',
            height: 300,
            backgroundImage: `url(${getImageSrc(restaurant.images?.[0] || '', 'restaurant')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px 8px 0 0'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
              borderRadius: '8px 8px 0 0'
            }}
          />

          {/* 닫기 버튼 */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* 액션 버튼들 */}
          <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setIsFavorited(!isFavorited)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
              }}
            >
              {isFavorited ? <Bookmark sx={{ color: '#ff6b6b' }} /> : <BookmarkBorder />}
            </IconButton>
            <IconButton
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
              }}
            >
              <Share />
            </IconButton>
          </Box>

          {/* 레스토랑 정보 */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              right: 24,
              color: 'white'
            }}
          >
            {restaurant.categories && (
              <Chip
                label={restaurant.categories.name}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  mb: 1,
                  fontSize: '0.75rem',
                  backdropFilter: 'blur(4px)'
                }}
              />
            )}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {restaurant.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Rating
                  value={restaurant.rating}
                  precision={0.1}
                  readOnly
                  size="small"
                  sx={{ color: '#ffc107' }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {restaurant.rating.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2">
                리뷰 {restaurant.review_count}개
              </Typography>
              {restaurantDetail && (
                <Typography variant="body2">
                  조회 {restaurantDetail.total_views}회
                </Typography>
              )}
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {restaurant.address}
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          {/* 탭 메뉴 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem'
                }
              }}
            >
              <Tab label="정보" />
              <Tab label="메뉴" />
              <Tab label="리뷰" />
              <Tab label="댓글" />
              <Tab label="지도" />
            </Tabs>
          </Box>

          <Box sx={{ px: 3 }}>
            {/* 정보 탭 */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* 기본 정보 */}
                <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        기본 정보
                      </Typography>

                      <List dense>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <LocationOn sx={{ color: '#666' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="주소"
                            secondary={restaurantDetail?.road_address || restaurant.address}
                          />
                        </ListItem>

                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Phone sx={{ color: '#666' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="전화번호"
                            secondary={restaurant.phone || '정보 없음'}
                          />
                        </ListItem>

                        {restaurantDetail?.price_range && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <RestaurantIcon sx={{ color: '#666' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="가격대"
                              secondary={restaurantDetail.price_range}
                            />
                          </ListItem>
                        )}
                      </List>

                      {/* 편의시설 */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          편의시설
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {restaurantDetail?.wifi_available && (
                            <Chip icon={<Wifi />} label="무선인터넷" size="small" variant="outlined" />
                          )}
                          {restaurantDetail?.delivery_available && (
                            <Chip icon={<LocalShipping />} label="배달" size="small" variant="outlined" />
                          )}
                          {restaurantDetail?.takeout_available && (
                            <Chip label="포장" size="small" variant="outlined" />
                          )}
                          {restaurantDetail?.reservation_available && (
                            <Chip label="예약가능" size="small" variant="outlined" />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* 영업시간 */}
                <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                  {restaurantDetail?.business_hours && (
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} />
                          영업시간
                        </Typography>
                        {formatBusinessHours(restaurantDetail.business_hours)}
                      </CardContent>
                    </Card>
                  )}
                </Box>

                {/* 찾아가는 방법 */}
                {restaurantDetail?.directions && (
                  <Box>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          <Directions sx={{ mr: 1, verticalAlign: 'middle' }} />
                          찾아가는 방법
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {restaurantDetail.directions}
                        </Typography>
                        {restaurantDetail.nearby_landmarks && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>주변 랜드마크:</strong> {restaurantDetail.nearby_landmarks}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* 메뉴 탭 */}
            <TabPanel value={tabValue} index={1}>
              {restaurantDetail?.menu_info ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                  {restaurantDetail.menu_info.map((menu, index) => (
                    <Card key={index}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {menu.name}
                          </Typography>
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {menu.price.toLocaleString()}원
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {menu.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary">
                    메뉴 정보가 없습니다
                  </Typography>
                </Box>
              )}
            </TabPanel>

            {/* 리뷰 탭 */}
            <TabPanel value={tabValue} index={2}>
              <RestaurantReviews
                restaurantId={restaurant?.id || ''}
                userId={undefined} // TODO: 로그인 사용자 ID 연결
                onReviewCountChange={(count) => {
                  // TODO: 리뷰 수 업데이트
                }}
                onRatingChange={(rating) => {
                  // TODO: 평점 업데이트
                }}
              />
            </TabPanel>

            {/* 댓글 탭 */}
            <TabPanel value={tabValue} index={3}>
              <RestaurantComments
                restaurantId={restaurant?.id || ''}
                userId={undefined} // TODO: 로그인 사용자 ID 연결
                onCommentCountChange={(count) => {
                  // TODO: 댓글 수 업데이트
                }}
              />
            </TabPanel>

            {/* 지도 탭 */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  네이버 지도 연동 예정
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  맛집 위치를 지도에서 확인할 수 있습니다
                </Typography>
              </Box>
            </TabPanel>
          </Box>
        </DialogContent>
      </Box>

      {/* 이미지 로딩 오류 처리 */}
      {restaurant.images?.map((image, index) => (
        <img
          key={index}
          src={image}
          onError={() => handleImageError(image)}
          style={{ display: 'none' }}
          alt=""
        />
      ))}
    </Dialog>
  );
};

export default RestaurantDetailModal;