import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
  Rating,
  IconButton,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  Article as BlogIcon,
  Chat as KakaoIcon,
  Schedule as ScheduleIcon,
  LocalParking as ParkingIcon,
  Wifi as WifiIcon,
  Accessible as AccessibleIcon,
  ChildCare as KidsIcon,
  Pets as PetsIcon,
  CreditCard as PaymentIcon,
  DeliveryDining as DeliveryIcon,
  Restaurant as MenuIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import ApiService from '../services/api';

interface RestaurantDetail {
  restaurant: any;
  contacts: any;
  facilities: any;
  operations: any;
  services: any;
  menus: any;
  photos: any;
  tags: any[];
  reviews: any;
  userInfo: any;
  mapInfo: any;
}

const RestaurantDetailPageNew: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RestaurantDetail | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      loadRestaurantDetail();
    }
  }, [id]);

  const loadRestaurantDetail = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getRestaurantDetailsComplete(id!);
      setData(response.data);
      setIsFavorited(response.data.userInfo?.isFavorited || false);
    } catch (error) {
      console.error('Failed to load restaurant detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorited) {
        await ApiService.removeFromFavorites(id!);
      } else {
        await ApiService.addToFavorites(id!);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (loading || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  const { restaurant, contacts, facilities, operations, services, menus, photos, tags, reviews, mapInfo } = data;

  // 대표 이미지
  const representativeImage = photos.representative[0]?.url || photos.all[0]?.url || '/placeholder.jpg';

  // 태그 카테고리별 분류
  const tagsByCategory = {
    atmosphere: tags.filter((t: any) => t.category === 'atmosphere'),
    cuisine: tags.filter((t: any) => t.category === 'cuisine'),
    feature: tags.filter((t: any) => t.category === 'feature'),
    mood: tags.filter((t: any) => t.category === 'mood'),
  };

  // 영업시간 렌더링
  const renderBusinessHours = () => {
    if (!operations.business_hours) return '영업시간 정보 없음';

    const hours = operations.business_hours;
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return dayKeys.map((key, index) => {
      const dayData = hours[key];
      if (!dayData) return null;

      return (
        <Box key={key} sx={{ display: 'flex', gap: 2, py: 0.5 }}>
          <Typography sx={{ minWidth: '40px', fontWeight: 500, color: 'text.secondary' }}>
            {days[index]}
          </Typography>
          <Typography>
            {dayData.is_closed
              ? <span style={{ color: '#f44336' }}>정기휴무</span>
              : `${dayData.open || '-'} - ${dayData.close || '-'}`
            }
          </Typography>
        </Box>
      );
    });
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* 헤더: 뒤로가기, 즐겨찾기, 공유 */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 100,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.primary' }}>
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleFavoriteToggle} sx={{ color: isFavorited ? 'error.main' : 'text.secondary' }}>
                {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton sx={{ color: 'text.secondary' }}>
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero: 대표 이미지 */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 300, md: 500 },
          backgroundImage: `url(${representativeImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative' }}>
        {/* 기본 정보 카드 */}
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            p: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* 맛집명 & 상태 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h4" fontWeight={700}>
              {restaurant.name}
            </Typography>
            <Chip
              label={restaurant.status === 'active' ? '영업중' : '영업종료'}
              color={restaurant.status === 'active' ? 'success' : 'default'}
              size="small"
            />
          </Box>

          {/* 평점 & 카테고리 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={restaurant.rating || 0} precision={0.1} readOnly size="small" />
              <Typography variant="h6" fontWeight={600}>
                {restaurant.rating?.toFixed(1) || '0.0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (리뷰 {restaurant.review_count || 0}개)
              </Typography>
            </Box>
            {restaurant.categories && (
              <Chip
                label={restaurant.categories.name}
                size="small"
                sx={{ borderRadius: 1 }}
              />
            )}
          </Box>

          {/* 가격대 & 1인 평균 가격 */}
          {(restaurant.price_range || restaurant.avg_price_per_person) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                가격대
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {restaurant.price_range && (
                  <Typography variant="body1">
                    {restaurant.price_range === 'low' && '저렴함'}
                    {restaurant.price_range === 'medium' && '보통'}
                    {restaurant.price_range === 'high' && '비싼 편'}
                    {restaurant.price_range === 'very_high' && '매우 비쌈'}
                  </Typography>
                )}
                {restaurant.avg_price_per_person && (
                  <Typography variant="body1" fontWeight={600}>
                    1인 평균 {restaurant.avg_price_per_person.toLocaleString()}원
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* 간단 소개 */}
          {restaurant.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                소개
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {restaurant.description}
              </Typography>
            </Box>
          )}

          {/* 상세 설명 */}
          {restaurant.introduction && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                상세 정보
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {restaurant.introduction}
              </Typography>
            </Box>
          )}
        </Box>

        {/* 본문 영역 */}
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* 왼쪽 컬럼: 주요 정보 */}
            <Grid item xs={12} md={8}>
              {/* 주소 & 지도 */}
              <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  위치
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {restaurant.road_address && (
                    <Typography variant="body1" gutterBottom>
                      <strong>도로명:</strong> {restaurant.road_address}
                    </Typography>
                  )}
                  {restaurant.jibun_address && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>지번:</strong> {restaurant.jibun_address}
                    </Typography>
                  )}
                  {restaurant.postal_code && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>우편번호:</strong> {restaurant.postal_code}
                    </Typography>
                  )}
                </Box>

                {/* 네이버 지도 */}
                {mapInfo && (
                  <Box
                    sx={{
                      width: '100%',
                      height: 300,
                      bgcolor: '#e0e0e0',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography color="text.secondary">
                      지도 (위도: {mapInfo.latitude}, 경도: {mapInfo.longitude})
                    </Typography>
                    {/* TODO: 네이버 지도 API 연동 */}
                  </Box>
                )}
              </Box>

              {/* 메뉴 */}
              {menus.all.length > 0 && (
                <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                    메뉴
                  </Typography>

                  <Grid container spacing={2}>
                    {menus.all.map((menu: any) => (
                      <Grid item xs={12} sm={6} key={menu.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {menu.name}
                              {menu.is_signature && (
                                <Chip label="시그니처" size="small" color="error" sx={{ ml: 1, height: 20 }} />
                              )}
                              {menu.is_popular && (
                                <Chip label="인기" size="small" color="primary" sx={{ ml: 1, height: 20 }} />
                              )}
                            </Typography>
                            {menu.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {menu.description}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="body1" fontWeight={600} sx={{ ml: 2 }}>
                            {menu.price.toLocaleString()}원
                          </Typography>
                        </Box>
                        <Divider />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* 사진 갤러리 */}
              {photos.all.length > 0 && (
                <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                    사진
                  </Typography>

                  <Grid container spacing={2}>
                    {photos.all.map((photo: any, index: number) => (
                      <Grid item xs={6} sm={4} md={3} key={photo.id || index}>
                        <Box
                          sx={{
                            paddingTop: '100%',
                            position: 'relative',
                            borderRadius: 1,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.9,
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={photo.medium || photo.url}
                            alt={photo.caption || `사진 ${index + 1}`}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* 리뷰 섹션은 기존 유지 */}
            </Grid>

            {/* 오른쪽 컬럼: 부가 정보 */}
            <Grid item xs={12} md={4}>
              {/* 연락처 & SNS */}
              {contacts && Object.keys(contacts).length > 0 && (
                <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    연락처
                  </Typography>

                  {contacts.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{contacts.phone}</Typography>
                    </Box>
                  )}

                  {contacts.secondary_phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{contacts.secondary_phone}</Typography>
                    </Box>
                  )}

                  {contacts.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{contacts.email}</Typography>
                    </Box>
                  )}

                  {contacts.website_url && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <WebsiteIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography
                        variant="body2"
                        component="a"
                        href={contacts.website_url}
                        target="_blank"
                        sx={{ textDecoration: 'none', color: 'primary.main' }}
                      >
                        홈페이지
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    SNS
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {contacts.instagram_url && (
                      <IconButton
                        size="small"
                        component="a"
                        href={contacts.instagram_url}
                        target="_blank"
                        sx={{ color: '#E4405F' }}
                      >
                        <InstagramIcon />
                      </IconButton>
                    )}
                    {contacts.facebook_url && (
                      <IconButton
                        size="small"
                        component="a"
                        href={contacts.facebook_url}
                        target="_blank"
                        sx={{ color: '#1877F2' }}
                      >
                        <FacebookIcon />
                      </IconButton>
                    )}
                    {contacts.youtube_url && (
                      <IconButton
                        size="small"
                        component="a"
                        href={contacts.youtube_url}
                        target="_blank"
                        sx={{ color: '#FF0000' }}
                      >
                        <YouTubeIcon />
                      </IconButton>
                    )}
                    {contacts.blog_url && (
                      <IconButton
                        size="small"
                        component="a"
                        href={contacts.blog_url}
                        target="_blank"
                        sx={{ color: '#03C75A' }}
                      >
                        <BlogIcon />
                      </IconButton>
                    )}
                    {contacts.kakao_channel_url && (
                      <IconButton
                        size="small"
                        component="a"
                        href={contacts.kakao_channel_url}
                        target="_blank"
                        sx={{ color: '#FEE500' }}
                      >
                        <KakaoIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              )}

              {/* 영업 시간 */}
              {operations && (
                <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ScheduleIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="h6" fontWeight={600}>
                      영업시간
                    </Typography>
                  </Box>

                  {renderBusinessHours()}

                  {operations.break_time && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>브레이크타임:</strong> {operations.break_time}
                      </Typography>
                    </Box>
                  )}

                  {operations.last_order && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>라스트오더:</strong> {operations.last_order}
                      </Typography>
                    </Box>
                  )}

                  {operations.holiday_notice && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>휴무:</strong> {operations.holiday_notice}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* 시설 & 편의 */}
              {facilities && (
                <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    시설 & 편의
                  </Typography>

                  {/* 주차 */}
                  {facilities.parking_available && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <ParkingIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={600}>주차 가능</Typography>
                      </Box>
                      {facilities.parking_spaces && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                          {facilities.parking_spaces}대
                        </Typography>
                      )}
                      {facilities.valet_parking && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                          발렛파킹 가능
                        </Typography>
                      )}
                      {facilities.parking_info && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                          {facilities.parking_info}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* 편의시설 */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {facilities.wifi_available && (
                      <Chip icon={<WifiIcon />} label="무료 Wi-Fi" size="small" variant="outlined" />
                    )}
                    {facilities.wheelchair_accessible && (
                      <Chip icon={<AccessibleIcon />} label="휠체어" size="small" variant="outlined" />
                    )}
                    {facilities.kids_zone && (
                      <Chip icon={<KidsIcon />} label="키즈존" size="small" variant="outlined" />
                    )}
                    {facilities.pet_friendly && (
                      <Chip icon={<PetsIcon />} label="반려동물" size="small" variant="outlined" />
                    )}
                    {facilities.group_seating && (
                      <Chip label="단체석" size="small" variant="outlined" />
                    )}
                    {facilities.private_room && (
                      <Chip label="프라이빗룸" size="small" variant="outlined" />
                    )}
                    {facilities.outdoor_seating && (
                      <Chip label="야외좌석" size="small" variant="outlined" />
                    )}
                  </Box>

                  {facilities.total_seats && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      총 좌석: {facilities.total_seats}석
                    </Typography>
                  )}
                </Box>
              )}

              {/* 서비스 */}
              {services && (
                <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    서비스
                  </Typography>

                  {/* 예약 */}
                  {services.reservation_available && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        예약 가능
                      </Typography>
                      {services.reservation_phone && (
                        <Typography variant="body2" color="text.secondary">
                          전화: {services.reservation_phone}
                        </Typography>
                      )}
                      {services.booking_url && (
                        <Button
                          variant="outlined"
                          size="small"
                          href={services.booking_url}
                          target="_blank"
                          sx={{ mt: 1 }}
                        >
                          예약하기
                        </Button>
                      )}
                    </Box>
                  )}

                  {/* 배달 */}
                  {services.delivery_available && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <DeliveryIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={600}>배달 가능</Typography>
                      </Box>
                      {services.delivery_fee !== null && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                          배달료: {services.delivery_fee === 0 ? '무료' : `${services.delivery_fee.toLocaleString()}원`}
                        </Typography>
                      )}
                      {services.min_order_amount && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                          최소주문: {services.min_order_amount.toLocaleString()}원
                        </Typography>
                      )}
                    </Box>
                  )}

                  {services.takeout_available && (
                    <Typography variant="body2" color="text.secondary">
                      포장 가능
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* 결제 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PaymentIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" fontWeight={600}>결제수단</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {services.card_payment && <Chip label="카드" size="small" variant="outlined" />}
                    {services.cash_payment && <Chip label="현금" size="small" variant="outlined" />}
                    {services.mobile_payment && <Chip label="모바일" size="small" variant="outlined" />}
                  </Box>
                </Box>
              )}

              {/* 태그 */}
              {tags.length > 0 && (
                <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    특징
                  </Typography>

                  {tagsByCategory.atmosphere.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        분위기
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {tagsByCategory.atmosphere.map((tag: any) => (
                          <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {tagsByCategory.cuisine.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        음식
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {tagsByCategory.cuisine.map((tag: any) => (
                          <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {tagsByCategory.feature.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        특징
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {tagsByCategory.feature.map((tag: any) => (
                          <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {tagsByCategory.mood.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        분위기
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {tagsByCategory.mood.map((tag: any) => (
                          <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* 하단 여백 */}
      <Box sx={{ height: 80 }} />
    </Box>
  );
};

export default RestaurantDetailPageNew;
