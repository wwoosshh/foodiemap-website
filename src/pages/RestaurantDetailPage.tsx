import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom'; // TODO: 추후 사용 예정
import {
  Container,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Rating,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  FormControlLabel,
  Checkbox,
  Stack,
  Link,
  LinearProgress,
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import NaverMap from '../components/NaverMap';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  StarFilledIcon,
  LocationIcon,
  PhoneIcon,
  HeartFilledIcon,
  HeartOutlineIcon,
  ShareIcon,
  ReviewIcon,
  ClockIcon,
} from '../components/icons/CustomIcons';
import {
  ThumbUp,
  ThumbUpOutlined,
  Report,
  Edit,
  Delete,
  Wifi,
  DeliveryDining,
  ShoppingBag,
  EventAvailable,
  AttachMoney,
  Restaurant as RestaurantIcon,
  Language,
  Article,
  Instagram,
  Facebook,
  CloudUpload,
  Close,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { openCloudinaryWidget } from '../lib/cloudinary';

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate(); // TODO: 추후 사용 예정
  const theme = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [menus, setMenus] = useState<any>({ all: [], signature: [], popular: [] });
  const [photos, setPhotos] = useState<any>({ all: [], representative: [], food: [], interior: [], exterior: [], menu: [] });
  const [tags, setTags] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [facilities, setFacilities] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [operations, setOperations] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [services, setServices] = useState<any>({});
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<'all' | 'food' | 'interior' | 'exterior' | 'menu'>('all');
  const [thumbnailScrollIndex, setThumbnailScrollIndex] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [isImageListExpanded, setIsImageListExpanded] = useState(false);

  // 리뷰 작성 상태
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewIsAnonymous, setReviewIsAnonymous] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  // 리뷰 인터랙션 상태
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  useEffect(() => {
    if (id) {
      loadRestaurantData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getRestaurantCompleteData(id!);

      if (response.success && response.data) {
        setRestaurant(response.data.restaurant);
        setReviews(response.data.reviews?.items || []);

        // 메뉴 데이터: 새 구조 사용, fallback으로 기존 배열도 지원
        if (response.data.menus && typeof response.data.menus === 'object' && 'all' in response.data.menus) {
          setMenus(response.data.menus);
        } else {
          // 기존 배열 형태인 경우
          setMenus({ all: response.data.menus || [], signature: [], popular: [] });
        }

        // 사진 데이터
        setPhotos(response.data.photos || { all: [], representative: [], food: [], interior: [], exterior: [], menu: [] });

        // 태그 데이터
        setTags(response.data.tags || []);

        // 추가 데이터
        setContacts(response.data.contacts || {});
        setFacilities(response.data.facilities || {});
        setOperations(response.data.operations || {});
        setServices(response.data.services || {});

        setIsFavorited(response.data.userInfo?.isFavorited || false);

        if (user && response.data.reviews?.items) {
          const helpfulSet = new Set<string>();
          response.data.reviews.items.forEach((review: any) => {
            if (review.user_helpful) {
              helpfulSet.add(review.id);
            }
          });
          setHelpfulReviews(helpfulSet);
        }
      }
    } catch (err: any) {
      setError(err.userMessage || '맛집 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (isFavorited) {
        await ApiService.removeFromFavorites(id!);
      } else {
        await ApiService.addToFavorites(id!);
      }
      setIsFavorited(!isFavorited);
    } catch (err: any) {
      alert(err.userMessage || '즐겨찾기 처리에 실패했습니다.');
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!reviewTitle.trim() || !reviewContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await ApiService.createReview({
        restaurant_id: id!,
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
        is_anonymous: reviewIsAnonymous,
        images: reviewImages.length > 0 ? reviewImages : undefined,
      });

      alert('리뷰가 작성되었습니다.');
      setReviewDialogOpen(false);
      setReviewTitle('');
      setReviewContent('');
      setReviewRating(5);
      setReviewIsAnonymous(false);
      setReviewImages([]);
      loadRestaurantData();
    } catch (err: any) {
      alert(err.userMessage || '리뷰 작성에 실패했습니다.');
    }
  };

  const handleToggleHelpful = async (reviewId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await ApiService.toggleReviewHelpful(reviewId);
      if (response.success && response.data) {
        const responseData = response.data;

        const newHelpfulReviews = new Set(helpfulReviews);
        if (responseData.is_helpful) {
          newHelpfulReviews.add(reviewId);
        } else {
          newHelpfulReviews.delete(reviewId);
        }
        setHelpfulReviews(newHelpfulReviews);

        setReviews(reviews.map(review =>
          review.id === reviewId
            ? { ...review, helpful_count: responseData.helpful_count }
            : review
        ));
      }
    } catch (err: any) {
      alert(err.userMessage || '도움이 돼요 처리에 실패했습니다.');
    }
  };

  const handleOpenEditDialog = (review: any) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewTitle(review.title || '');
    setReviewContent(review.content || '');
    setReviewIsAnonymous(review.is_anonymous || false);
    setReviewImages(review.images || []);
    setReviewDialogOpen(true);
  };

  const handleUpdateReview = async () => {
    if (!user || !editingReview) {
      return;
    }

    if (!reviewTitle.trim() || !reviewContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await ApiService.updateReview(editingReview.id, {
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
        is_anonymous: reviewIsAnonymous,
        images: reviewImages.length > 0 ? reviewImages : undefined,
      });

      alert('리뷰가 수정되었습니다.');
      setReviewDialogOpen(false);
      setEditingReview(null);
      setReviewTitle('');
      setReviewContent('');
      setReviewRating(5);
      setReviewIsAnonymous(false);
      setReviewImages([]);
      loadRestaurantData();
    } catch (err: any) {
      alert(err.userMessage || '리뷰 수정에 실패했습니다.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await ApiService.deleteReview(reviewId);
      alert('리뷰가 삭제되었습니다.');
      loadRestaurantData();
    } catch (err: any) {
      alert(err.userMessage || '리뷰 삭제에 실패했습니다.');
    }
  };

  const handleOpenReportDialog = (reviewId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    setReportingReviewId(reviewId);
    setReportDialogOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportingReviewId || !reportReason.trim()) {
      alert('신고 사유를 선택해주세요.');
      return;
    }

    try {
      await ApiService.reportReview(reportingReviewId, {
        reason: reportReason,
        details: reportDetails,
      });

      alert('신고가 접수되었습니다.');
      setReportDialogOpen(false);
      setReportingReviewId(null);
      setReportReason('');
      setReportDetails('');
    } catch (err: any) {
      alert(err.userMessage || '신고 접수에 실패했습니다.');
    }
  };

  // 영업시간 렌더링
  const renderBusinessHours = () => {
    const hours = operations?.business_hours;
    if (!hours || typeof hours !== 'object') {
      return <Typography variant="body2" color="text.secondary">영업시간 정보가 없습니다.</Typography>;
    }

    const weekdays = [
      { key: 'monday', label: '월' },
      { key: 'tuesday', label: '화' },
      { key: 'wednesday', label: '수' },
      { key: 'thursday', label: '목' },
      { key: 'friday', label: '금' },
      { key: 'saturday', label: '토' },
      { key: 'sunday', label: '일' },
    ];

    return (
      <Stack spacing={0.5}>
        {weekdays.map((day) => {
          const dayData = hours[day.key];
          let displayText = '정보 없음';

          if (dayData) {
            if (dayData.is_closed) {
              displayText = '휴무';
            } else if (dayData.open && dayData.close) {
              displayText = `${dayData.open} - ${dayData.close}`;
            }
          }

          return (
            <Box key={day.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                {day.label}
              </Typography>
              <Typography variant="body2" color={dayData?.is_closed ? 'error.main' : 'text.primary'}>
                {displayText}
              </Typography>
            </Box>
          );
        })}
        {restaurant.break_time && (
          <Box sx={{ pt: 0.5, mt: 0.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              브레이크 타임: {restaurant.break_time}
            </Typography>
          </Box>
        )}
        {restaurant.last_order && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              라스트 오더: {restaurant.last_order}
            </Typography>
          </Box>
        )}
      </Stack>
    );
  };

  // 편의시설 렌더링
  const renderFacilities = () => {
    const facilities = [
      { key: 'wifi_available', label: '무료 와이파이', icon: <Wifi sx={{ fontSize: 18 }} /> },
      { key: 'delivery_available', label: '배달', icon: <DeliveryDining sx={{ fontSize: 18 }} /> },
      { key: 'takeout_available', label: '포장', icon: <ShoppingBag sx={{ fontSize: 18 }} /> },
      { key: 'reservation_available', label: '예약', icon: <EventAvailable sx={{ fontSize: 18 }} /> },
      { key: 'pet_friendly', label: '반려동물 동반', icon: null },
      { key: 'group_seating', label: '단체석', icon: null },
      { key: 'private_room', label: '룸/프라이빗', icon: null },
      { key: 'wheelchair_accessible', label: '휠체어 접근', icon: null },
      { key: 'nursing_room', label: '수유실', icon: null },
      { key: 'kids_menu', label: '어린이 메뉴', icon: null },
    ];

    const availableFacilities = facilities.filter(f => restaurant[f.key]);

    if (availableFacilities.length === 0 && !restaurant.parking_info && !restaurant.valet_parking) {
      return <Typography variant="body2" color="text.secondary">정보 없음</Typography>;
    }

    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {availableFacilities.map((facility) => (
          <Chip
            key={facility.key}
            {...(facility.icon ? { icon: facility.icon } : {})}
            label={facility.label}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
        ))}
        {restaurant.parking_available && (
          <Chip
            label={`주차 가능${restaurant.parking_spaces ? ` (${restaurant.parking_spaces}대)` : ''}`}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
        )}
        {restaurant.valet_parking && (
          <Chip
            label="발렛파킹"
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error || !restaurant) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Alert severity="error">{error || '맛집을 찾을 수 없습니다.'}</Alert>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 4 }}>
          {/* 왼쪽: 이미지 갤러리 + 맛집 정보 */}
          <Box>
            {/* 대표 이미지 섹션 */}
            {photos.all.length > 0 && (
              <Box sx={{ mb: 4 }}>
                {/* 대표 이미지 */}
                <Box
                  sx={{
                    width: '100%',
                    height: 500,
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src={photos[selectedPhotoCategory][selectedImage]?.photo_url || photos.all[selectedImage]?.photo_url}
                    alt="맛집 사진"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      cursor: 'pointer',
                    }}
                    onClick={() => window.open(photos[selectedPhotoCategory][selectedImage]?.photo_url || photos.all[selectedImage]?.photo_url, '_blank')}
                  />
                </Box>
              </Box>
            )}

            {/* 헤더 섹션 - 카드 제거, 깔끔하게 */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h3" fontWeight={700}>
                  {restaurant.name}
                </Typography>
                {restaurant.categories && (
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper',
                      border: '2px solid',
                      borderColor: restaurant.categories.color || 'primary.main',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                    }}
                  >
                    {restaurant.categories.icon && (
                      <Typography sx={{ fontSize: 16 }}>{restaurant.categories.icon}</Typography>
                    )}
                    <Typography variant="body2" fontWeight={700} color="text.primary">
                      {restaurant.categories.name}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* 평점 + 가격대 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarFilledIcon sx={{ fontSize: 28, color: '#FFD93D' }} />
                  <Typography variant="h4" fontWeight={700}>
                    {restaurant.rating ? restaurant.rating.toFixed(1) : '0.0'}
                  </Typography>
                </Box>

                <Divider orientation="vertical" flexItem />

                <Typography variant="body1" color="text.secondary">
                  리뷰 {restaurant.review_count || 0}개
                </Typography>

                {restaurant.price_range && (
                  <>
                    <Divider orientation="vertical" flexItem />
                    <Chip
                      icon={<AttachMoney sx={{ fontSize: 18 }} />}
                      label={restaurant.price_range}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                  </>
                )}
              </Box>

              {/* 태그 섹션 */}
              {tags && tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 1.5, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    평가 태그
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                    {tags.slice(0, 6).map((tag) => (
                      <Box
                        key={tag.id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderLeft: 4,
                          borderLeftColor: tag.color || 'primary.main',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {tag.icon && (
                              <Typography sx={{ fontSize: 18 }}>{tag.icon}</Typography>
                            )}
                            <Typography variant="body2" fontWeight={600} color="text.primary">
                              {tag.name}
                            </Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ fontSize: '1rem' }}>
                            {tag.score?.toFixed(1) || '0.0'}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={((tag.score || 0) / 10) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(tag.color || theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: tag.color || 'primary.main',
                              borderRadius: 3,
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* 액션 버튼 */}
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant={isFavorited ? "contained" : "outlined"}
                  startIcon={isFavorited ? <HeartFilledIcon /> : <HeartOutlineIcon />}
                  size="large"
                  onClick={handleToggleFavorite}
                  sx={{
                    borderRadius: 1,
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {isFavorited ? '즐겨찾기' : '즐겨찾기 추가'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  size="large"
                  sx={{
                    borderRadius: 1,
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  공유하기
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 핵심 정보 그리드 - 카드 제거 */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 3,
                py: 3,
              }}
            >
              {/* 주소 */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    주소
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  {restaurant.address}
                </Typography>
                {restaurant.road_address && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    도로명: {restaurant.road_address}
                  </Typography>
                )}
              </Box>

              {/* 전화번호 */}
              {(contacts?.phone || restaurant.phone) && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                      전화번호
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={500}>
                    <Link href={`tel:${(contacts?.phone || restaurant.phone)}`} underline="hover" color="inherit">
                      {(contacts?.phone || restaurant.phone)}
                    </Link>
                  </Typography>
                </Box>
              )}

              {/* 영업시간 */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ClockIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    영업시간
                  </Typography>
                </Box>
                {renderBusinessHours()}
                {restaurant.closed_days && restaurant.closed_days.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="error.main" fontWeight={600}>
                      휴무: {restaurant.closed_days.join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* 편의시설 */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <RestaurantIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    편의시설
                  </Typography>
                </Box>
                {renderFacilities()}
                {restaurant.parking_info && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    {restaurant.parking_info}
                  </Typography>
                )}
              </Box>

              {/* 배달/포장 정보 */}
              {(restaurant.delivery_available || restaurant.delivery_apps || restaurant.takeout_available) && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <DeliveryDining sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                      배달/포장
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {restaurant.delivery_available && (
                      <Box>
                        <Typography variant="body2" fontWeight={600}>배달 가능</Typography>
                        {restaurant.delivery_apps && restaurant.delivery_apps.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                            {restaurant.delivery_apps.map((app: string, idx: number) => (
                              <Chip key={idx} label={app} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                            ))}
                          </Box>
                        )}
                        {restaurant.delivery_fee !== null && restaurant.delivery_fee !== undefined && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            배달비: {restaurant.delivery_fee === 0 ? '무료' : `${restaurant.delivery_fee.toLocaleString()}원`}
                          </Typography>
                        )}
                        {restaurant.min_order_amount && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            최소 주문금액: {restaurant.min_order_amount.toLocaleString()}원
                          </Typography>
                        )}
                      </Box>
                    )}
                    {restaurant.takeout_available && (
                      <Typography variant="body2">포장 가능</Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 소개 */}
            {restaurant.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  소개
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  {restaurant.description}
                </Typography>
              </Box>
            )}


            {/* 소셜 링크 */}
            {(restaurant.website_url || restaurant.blog_url || restaurant.instagram_url || restaurant.facebook_url) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  링크
                </Typography>
                <Stack spacing={1}>
                  {restaurant.website_url && (
                    <Link
                      href={restaurant.website_url}
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}
                    >
                      <Language fontSize="small" />
                      <Typography variant="body2">웹사이트</Typography>
                    </Link>
                  )}
                  {restaurant.blog_url && (
                    <Link
                      href={restaurant.blog_url}
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}
                    >
                      <Article fontSize="small" />
                      <Typography variant="body2">블로그</Typography>
                    </Link>
                  )}
                  {restaurant.instagram_url && (
                    <Link
                      href={restaurant.instagram_url}
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}
                    >
                      <Instagram fontSize="small" />
                      <Typography variant="body2">인스타그램</Typography>
                    </Link>
                  )}
                  {restaurant.facebook_url && (
                    <Link
                      href={restaurant.facebook_url}
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}
                    >
                      <Facebook fontSize="small" />
                      <Typography variant="body2">페이스북</Typography>
                    </Link>
                  )}
                </Stack>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* 통계 섹션 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                통계
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                  gap: 2,
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                    <StarFilledIcon sx={{ fontSize: 20, color: '#FFD93D' }} />
                    <Typography variant="h5" fontWeight={700}>
                      {restaurant.rating ? restaurant.rating.toFixed(1) : '0.0'}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    평균 평점
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                    {restaurant.review_count || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    리뷰 수
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                    {restaurant.view_count || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    조회수
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                    {restaurant.favorite_count || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    즐겨찾기
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* 탭 섹션 */}
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={selectedTab}
                onChange={(_, v) => setSelectedTab(v)}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: 16,
                  },
                }}
              >
                <Tab label={`리뷰 (${reviews.length})`} />
                <Tab label="메뉴" />
                <Tab label="지도" />
              </Tabs>
            </Box>

            {/* 리뷰 탭 */}
            {selectedTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight={700}>
                    리뷰
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<ReviewIcon />}
                    onClick={() => setReviewDialogOpen(true)}
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    리뷰 작성
                  </Button>
                </Box>

                {reviews.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 1 }}>첫 번째 리뷰를 작성해보세요!</Alert>
                ) : (
                  <Box>
                    {reviews.map((review) => {
                      const isOwnReview = user?.id === review.user_id;
                      const isHelpful = helpfulReviews.has(review.id);

                      return (
                        <Box
                          key={review.id}
                          sx={{
                            py: 3,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-child': { borderBottom: 'none' },
                          }}
                        >
                          {/* 리뷰 헤더 */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Avatar src={review.is_anonymous ? undefined : review.avatar_url} sx={{ width: 48, height: 48 }}>
                                {review.username?.[0] || '익'}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body1" fontWeight={600}>
                                    {review.username || '익명'}
                                  </Typography>
                                  {review.visit_count && review.visit_count > 1 && (
                                    <Chip
                                      label={`${review.visit_count}번째 방문`}
                                      size="small"
                                      sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#4ECDC4', color: 'white' }}
                                    />
                                  )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <Rating value={review.rating || 0} size="small" readOnly />
                                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </Typography>
                                  {review.visit_date && (
                                    <>
                                      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                                      <Typography variant="caption" color="text.secondary">
                                        방문일: {new Date(review.visit_date).toLocaleDateString()}
                                      </Typography>
                                    </>
                                  )}
                                </Box>

                                {/* 상세 평점 */}
                                {(review.taste_rating || review.quantity_rating || review.service_rating || review.atmosphere_rating || review.cleanliness_rating) && (
                                  <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                                    {review.taste_rating && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">맛</Typography>
                                        <Rating value={review.taste_rating} size="small" readOnly sx={{ fontSize: '0.9rem' }} />
                                      </Box>
                                    )}
                                    {review.quantity_rating && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">양</Typography>
                                        <Rating value={review.quantity_rating} size="small" readOnly sx={{ fontSize: '0.9rem' }} />
                                      </Box>
                                    )}
                                    {review.service_rating && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">서비스</Typography>
                                        <Rating value={review.service_rating} size="small" readOnly sx={{ fontSize: '0.9rem' }} />
                                      </Box>
                                    )}
                                    {review.atmosphere_rating && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">분위기</Typography>
                                        <Rating value={review.atmosphere_rating} size="small" readOnly sx={{ fontSize: '0.9rem' }} />
                                      </Box>
                                    )}
                                    {review.cleanliness_rating && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">청결</Typography>
                                        <Rating value={review.cleanliness_rating} size="small" readOnly sx={{ fontSize: '0.9rem' }} />
                                      </Box>
                                    )}
                                  </Box>
                                )}

                                {/* 방문 목적 및 키워드 태그 */}
                                {(review.visit_purpose || (review.keyword_tags && review.keyword_tags.length > 0)) && (
                                  <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                                    {review.visit_purpose && (
                                      <Chip label={review.visit_purpose} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                    )}
                                    {review.keyword_tags && review.keyword_tags.map((tag: string, idx: number) => (
                                      <Chip key={idx} label={tag} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                    ))}
                                  </Box>
                                )}

                                {/* 메뉴 태그 */}
                                {review.menu_tags && review.menu_tags.length > 0 && (
                                  <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                                    {review.menu_tags.map((menu: string, idx: number) => (
                                      <Chip
                                        key={idx}
                                        label={menu}
                                        size="small"
                                        sx={{ height: 20, fontSize: '0.7rem', backgroundColor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}
                                      />
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            </Box>

                            {isOwnReview && (
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton size="small" onClick={() => handleOpenEditDialog(review)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDeleteReview(review.id)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>

                          {review.title && (
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                              {review.title}
                            </Typography>
                          )}

                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {review.content}
                          </Typography>

                          {review.images && review.images.length > 0 && (
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 1, mb: 2 }}>
                              {review.images.map((img: string, idx: number) => (
                                <Box
                                  key={idx}
                                  sx={{
                                    width: '100%',
                                    paddingTop: '100%',
                                    position: 'relative',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      opacity: 0.9,
                                      transform: 'scale(1.02)',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                  onClick={() => window.open(img, '_blank')}
                                >
                                  <Box
                                    component="img"
                                    src={img}
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
                              ))}
                            </Box>
                          )}

                          {!isOwnReview && user && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant={isHelpful ? "contained" : "outlined"}
                                startIcon={isHelpful ? <ThumbUp /> : <ThumbUpOutlined />}
                                onClick={() => handleToggleHelpful(review.id)}
                                sx={{ textTransform: 'none', borderRadius: 1 }}
                              >
                                도움돼요 {review.helpful_count > 0 && `(${review.helpful_count})`}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Report />}
                                onClick={() => handleOpenReportDialog(review.id)}
                                sx={{ textTransform: 'none', borderRadius: 1 }}
                              >
                                신고
                              </Button>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}

            {/* 메뉴 탭 */}
            {selectedTab === 1 && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                  메뉴
                </Typography>
                {menus.all.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 1 }}>등록된 메뉴가 없습니다.</Alert>
                ) : (
                  <Box>
                    {/* 시그니처 메뉴 (있는 경우) */}
                    {menus.signature && menus.signature.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <RestaurantIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          <Typography variant="h6" fontWeight={600}>
                            시그니처 메뉴
                          </Typography>
                        </Box>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                          {menus.signature.map((menu: any) => (
                            <Box
                              key={menu.id}
                              sx={{
                                border: '2px solid',
                                borderColor: 'primary.main',
                                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                borderRadius: 2,
                                overflow: 'hidden',
                                opacity: menu.is_available === false || menu.sold_out ? 0.6 : 1,
                              }}
                            >
                              {/* 메뉴 이미지 */}
                              {menu.image_url && (
                                <Box
                                  component="img"
                                  src={menu.image_url}
                                  alt={menu.name}
                                  sx={{
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'cover',
                                  }}
                                />
                              )}

                              <Box sx={{ p: 2 }}>
                                {/* 메뉴명 및 배지 */}
                                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 1 }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
                                      {menu.is_signature && (
                                        <Chip label="시그니처" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                      {menu.is_seasonal && (
                                        <Chip label="시즌 한정" size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#4ECDC4', color: 'white' }} />
                                      )}
                                      {menu.category && (
                                        <Chip label={menu.category} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                      {menu.sold_out && (
                                        <Chip label="품절" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={700}>
                                      {menu.name}
                                    </Typography>
                                  </Box>

                                  {/* 가격 */}
                                  <Box sx={{ textAlign: 'right', ml: 2 }}>
                                    {menu.original_price && menu.original_price > menu.price && (
                                      <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', display: 'block' }}>
                                        {menu.original_price.toLocaleString()}원
                                      </Typography>
                                    )}
                                    <Typography variant="h6" fontWeight={700} color="primary.main">
                                      {menu.price?.toLocaleString()}원
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* 설명 */}
                                {menu.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                    {menu.description}
                                  </Typography>
                                )}

                                {/* 추가 정보 */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  {menu.portion_size && (
                                    <Typography variant="caption" color="text.secondary">
                                      용량: {menu.portion_size}
                                    </Typography>
                                  )}
                                  {menu.spicy_level && menu.spicy_level > 0 && (
                                    <Typography variant="caption" color="error.main">
                                      맵기: {menu.spicy_level}/5
                                    </Typography>
                                  )}
                                  {menu.calories && (
                                    <Typography variant="caption" color="text.secondary">
                                      칼로리: {menu.calories} kcal
                                    </Typography>
                                  )}
                                  {menu.allergens && menu.allergens.length > 0 && (
                                    <Typography variant="caption" color="warning.main">
                                      알러지: {menu.allergens.join(', ')}
                                    </Typography>
                                  )}
                                  {menu.ingredients && menu.ingredients.length > 0 && (
                                    <Typography variant="caption" color="text.secondary">
                                      재료: {menu.ingredients.join(', ')}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* 인기 메뉴 (있는 경우) */}
                    {menus.popular && menus.popular.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          인기 메뉴
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                          {menus.popular.map((menu: any) => (
                            <Box
                              key={menu.id}
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                overflow: 'hidden',
                                opacity: menu.is_available === false || menu.sold_out ? 0.6 : 1,
                              }}
                            >
                              {menu.image_url && (
                                <Box
                                  component="img"
                                  src={menu.image_url}
                                  alt={menu.name}
                                  sx={{
                                    width: '100%',
                                    height: 180,
                                    objectFit: 'cover',
                                  }}
                                />
                              )}

                              <Box sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 1 }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
                                      {menu.is_popular && (
                                        <Chip label="인기" size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#FFD93D', color: '#2C3E50' }} />
                                      )}
                                      {menu.is_seasonal && (
                                        <Chip label="시즌 한정" size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#4ECDC4', color: 'white' }} />
                                      )}
                                      {menu.category && (
                                        <Chip label={menu.category} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                      {menu.sold_out && (
                                        <Chip label="품절" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={700}>
                                      {menu.name}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ textAlign: 'right', ml: 2 }}>
                                    {menu.original_price && menu.original_price > menu.price && (
                                      <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', display: 'block' }}>
                                        {menu.original_price.toLocaleString()}원
                                      </Typography>
                                    )}
                                    <Typography variant="h6" fontWeight={700} color="primary.main">
                                      {menu.price?.toLocaleString()}원
                                    </Typography>
                                  </Box>
                                </Box>

                                {menu.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                    {menu.description}
                                  </Typography>
                                )}

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  {menu.portion_size && (
                                    <Typography variant="caption" color="text.secondary">
                                      용량: {menu.portion_size}
                                    </Typography>
                                  )}
                                  {menu.spicy_level && menu.spicy_level > 0 && (
                                    <Typography variant="caption" color="error.main">
                                      맵기: {menu.spicy_level}/5
                                    </Typography>
                                  )}
                                  {menu.calories && (
                                    <Typography variant="caption" color="text.secondary">
                                      칼로리: {menu.calories} kcal
                                    </Typography>
                                  )}
                                  {menu.allergens && menu.allergens.length > 0 && (
                                    <Typography variant="caption" color="warning.main">
                                      알러지: {menu.allergens.join(', ')}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* 전체 메뉴 */}
                    {menus.all && menus.all.length > 0 && (
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          전체 메뉴
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                          {menus.all.map((menu: any) => (
                            <Box
                              key={menu.id}
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                overflow: 'hidden',
                                opacity: menu.is_available === false || menu.sold_out ? 0.6 : 1,
                              }}
                            >
                              {menu.image_url && (
                                <Box
                                  component="img"
                                  src={menu.image_url}
                                  alt={menu.name}
                                  sx={{
                                    width: '100%',
                                    height: 180,
                                    objectFit: 'cover',
                                  }}
                                />
                              )}

                              <Box sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 1 }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
                                      {menu.is_signature && (
                                        <Chip label="시그니처" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                      {menu.is_popular && (
                                        <Chip label="인기" size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#FFD93D', color: '#2C3E50' }} />
                                      )}
                                      {menu.is_seasonal && (
                                        <Chip label="시즌 한정" size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#4ECDC4', color: 'white' }} />
                                      )}
                                      {menu.category && (
                                        <Chip label={menu.category} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                      {menu.sold_out && (
                                        <Chip label="품절" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={700}>
                                      {menu.name}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ textAlign: 'right', ml: 2 }}>
                                    {menu.original_price && menu.original_price > menu.price && (
                                      <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', display: 'block' }}>
                                        {menu.original_price.toLocaleString()}원
                                      </Typography>
                                    )}
                                    <Typography variant="h6" fontWeight={700} color="primary.main">
                                      {menu.price?.toLocaleString()}원
                                    </Typography>
                                  </Box>
                                </Box>

                                {menu.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                    {menu.description}
                                  </Typography>
                                )}

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  {menu.portion_size && (
                                    <Typography variant="caption" color="text.secondary">
                                      용량: {menu.portion_size}
                                    </Typography>
                                  )}
                                  {menu.spicy_level && menu.spicy_level > 0 && (
                                    <Typography variant="caption" color="error.main">
                                      맵기: {menu.spicy_level}/5
                                    </Typography>
                                  )}
                                  {menu.calories && (
                                    <Typography variant="caption" color="text.secondary">
                                      칼로리: {menu.calories} kcal
                                    </Typography>
                                  )}
                                  {menu.allergens && menu.allergens.length > 0 && (
                                    <Typography variant="caption" color="warning.main">
                                      알러지: {menu.allergens.join(', ')}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {/* 지도 탭 */}
            {selectedTab === 2 && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                  위치
                </Typography>
                <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden' }}>
                  <NaverMap
                    latitude={restaurant.latitude || 37.5665}
                    longitude={restaurant.longitude || 126.9780}
                    address={restaurant.address}
                    restaurantName={restaurant.name}
                  />
                </Box>
              </Box>
            )}
          </Box>

          {/* 오른쪽: 이미지 목록 */}
          <Box>
            {photos.all.length > 0 && (
              <Box
                sx={{
                  position: 'sticky',
                  top: 80,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    사진 ({photos[selectedPhotoCategory].length})
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setIsImageListExpanded(!isImageListExpanded)}
                    sx={{
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    {isImageListExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </Box>

                {/* 카테고리 필터 */}
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
                  {[
                    { key: 'all', label: '전체', count: photos.all.length },
                    { key: 'food', label: '음식', count: photos.food.length },
                    { key: 'interior', label: '내부', count: photos.interior.length },
                    { key: 'exterior', label: '외부', count: photos.exterior.length },
                    { key: 'menu', label: '메뉴판', count: photos.menu.length },
                  ].map((category) => (
                    category.count > 0 && (
                      <Chip
                        key={category.key}
                        label={`${category.label} ${category.count}`}
                        onClick={() => {
                          setSelectedPhotoCategory(category.key as any);
                          setSelectedImage(0);
                          setThumbnailScrollIndex(0);
                          setIsImageListExpanded(false);
                        }}
                        size="small"
                        color={selectedPhotoCategory === category.key ? 'primary' : 'default'}
                        sx={{
                          borderRadius: 1,
                          fontWeight: selectedPhotoCategory === category.key ? 600 : 400,
                          fontSize: '0.75rem',
                          height: 24,
                        }}
                      />
                    )
                  ))}
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* 이미지 그리드 */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 0.75,
                  }}
                >
                  {photos[selectedPhotoCategory]
                    .slice(0, isImageListExpanded ? undefined : 6)
                    .map((photo: any, idx: number) => (
                      <Box
                        key={idx}
                        sx={{
                          width: '100%',
                          paddingTop: '100%',
                          position: 'relative',
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: selectedImage === idx ? '2px solid' : '1px solid',
                          borderColor: selectedImage === idx ? 'primary.main' : 'divider',
                          '&:hover': {
                            opacity: 0.8,
                            transform: 'scale(0.98)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => setSelectedImage(idx)}
                      >
                        <Box
                          component="img"
                          src={photo.photo_url}
                          alt={`사진 ${idx + 1}`}
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
                    ))}
                </Box>

                {/* 펼치기/접기 버튼 */}
                {photos[selectedPhotoCategory].length > 6 && (
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => setIsImageListExpanded(!isImageListExpanded)}
                    sx={{
                      mt: 1.5,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                    endIcon={isImageListExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  >
                    {isImageListExpanded ? '접기' : `${photos[selectedPhotoCategory].length - 6}장 더보기`}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* 리뷰 작성/수정 다이얼로그 */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => {
          setReviewDialogOpen(false);
          setEditingReview(null);
          setReviewTitle('');
          setReviewContent('');
          setReviewRating(5);
          setReviewIsAnonymous(false);
          setReviewImages([]);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingReview ? '리뷰 수정' : '리뷰 작성'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              평점
            </Typography>
            <Rating
              value={reviewRating}
              onChange={(_, newValue) => setReviewRating(newValue || 5)}
              size="large"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="제목"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="내용"
              multiline
              rows={6}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* 이미지 업로드 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                사진 ({reviewImages.length}/5)
              </Typography>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => {
                  if (reviewImages.length >= 5) {
                    alert('최대 5장까지 업로드할 수 있습니다.');
                    return;
                  }
                  openCloudinaryWidget(
                    (result) => {
                      setReviewImages([...reviewImages, result.secure_url]);
                    },
                    {
                      multiple: false,
                      folder: 'reviews',
                      tags: ['review'],
                    }
                  );
                }}
                disabled={reviewImages.length >= 5}
                sx={{ mb: 1 }}
              >
                사진 추가
              </Button>

              {reviewImages.length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 1, mt: 1 }}>
                  {reviewImages.map((img, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: '100%',
                        paddingTop: '100%',
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component="img"
                        src={img}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== idx))}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={reviewIsAnonymous}
                  onChange={(e) => setReviewIsAnonymous(e.target.checked)}
                />
              }
              label="익명으로 작성"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setReviewDialogOpen(false);
              setEditingReview(null);
              setReviewTitle('');
              setReviewContent('');
              setReviewRating(5);
              setReviewIsAnonymous(false);
              setReviewImages([]);
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={editingReview ? handleUpdateReview : handleSubmitReview}
          >
            {editingReview ? '수정하기' : '작성하기'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 신고 다이얼로그 */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => {
          setReportDialogOpen(false);
          setReportingReviewId(null);
          setReportReason('');
          setReportDetails('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>리뷰 신고</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              부적절한 리뷰를 신고해주세요. 신고 내용은 관리자가 검토합니다.
            </Typography>

            <TextField
              fullWidth
              select
              label="신고 사유"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="">선택해주세요</option>
              <option value="spam">스팸/광고</option>
              <option value="inappropriate">부적절한 내용</option>
              <option value="offensive">욕설/비방</option>
              <option value="false_info">허위 정보</option>
              <option value="other">기타</option>
            </TextField>

            <TextField
              fullWidth
              label="상세 내용 (선택사항)"
              multiline
              rows={4}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="신고 사유를 자세히 설명해주세요."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setReportDialogOpen(false);
              setReportingReviewId(null);
              setReportReason('');
              setReportDetails('');
            }}
          >
            취소
          </Button>
          <Button variant="contained" color="error" onClick={handleSubmitReport}>
            신고하기
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default RestaurantDetailPage;
