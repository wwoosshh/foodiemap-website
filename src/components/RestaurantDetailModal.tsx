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
  Wifi,
  LocalShipping,
  Bookmark,
  BookmarkBorder,
  Share,
  Directions,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { Restaurant } from '../types';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import RestaurantReviews from './RestaurantReviews';
import NaverMap from './NaverMap';
import CubeLoader from './CubeLoader';

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


const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  open,
  onClose,
  restaurant
}) => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [restaurantCompleteData, setRestaurantCompleteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // 맛집 전체 데이터를 로드하는 함수 (캐싱 없이 항상 새로운 데이터)
  const loadRestaurantCompleteData = async (restaurantId: string) => {
    try {
      setLoading(true);
      const response = await ApiService.getRestaurantCompleteData(restaurantId);
      if (response.success && response.data) {
        console.log('🔍 즐겨찾기 상태:', response.data.userInfo?.isFavorited);
        setRestaurantCompleteData(response.data);
      }
    } catch (error) {
      console.error('맛집 상세 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant && open) {
      // 상세페이지 진입시마다 항상 새로운 데이터 로드
      loadRestaurantCompleteData(restaurant.id);
    } else if (!open) {
      // 모달이 닫힐 때 상태 초기화
      setRestaurantCompleteData(null);
      setTabValue(0);
    }
  }, [restaurant, open]);

  // 새로운 통합 데이터에서 즐겨찾기 토글 처리
  const handleToggleFavorite = async () => {
    if (!user?.id || !restaurant?.id) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    const currentStatus = restaurantCompleteData?.userInfo?.isFavorited || false;
    console.log('❤️ 현재 즐겨찾기 상태:', currentStatus);

    try {
      if (currentStatus) {
        console.log('🗑️ 즐겨찾기 제거 시도...');
        const response = await ApiService.removeFromFavorites(restaurant.id);
        if (response.success) {
          console.log('✅ 즐겨찾기 제거 성공');
          // 상태 업데이트: 즐겨찾기 제거
          setRestaurantCompleteData((prev: any) => ({
            ...prev,
            userInfo: {
              ...prev.userInfo,
              isFavorited: false
            }
          }));
        }
      } else {
        console.log('➕ 즐겨찾기 추가 시도...');
        const response = await ApiService.addToFavorites(restaurant.id);
        if (response.success) {
          console.log('✅ 즐겨찾기 추가 성공');
          // 상태 업데이트: 즐겨찾기 추가
          setRestaurantCompleteData((prev: any) => ({
            ...prev,
            userInfo: {
              ...prev.userInfo,
              isFavorited: true
            }
          }));
        }
      }
    } catch (error: any) {
      console.error('❌ 즐겨찾기 토글 실패:', error);
      const errorMessage = error.userMessage || error.response?.data?.message || '즐겨찾기 처리 중 오류가 발생했습니다.';
      alert(errorMessage);
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

  // 로딩 중일 때 스피너 표시
  if (loading || !restaurantCompleteData) {
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
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400
        }}>
          <CubeLoader size={80} message="맛집 정보 불러오는 중..." />
        </Box>
      </Dialog>
    );
  }

  const { restaurant: detailRestaurant, menus, userInfo } = restaurantCompleteData;

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
              onClick={handleToggleFavorite}
              disabled={!user?.id}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                opacity: !user?.id ? 0.5 : 1
              }}
              aria-label={userInfo?.isFavorited ? '즐겨찾기 제거' : '즐겨찾기 추가'}
            >
              {userInfo?.isFavorited ? <Bookmark sx={{ color: '#ff6b6b' }} /> : <BookmarkBorder />}
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
              {detailRestaurant && (
                <Typography variant="body2">
                  조회 {detailRestaurant.view_count || 0}회
                </Typography>
              )}
              {detailRestaurant && (
                <Typography variant="body2">
                  즐겨찾기 {detailRestaurant.favorite_count || 0}개
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
                            secondary={detailRestaurant?.address || restaurant.address}
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

                        {detailRestaurant?.price_range && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <RestaurantIcon sx={{ color: '#666' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="가격대"
                              secondary={detailRestaurant.price_range}
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
                          {detailRestaurant?.wifi_available && (
                            <Chip icon={<Wifi />} label="무선인터넷" size="small" variant="outlined" />
                          )}
                          {detailRestaurant?.delivery_available && (
                            <Chip icon={<LocalShipping />} label="배달" size="small" variant="outlined" />
                          )}
                          {detailRestaurant?.takeout_available && (
                            <Chip label="포장" size="small" variant="outlined" />
                          )}
                          {detailRestaurant?.reservation_available && (
                            <Chip label="예약가능" size="small" variant="outlined" />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* 영업시간 */}
                <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                  {detailRestaurant?.business_hours && (
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} />
                          영업시간
                        </Typography>
                        {formatBusinessHours(detailRestaurant.business_hours)}
                      </CardContent>
                    </Card>
                  )}
                </Box>

                {/* 찾아가는 방법 */}
                {detailRestaurant?.directions && (
                  <Box>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          <Directions sx={{ mr: 1, verticalAlign: 'middle' }} />
                          찾아가는 방법
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {detailRestaurant.directions}
                        </Typography>
                        {detailRestaurant.nearby_landmarks && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>주변 랜드마크:</strong> {detailRestaurant.nearby_landmarks}
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
              {menus && menus.length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                  {menus.map((menu: any, index: number) => (
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
                userId={user?.id}
                initialReviews={restaurantCompleteData?.reviews?.items || []}
                initialStats={restaurantCompleteData?.reviews?.stats || null}
                onReviewCountChange={(count) => {
                  // 리뷰 데이터 변경 시 전체 데이터 다시 로드
                  loadRestaurantCompleteData(restaurant.id);
                }}
                onRatingChange={(rating) => {
                  // 평점 변경 시 전체 데이터 다시 로드
                  loadRestaurantCompleteData(restaurant.id);
                }}
              />
            </TabPanel>

            {/* 지도 탭 */}
            <TabPanel value={tabValue} index={3}>
              {restaurantCompleteData?.mapInfo?.latitude && restaurantCompleteData?.mapInfo?.longitude ? (
                <NaverMap
                  latitude={restaurantCompleteData.mapInfo.latitude}
                  longitude={restaurantCompleteData.mapInfo.longitude}
                  restaurantName={restaurant.name}
                  address={restaurantCompleteData.mapInfo.address || restaurant.address}
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary">
                    위치 정보가 없습니다
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    이 맛집의 위치 정보가 등록되지 않았습니다
                  </Typography>
                </Box>
              )}
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