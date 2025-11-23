import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import NaverMap from '../components/NaverMap';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { updateMetaTags, generateRestaurantMeta } from '../utils/seo';
import { generateRestaurantSchema, generateBreadcrumbSchema, insertMultipleStructuredData } from '../utils/structuredData';
import {
  StarFilledIcon,
  HeartFilledIcon,
  HeartOutlineIcon,
  ShareIcon,
  ReviewIcon,
} from '../components/icons/CustomIcons';
import {
  ThumbUp,
  ThumbUpOutlined,
  Report,
  Edit,
  Delete,
  CloudUpload,
  Close,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { openCloudinaryWidget } from '../lib/cloudinary';

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [menus, setMenus] = useState<any>({ all: [], signature: [], popular: [] });
  const [photos, setPhotos] = useState<any>({ all: [], representative: [] });
  const [tags, setTags] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any>({});
  const [facilities, setFacilities] = useState<any>({});
  const [operations, setOperations] = useState<any>({});
  const [services, setServices] = useState<any>({});
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
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
  }, [id, language]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getRestaurantCompleteData(id!, language);

      if (response.success && response.data) {
        const restaurantData = response.data.restaurant;
        setRestaurant(restaurantData);
        setReviews(response.data.reviews?.items || []);

        // SEO: 메타 태그 업데이트
        if (restaurantData) {
          updateMetaTags(generateRestaurantMeta(restaurantData));

          // SEO: 구조화된 데이터 (Schema.org) 추가
          const schemas = [
            generateRestaurantSchema({
              ...restaurantData,
              contacts: response.data.contacts,
              operations: response.data.operations
            }),
            generateBreadcrumbSchema([
              { name: '홈', url: 'https://mzcube.com' },
              { name: '맛집', url: 'https://mzcube.com/restaurants' },
              { name: restaurantData.name, url: `https://mzcube.com/restaurant/${restaurantData.id}` }
            ])
          ];
          insertMultipleStructuredData(schemas);
        }

        // 메뉴 데이터
        if (response.data.menus && typeof response.data.menus === 'object' && 'all' in response.data.menus) {
          setMenus(response.data.menus);
        } else {
          setMenus({ all: response.data.menus || [], signature: [], popular: [] });
        }

        // 사진 데이터
        setPhotos(response.data.photos || { all: [], representative: [] });

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

  // 가격대 번역
  const translatePriceRange = (range: string) => {
    const priceRangeMap: { [key: string]: string } = {
      'low': '저가',
      'medium': '중가',
      'high': '고가',
      'very_high': '최고가'
    };
    return priceRangeMap[range] || range;
  };

  // 영업시간 렌더링
  const renderBusinessHours = () => {
    const hours = operations?.business_hours;
    if (!hours || typeof hours !== 'object') {
      return <Typography variant="body2" color="text.secondary">{t('restaurant.noHoursInfo')}</Typography>;
    }

    const weekdays = [
      { key: 'mon', label: t('restaurant.mon') },
      { key: 'tue', label: t('restaurant.tue') },
      { key: 'wed', label: t('restaurant.wed') },
      { key: 'thu', label: t('restaurant.thu') },
      { key: 'fri', label: t('restaurant.fri') },
      { key: 'sat', label: t('restaurant.sat') },
      { key: 'sun', label: t('restaurant.sun') },
    ];

    return (
      <Stack spacing={0.5}>
        {weekdays.map((day) => {
          const dayData = hours[day.key];
          let displayText = t('restaurant.noInfo');

          if (dayData) {
            if (dayData.closed) {
              displayText = t('restaurant.closed');
            } else if (dayData.open && dayData.close) {
              displayText = `${dayData.open} - ${dayData.close}`;
            }
          }

          return (
            <Box key={day.key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30, flexShrink: 0 }}>
                {day.label}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  borderBottom: '1px dotted',
                  borderColor: 'divider',
                  minWidth: 20,
                  mb: 0.5
                }}
              />
              <Typography variant="body2" color={dayData?.closed ? 'error.main' : 'text.primary'} sx={{ flexShrink: 0 }}>
                {displayText}
              </Typography>
            </Box>
          );
        })}
        {(operations?.break_time || restaurant?.break_time) && (
          <Box sx={{ pt: 0.5, mt: 0.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              {t('restaurant.breakTime')}: {(operations?.break_time || restaurant?.break_time)}
            </Typography>
          </Box>
        )}
        {(operations?.last_order || restaurant?.last_order) && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t('restaurant.lastOrder')}: {(operations?.last_order || restaurant?.last_order)}
            </Typography>
          </Box>
        )}
        {operations?.regular_holidays && operations.regular_holidays.length > 0 && (
          <Box sx={{ pt: 0.5, mt: 0.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="error.main">
              {t('restaurant.regularHolidays')}: {operations.regular_holidays.join(', ')}
            </Typography>
          </Box>
        )}
        {operations?.holiday_notice && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t('restaurant.holidayNotice')}: {operations.holiday_notice}
            </Typography>
          </Box>
        )}
      </Stack>
    );
  };

  // 태그를 카테고리별로 그룹화
  const groupTagsByCategory = () => {
    const grouped: { [key: string]: any[] } = {};
    tags.forEach(tag => {
      const category = tag.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(tag);
    });
    return grouped;
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

  const groupedTags = groupTagsByCategory();

  return (
    <MainLayout>
      <Box sx={{ width: '100%' }}>
        <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: { xs: 2, md: 4 } }}>
          {/* 왼쪽: 메인 콘텐츠 */}
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            {/* 대표 이미지 */}
            {photos.all.length > 0 && (
              <Box sx={{
                mb: 4,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: { xs: 2, md: 0 },
                '&:hover .main-restaurant-image': {
                  transform: 'scale(1.05)',
                },
              }}>
                <Box
                  component="img"
                  className="main-restaurant-image"
                  src={photos.all[selectedImage]?.url}
                  alt="맛집 사진"
                  sx={{
                    width: '100%',
                    height: { xs: 250, md: 500 },
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onClick={() => window.open(photos.all[selectedImage]?.url, '_blank')}
                />
              </Box>
            )}

            {/* 모바일: 사진 갤러리 - 대표 이미지 바로 아래 */}
            {photos.all.length > 0 && (
              <Box sx={{
                display: { xs: 'block', md: 'none' },
                mb: 4,
              }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {t('restaurant.photos')} ({photos.all.length})
                  </Typography>
                </Box>

                {/* 이미지 스와이프 캐러셀 */}
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: '100%',
                    gap: 1.5,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    pb: 1,
                    // 스크롤바 숨기기
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE/Edge
                  }}
                >
                  {photos.all.map((photo: any, idx: number) => (
                    <Box
                      key={idx}
                      sx={{
                        minWidth: 'calc((100vw - 56px) / 3)', // 뷰포트 기준: (100vw - 패딩32px - gap24px) / 3
                        width: 'calc((100vw - 56px) / 3)',
                        maxWidth: 'calc((100vw - 56px) / 3)',
                        flexShrink: 0,
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          paddingTop: '100%', // 정사각형 비율
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          borderRadius: 2,
                          border: selectedImage === idx ? '3px solid' : '3px solid transparent',
                          borderColor: selectedImage === idx ? 'primary.main' : 'transparent',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:active': {
                            transform: 'scale(0.95)',
                          },
                        }}
                        onClick={() => setSelectedImage(idx)}
                      >
                        <Box
                          component="img"
                          className="thumbnail-image"
                          src={photo.thumbnail || photo.url}
                          alt={`사진 ${idx + 1}`}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: selectedImage === idx ? 1 : 0.8,
                            transition: 'opacity 0.3s',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* 스와이프 힌트 (첫 방문자를 위한 안내) */}
                {photos.all.length > 3 && (
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      ← 좌우로 스와이프하여 더 많은 사진 보기 →
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* 헤더 - 신문 스타일 */}
            <Box sx={{ mb: 4 }}>
              {/* 카테고리 레이블 */}
              {restaurant.categories && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: restaurant.categories.color || 'primary.main',
                      fontWeight: 700,
                      letterSpacing: 2,
                      fontSize: '0.875rem'
                    }}
                  >
                    {restaurant.categories.icon} {restaurant.categories.name}
                    {restaurant.sub_category && ` / ${restaurant.sub_category}`}
                  </Typography>
                </Box>
              )}

              {/* 레스토랑 이름 - 대형 헤드라인 */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                {restaurant.name}
              </Typography>

              {/* 간단 소개 */}
              {restaurant.introduction && (
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 400 }}>
                  {restaurant.introduction}
                </Typography>
              )}

              {/* 평점 및 메타 정보 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarFilledIcon sx={{ fontSize: 24, color: '#FFD93D' }} />
                  <Typography variant="h5" fontWeight={700}>
                    {restaurant.rating ? restaurant.rating.toFixed(1) : '0.0'}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {t('restaurant.reviewCount')} {restaurant.review_count || 0}
                </Typography>
                {restaurant.avg_price_per_person && (
                  <>
                    <Typography color="text.secondary">•</Typography>
                    <Typography variant="body1" color="text.secondary">
                      {t('restaurant.avgPrice')} {restaurant.avg_price_per_person.toLocaleString()}원
                    </Typography>
                  </>
                )}
                {restaurant.price_range && (
                  <>
                    <Typography color="text.secondary">•</Typography>
                    <Typography variant="body1" color="text.secondary">
                      {translatePriceRange(restaurant.price_range)}
                    </Typography>
                  </>
                )}
                <Typography color="text.secondary">•</Typography>
                <Typography variant="body1" color="text.secondary">
                  {t('restaurant.viewCount')} {restaurant.view_count || 0}
                </Typography>
              </Box>

              {/* 액션 버튼 */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                <Button
                  variant={isFavorited ? "contained" : "outlined"}
                  startIcon={isFavorited ? <HeartFilledIcon /> : <HeartOutlineIcon />}
                  onClick={handleToggleFavorite}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {isFavorited ? t('restaurant.unfavorite') : t('restaurant.favorite')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {t('restaurant.share')}
                </Button>
              </Box>
            </Box>

            {/* 소개 - 신문 스타일 */}
            {restaurant.description && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    fontSize: '1.125rem',
                    color: 'text.primary',
                    fontWeight: 400,
                  }}
                >
                  {restaurant.description}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* 태그 섹션 - 카테고리별 분류 */}
            {tags && tags.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
                  {t('restaurant.tags')}
                </Typography>
                {Object.entries(groupedTags).map(([category, categoryTags]) => (
                  <Box key={category} sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                      {category}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {categoryTags.map((tag: any) => (
                        <Chip
                          key={tag.id}
                          label={`${tag.icon || ''} ${tag.name}`}
                          size="small"
                          sx={{
                            backgroundColor: tag.color ? `${tag.color}20` : undefined,
                            borderColor: tag.color || undefined,
                            color: tag.color || undefined,
                          }}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* 핵심 정보 - 신문 2컬럼 레이아웃 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                {t('restaurant.info')}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 4 } }}>
                {/* 주소 */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                    {t('restaurant.address')}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {restaurant.address}
                  </Typography>
                  {restaurant.road_address && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      도로명: {restaurant.road_address}
                    </Typography>
                  )}
                  {restaurant.jibun_address && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      지번: {restaurant.jibun_address}
                    </Typography>
                  )}
                  {restaurant.building_name && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      건물명: {restaurant.building_name}
                    </Typography>
                  )}
                  {restaurant.detailed_address && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      상세주소: {restaurant.detailed_address}
                    </Typography>
                  )}
                  {restaurant.postal_code && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      우편번호: {restaurant.postal_code}
                    </Typography>
                  )}
                </Box>

                {/* 연락처 */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                    {t('restaurant.contact')}
                  </Typography>
                  {(contacts?.phone || restaurant?.phone) && (
                    <Typography variant="body2" display="block">
                      {t('restaurant.phone')}: {(contacts?.phone || restaurant?.phone)}
                    </Typography>
                  )}
                  {contacts?.secondary_phone && (
                    <Typography variant="body2" display="block">
                      보조: {contacts.secondary_phone}
                    </Typography>
                  )}
                  {contacts?.email && (
                    <Typography variant="body2" display="block">
                      이메일: {contacts.email}
                    </Typography>
                  )}
                  {contacts?.fax && (
                    <Typography variant="body2" display="block">
                      팩스: {contacts.fax}
                    </Typography>
                  )}
                </Box>

                {/* 영업시간 */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                    {t('restaurant.hours')}
                  </Typography>
                  {renderBusinessHours()}
                </Box>

                {/* SNS / 링크 */}
                {((contacts?.website_url || restaurant?.website_url) || contacts?.blog_url || contacts?.instagram_url || contacts?.facebook_url || contacts?.youtube_url || contacts?.kakao_channel_url || contacts?.naver_place_url || contacts?.booking_url || contacts?.naver_booking_url) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                      SNS / 링크
                    </Typography>
                    <Stack spacing={0.5}>
                      {(contacts?.website_url || restaurant?.website_url) && (
                        <Link href={(contacts?.website_url || restaurant?.website_url)} target="_blank" rel="noopener" underline="hover">
                          <Typography variant="body2">{t('restaurant.website')}: {(contacts?.website_url || restaurant?.website_url)}</Typography>
                        </Link>
                      )}
                      {contacts?.blog_url && (
                        <Link href={contacts.blog_url} target="_blank" rel="noopener" underline="hover">
                          <Typography variant="body2">{t('restaurant.blog')}: {contacts.blog_url}</Typography>
                        </Link>
                      )}
                      {contacts?.instagram_url && (
                        <Link href={contacts.instagram_url} target="_blank" rel="noopener" underline="hover">
                          <Typography variant="body2">{t('restaurant.instagram')}: {contacts.instagram_url}</Typography>
                        </Link>
                      )}
                      {contacts?.facebook_url && (
                        <Link href={contacts.facebook_url} target="_blank" rel="noopener" underline="hover">
                          <Typography variant="body2">{t('restaurant.facebook')}: {contacts.facebook_url}</Typography>
                        </Link>
                      )}
                      {contacts?.youtube_url && (
                        <Link href={contacts.youtube_url} target="_blank" rel="noopener" underline="hover">
                          <Typography variant="body2">{t('restaurant.youtube')}: {contacts.youtube_url}</Typography>
                        </Link>
                      )}
                      {contacts?.kakao_channel_url && (
                        <Link href={contacts.kakao_channel_url} target="_blank" rel="noopener" underline="hover">
                          <Typography variant="body2">{t('restaurant.kakao')}: {contacts.kakao_channel_url}</Typography>
                        </Link>
                      )}
                      {contacts?.naver_place_url && (
                        <Link href={contacts.naver_place_url} target="_blank" rel="noopener" underline="hover">
                          <Typography variant="body2">{t('restaurant.naverPlace')}: {contacts.naver_place_url}</Typography>
                        </Link>
                      )}
                      {contacts?.booking_url && (
                        <Link href={contacts.booking_url} target="_blank" rel="noopener" underline="hover">
                          <Typography variant="body2">{t('restaurant.booking')}: {contacts.booking_url}</Typography>
                        </Link>
                      )}
                      {contacts?.naver_booking_url && (
                        <Link href={contacts.naver_booking_url} target="_blank" rel="noopener" underline="hover">
                          <Typography variant="body2">{t('restaurant.naverBooking')}: {contacts.naver_booking_url}</Typography>
                        </Link>
                      )}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 시설 / 서비스 정보 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                시설 / 서비스
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 4 } }}>
                {/* 주차 시설 */}
                {((facilities?.parking_available ?? restaurant?.parking_available) || (facilities?.valet_parking ?? restaurant?.valet_parking) || (facilities?.parking_spaces || restaurant?.parking_spaces) || (facilities?.parking_info || restaurant?.parking_info)) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                      {t('restaurant.parkingFacilities')}
                    </Typography>
                    <Stack spacing={0.5}>
                      {(facilities?.parking_available ?? restaurant?.parking_available) && (
                        <Typography variant="body2">주차 가능</Typography>
                      )}
                      {(facilities?.valet_parking ?? restaurant?.valet_parking) && (
                        <Typography variant="body2">발렛파킹</Typography>
                      )}
                      {(facilities?.parking_spaces || restaurant?.parking_spaces) && (
                        <Typography variant="body2">주차 공간: {(facilities?.parking_spaces || restaurant?.parking_spaces)}대</Typography>
                      )}
                      {(facilities?.parking_info || restaurant?.parking_info) && (
                        <Typography variant="caption" color="text.secondary">{(facilities?.parking_info || restaurant?.parking_info)}</Typography>
                      )}
                    </Stack>
                  </Box>
                )}

                {/* 편의 시설 */}
                {((facilities?.wifi_available ?? restaurant?.wifi_available) || (facilities?.wheelchair_accessible ?? restaurant?.wheelchair_accessible) || (facilities?.elevator_available ?? restaurant?.elevator_available) || (facilities?.nursing_room ?? restaurant?.nursing_room) || (facilities?.kids_zone ?? restaurant?.kids_zone) || (facilities?.pet_friendly ?? restaurant?.pet_friendly) || (facilities?.kids_menu ?? restaurant?.kids_menu)) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                      {t('restaurant.amenities')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {(facilities?.wifi_available ?? restaurant?.wifi_available) && <Chip label="무료 와이파이" size="small" variant="outlined" />}
                      {(facilities?.wheelchair_accessible ?? restaurant?.wheelchair_accessible) && <Chip label="휠체어 접근" size="small" variant="outlined" />}
                      {(facilities?.elevator_available ?? restaurant?.elevator_available) && <Chip label="엘리베이터" size="small" variant="outlined" />}
                      {(facilities?.nursing_room ?? restaurant?.nursing_room) && <Chip label="수유실" size="small" variant="outlined" />}
                      {(facilities?.kids_zone ?? restaurant?.kids_zone) && <Chip label="키즈존" size="small" variant="outlined" />}
                      {(facilities?.pet_friendly ?? restaurant?.pet_friendly) && <Chip label="반려동물 동반" size="small" variant="outlined" />}
                      {(facilities?.kids_menu ?? restaurant?.kids_menu) && <Chip label={t('restaurant.kidsMenu')} size="small" variant="outlined" />}
                    </Box>
                  </Box>
                )}

                {/* 좌석 정보 */}
                {((facilities?.group_seating ?? restaurant?.group_seating) || (facilities?.private_room ?? restaurant?.private_room) || (facilities?.outdoor_seating ?? restaurant?.outdoor_seating) || (facilities?.bar_seating ?? restaurant?.bar_seating) || (facilities?.total_seats || restaurant?.total_seats)) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                      {t('restaurant.seatingInfo')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {(facilities?.group_seating ?? restaurant?.group_seating) && <Chip label="단체석" size="small" variant="outlined" />}
                      {(facilities?.private_room ?? restaurant?.private_room) && <Chip label="프라이빗 룸" size="small" variant="outlined" />}
                      {(facilities?.outdoor_seating ?? restaurant?.outdoor_seating) && <Chip label="야외 좌석" size="small" variant="outlined" />}
                      {(facilities?.bar_seating ?? restaurant?.bar_seating) && <Chip label="바 좌석" size="small" variant="outlined" />}
                      {(facilities?.total_seats || restaurant?.total_seats) && (
                        <Typography variant="body2" sx={{ mt: 1 }}>총 좌석 수: {(facilities?.total_seats || restaurant?.total_seats)}석</Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {/* 예약 서비스 */}
                {((services?.reservation_available ?? restaurant?.reservation_available) || (services?.online_booking_available ?? restaurant?.online_booking_available) || services?.reservation_phone || services?.reservation_url) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                      {t('restaurant.reservationService')}
                    </Typography>
                    <Stack spacing={0.5}>
                      {(services?.reservation_available ?? restaurant?.reservation_available) && (
                        <Typography variant="body2">{t('restaurant.reservation')}</Typography>
                      )}
                      {(services?.online_booking_available ?? restaurant?.online_booking_available) && (
                        <Typography variant="body2">온라인 예약 가능</Typography>
                      )}
                      {services?.reservation_phone && (
                        <Typography variant="body2">{t('restaurant.reservationPhone')}: {services.reservation_phone}</Typography>
                      )}
                      {services?.reservation_url && (
                        <Link href={services.reservation_url} target="_blank" rel="noopener" underline="hover">
                          <Typography variant="body2">예약 URL: {services.reservation_url}</Typography>
                        </Link>
                      )}
                    </Stack>
                  </Box>
                )}

                {/* 배달/포장 */}
                {((services?.delivery_available ?? restaurant?.delivery_available) || (services?.takeout_available ?? restaurant?.takeout_available)) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                      배달/포장
                    </Typography>
                    <Stack spacing={0.5}>
                      {(services?.delivery_available ?? restaurant?.delivery_available) && (
                        <Box>
                          <Typography variant="body2">배달 가능</Typography>
                          {(services?.delivery_fee ?? restaurant?.delivery_fee) !== null && (services?.delivery_fee ?? restaurant?.delivery_fee) !== undefined && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              배달비: {(services?.delivery_fee ?? restaurant?.delivery_fee) === 0 ? '무료' : `${(services?.delivery_fee ?? restaurant?.delivery_fee).toLocaleString()}원`}
                            </Typography>
                          )}
                          {(services?.min_order_amount || restaurant?.min_order_amount) && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              최소 주문금액: {(services?.min_order_amount || restaurant?.min_order_amount).toLocaleString()}원
                            </Typography>
                          )}
                        </Box>
                      )}
                      {(services?.takeout_available ?? restaurant?.takeout_available) && (
                        <Typography variant="body2">포장 가능</Typography>
                      )}
                    </Stack>
                  </Box>
                )}

                {/* 결제 수단 */}
                {((services?.card_payment ?? restaurant?.card_payment) || (services?.cash_payment ?? restaurant?.cash_payment) || (services?.mobile_payment ?? restaurant?.mobile_payment)) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                      결제 수단
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {(services?.card_payment ?? restaurant?.card_payment) && <Chip label="카드 결제" size="small" variant="outlined" />}
                      {(services?.cash_payment ?? restaurant?.cash_payment) && <Chip label="현금 결제" size="small" variant="outlined" />}
                      {(services?.mobile_payment ?? restaurant?.mobile_payment) && <Chip label="모바일 결제" size="small" variant="outlined" />}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 탭 네비게이션 */}
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
                <Tab label={`${t('restaurant.reviews')} (${reviews.length})`} />
                <Tab label={`${t('restaurant.menu')} (${menus.all.length})`} />
                <Tab label={t('restaurant.map')} />
              </Tabs>
            </Box>

            {/* 리뷰 탭 */}
            {selectedTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight={700}>
                    {t('restaurant.reviews')}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<ReviewIcon />}
                    onClick={() => setReviewDialogOpen(true)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {t('restaurant.addReview')}
                  </Button>
                </Box>

                {reviews.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">첫 번째 리뷰를 작성해보세요!</Typography>
                ) : (
                  <Stack spacing={3} divider={<Divider />}>
                    {reviews.map((review) => {
                      const isOwnReview = user?.id === review.user_id;
                      const isHelpful = helpfulReviews.has(review.id);

                      return (
                        <Box key={review.id}>
                          {/* 리뷰 헤더 */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Avatar src={review.is_anonymous ? undefined : review.avatar_url} sx={{ width: 48, height: 48 }}>
                                {review.username?.[0] || '익'}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={600}>
                                  {review.username || '익명'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Rating value={review.rating || 0} size="small" readOnly />
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </Typography>
                                </Box>
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

                          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
                            {review.content}
                          </Typography>

                          {review.images && review.images.length > 0 && (
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 1, mb: 2 }}>
                              {review.images.map((img: string, idx: number) => (
                                <Box
                                  key={idx}
                                  sx={{
                                    width: '100%',
                                    paddingTop: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
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
                                sx={{ textTransform: 'none' }}
                              >
                                도움돼요 {review.helpful_count > 0 && `(${review.helpful_count})`}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Report />}
                                onClick={() => handleOpenReportDialog(review.id)}
                                sx={{ textTransform: 'none' }}
                              >
                                신고
                              </Button>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Box>
            )}

            {/* 메뉴 탭 */}
            {selectedTab === 1 && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                  {t('restaurant.menu')}
                </Typography>
                {menus.all.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">{t('restaurant.noMenuInfo')}</Typography>
                ) : (
                  <Box>
                    {/* 시그니처 메뉴 */}
                    {menus.signature && menus.signature.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                          {t('restaurant.signatureMenu')}
                        </Typography>
                        <Stack spacing={3} divider={<Divider />}>
                          {menus.signature.map((menu: any) => (
                            <Box key={menu.id} sx={{ display: 'flex', gap: 3 }}>
                              {menu.images && menu.images.length > 0 && menu.images[0].url && (
                                <Box
                                  component="img"
                                  src={menu.images[0].medium || menu.images[0].url}
                                  alt={menu.name}
                                  sx={{
                                    width: 120,
                                    height: 120,
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                  <Box>
                                    <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                                      {menu.is_signature && (
                                        <Chip label={t('restaurant.signature')} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                      {menu.is_seasonal && (
                                        <Chip label={t('restaurant.seasonalMenu')} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#4ECDC4', color: 'white' }} />
                                      )}
                                      {menu.category && (
                                        <Chip label={menu.category} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>
                                      {menu.name}
                                    </Typography>
                                    {menu.name_en && (
                                      <Typography variant="caption" color="text.secondary">
                                        {menu.name_en}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Box sx={{ textAlign: 'right' }}>
                                    {menu.original_price && menu.original_price > menu.price && (
                                      <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', display: 'block' }}>
                                        {menu.original_price.toLocaleString()}원
                                      </Typography>
                                    )}
                                    <Typography variant="h6" fontWeight={700}>
                                      {menu.price?.toLocaleString()}원
                                    </Typography>
                                  </Box>
                                </Box>

                                {menu.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {menu.description}
                                  </Typography>
                                )}

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                                      {menu.calories} kcal
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* 인기 메뉴 */}
                    {menus.popular && menus.popular.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                          {t('restaurant.popularMenu')}
                        </Typography>
                        <Stack spacing={3} divider={<Divider />}>
                          {menus.popular.map((menu: any) => (
                            <Box key={menu.id} sx={{ display: 'flex', gap: 3 }}>
                              {menu.images && menu.images.length > 0 && menu.images[0].url && (
                                <Box
                                  component="img"
                                  src={menu.images[0].medium || menu.images[0].url}
                                  alt={menu.name}
                                  sx={{
                                    width: 120,
                                    height: 120,
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                  <Box>
                                    <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                                      {menu.is_popular && (
                                        <Chip label="인기" size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#FFD93D', color: '#2C3E50' }} />
                                      )}
                                      {menu.category && (
                                        <Chip label={menu.category} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>
                                      {menu.name}
                                    </Typography>
                                  </Box>
                                  <Typography variant="h6" fontWeight={700}>
                                    {menu.price?.toLocaleString()}원
                                  </Typography>
                                </Box>

                                {menu.description && (
                                  <Typography variant="body2" color="text.secondary">
                                    {menu.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* 전체 메뉴 */}
                    {menus.all && menus.all.length > 0 && (
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                          {t('restaurant.allMenu')}
                        </Typography>
                        <Stack spacing={3} divider={<Divider />}>
                          {menus.all.map((menu: any) => (
                            <Box key={menu.id} sx={{ display: 'flex', gap: 3 }}>
                              {menu.images && menu.images.length > 0 && menu.images[0].url && (
                                <Box
                                  component="img"
                                  src={menu.images[0].medium || menu.images[0].url}
                                  alt={menu.name}
                                  sx={{
                                    width: 120,
                                    height: 120,
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                  <Box>
                                    <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                                      {menu.is_signature && (
                                        <Chip label={t('restaurant.signature')} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                      {menu.is_popular && (
                                        <Chip label="인기" size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#FFD93D', color: '#2C3E50' }} />
                                      )}
                                      {menu.is_new && (
                                        <Chip label={t('restaurant.newMenu')} size="small" color="secondary" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                      {menu.category && (
                                        <Chip label={menu.category} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                      {!menu.is_available && (
                                        <Chip label="품절" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                                      )}
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>
                                      {menu.name}
                                    </Typography>
                                    {menu.name_en && (
                                      <Typography variant="caption" color="text.secondary">
                                        {menu.name_en}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Box sx={{ textAlign: 'right' }}>
                                    {menu.original_price && menu.original_price > menu.price && (
                                      <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', display: 'block' }}>
                                        {menu.original_price.toLocaleString()}원
                                      </Typography>
                                    )}
                                    <Typography variant="h6" fontWeight={700}>
                                      {menu.price?.toLocaleString()}원
                                    </Typography>
                                  </Box>
                                </Box>

                                {menu.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {menu.description}
                                  </Typography>
                                )}

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                                      {menu.calories} kcal
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Stack>
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
                <Box sx={{ height: 400, overflow: 'hidden' }}>
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

          {/* 오른쪽: 사진 갤러리 (PC만 표시) */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {photos.all.length > 0 && (
              <Box
                sx={{
                  mb: 4,
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {t('restaurant.photos')} ({photos.all.length})
                  </Typography>
                </Box>

                {/* 이미지 그리드 */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 0.5,
                  }}
                >
                  {photos.all
                    .slice(0, isImageListExpanded ? undefined : 12)
                    .map((photo: any, idx: number) => (
                      <Box
                        key={idx}
                        sx={{
                          width: '100%',
                          paddingTop: '100%',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          opacity: selectedImage === idx ? 1 : 0.7,
                          transition: 'opacity 0.2s',
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                        onClick={() => setSelectedImage(idx)}
                      >
                        <Box
                          component="img"
                          className="thumbnail-image"
                          src={photo.thumbnail || photo.url}
                          alt={`사진 ${idx + 1}`}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        />
                      </Box>
                    ))}
                </Box>

                {/* 더보기 버튼 */}
                {photos.all.length > 12 && (
                  <Button
                    fullWidth
                    variant="text"
                    size="small"
                    onClick={() => setIsImageListExpanded(!isImageListExpanded)}
                    sx={{
                      mt: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                    endIcon={isImageListExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  >
                    {isImageListExpanded ? '접기' : `${photos.all.length - 12}장 더보기`}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
      </Box>

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
