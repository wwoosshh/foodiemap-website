import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  FormControlLabel,
  Checkbox,
  Stack,
  Link,
  Paper,
  LinearProgress,
  Skeleton,
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
  Phone,
  Place,
  AccessTime,
  ContentCopy,
  NavigationOutlined,
  CheckCircleOutline,
  ExpandMore,
  ExpandLess,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import { openCloudinaryWidget } from '../lib/cloudinary';

// 영업 상태 계산 함수
const getBusinessStatus = (operations: any): { status: 'open' | 'break' | 'closed'; text: string } => {
  if (!operations?.business_hours) {
    return { status: 'closed', text: '정보 없음' };
  }

  const now = new Date();
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = dayNames[now.getDay()];
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const todayHours = operations.business_hours[today];

  if (!todayHours || todayHours.closed) {
    return { status: 'closed', text: '휴무일' };
  }

  const parseTime = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 100 + m;
  };

  const openTime = parseTime(todayHours.open);
  const closeTime = parseTime(todayHours.close);

  // 브레이크 타임 체크
  if (operations.break_time) {
    const breakMatch = operations.break_time.match(/(\d{2}:\d{2})\s*[-~]\s*(\d{2}:\d{2})/);
    if (breakMatch) {
      const breakStart = parseTime(breakMatch[1]);
      const breakEnd = parseTime(breakMatch[2]);
      if (currentTime >= breakStart && currentTime < breakEnd) {
        return { status: 'break', text: '브레이크타임' };
      }
    }
  }

  if (currentTime >= openTime && currentTime < closeTime) {
    return { status: 'open', text: '영업중' };
  }

  return { status: 'closed', text: '영업 종료' };
};

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // 데이터 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [menus, setMenus] = useState<any>({ all: [], signature: [], popular: [] });
  const [photos, setPhotos] = useState<any>({ all: [], representative: [] });
  const [tags, setTags] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any>({});
  const [facilities, setFacilities] = useState<any>({});
  const [operations, setOperations] = useState<any>({});
  const [services, setServices] = useState<any>({});
  const [isFavorited, setIsFavorited] = useState(false);

  // UI 상태
  const [activeSection, setActiveSection] = useState('menu');
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // 리뷰 작성 상태
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewIsAnonymous, setReviewIsAnonymous] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [editingReview, setEditingReview] = useState<any>(null);

  // 리뷰 인터랙션
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // Refs
  const tabRef = useRef<HTMLDivElement>(null);
  const menuSectionRef = useRef<HTMLDivElement>(null);
  const reviewSectionRef = useRef<HTMLDivElement>(null);
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // 조회수 중복 방지
  const getViewedKey = (restaurantId: string) => `viewed_restaurant_${restaurantId}`;

  const hasAlreadyViewed = (restaurantId: string): boolean => {
    try {
      const viewedTime = sessionStorage.getItem(getViewedKey(restaurantId));
      if (!viewedTime) return false;
      const thirtyMinutes = 30 * 60 * 1000;
      return Date.now() - parseInt(viewedTime, 10) < thirtyMinutes;
    } catch {
      return false;
    }
  };

  const markAsViewed = (restaurantId: string) => {
    try {
      sessionStorage.setItem(getViewedKey(restaurantId), Date.now().toString());
    } catch {}
  };

  // 데이터 로드
  useEffect(() => {
    if (id) {
      loadRestaurantData();
    }
  }, [id]);

  useEffect(() => {
    if (id && restaurant) {
      loadRestaurantData(true);
    }
  }, [language]);

  // Sticky Tab & Section Observer
  useEffect(() => {
    const handleScroll = () => {
      if (tabRef.current) {
        const tabTop = tabRef.current.getBoundingClientRect().top;
        setIsTabSticky(tabTop <= 64);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-section');
          if (id) setActiveSection(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    [menuSectionRef, reviewSectionRef, infoSectionRef, mapSectionRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [restaurant]);

  const loadRestaurantData = async (skipViewCount: boolean = false) => {
    const shouldSkipViewCount = skipViewCount || hasAlreadyViewed(id!);
    if (!shouldSkipViewCount) {
      markAsViewed(id!);
    }

    try {
      setLoading(true);
      const response = await ApiService.getRestaurantCompleteData(id!, language, shouldSkipViewCount);

      if (response.success && response.data) {
        const restaurantData = response.data.restaurant;
        setRestaurant(restaurantData);
        setReviews(response.data.reviews?.items || []);
        setReviewStats(response.data.reviews?.stats || null);

        // SEO
        if (restaurantData) {
          updateMetaTags(generateRestaurantMeta(restaurantData));
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

        // 메뉴
        if (response.data.menus && typeof response.data.menus === 'object' && 'all' in response.data.menus) {
          setMenus(response.data.menus);
        } else {
          setMenus({ all: response.data.menus || [], signature: [], popular: [] });
        }

        setPhotos(response.data.photos || { all: [], representative: [] });
        setTags(response.data.tags || []);
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

  // 핸들러들
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
      alert(err.userMessage || '처리에 실패했습니다.');
    }
  };

  const handleCopyAddress = () => {
    const address = restaurant?.address || '';
    navigator.clipboard.writeText(address).then(() => {
      // 복사 완료 (토스트 메시지 대신 조용히 처리)
    }).catch(() => {});
  };

  const handleShare = async () => {
    const shareData = {
      title: restaurant?.name,
      text: restaurant?.introduction || restaurant?.name,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      menu: menuSectionRef,
      review: reviewSectionRef,
      info: infoSectionRef,
      map: mapSectionRef,
    };

    const ref = refs[sectionId];
    if (ref?.current) {
      const yOffset = -120;
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
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
      closeReviewDialog();
      loadRestaurantData(true);
    } catch (err: any) {
      alert(err.userMessage || '리뷰 작성에 실패했습니다.');
    }
  };

  const handleUpdateReview = async () => {
    if (!user || !editingReview) return;
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
      closeReviewDialog();
      loadRestaurantData(true);
    } catch (err: any) {
      alert(err.userMessage || '리뷰 수정에 실패했습니다.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) return;

    try {
      await ApiService.deleteReview(reviewId);
      alert('리뷰가 삭제되었습니다.');
      loadRestaurantData(true);
    } catch (err: any) {
      alert(err.userMessage || '리뷰 삭제에 실패했습니다.');
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
        const newHelpfulReviews = new Set(helpfulReviews);
        if (response.data.is_helpful) {
          newHelpfulReviews.add(reviewId);
        } else {
          newHelpfulReviews.delete(reviewId);
        }
        setHelpfulReviews(newHelpfulReviews);
        setReviews(reviews.map(review =>
          review.id === reviewId
            ? { ...review, helpful_count: response.data.helpful_count }
            : review
        ));
      }
    } catch (err: any) {
      alert(err.userMessage || '처리에 실패했습니다.');
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

  const closeReviewDialog = () => {
    setReviewDialogOpen(false);
    setEditingReview(null);
    setReviewTitle('');
    setReviewContent('');
    setReviewRating(5);
    setReviewIsAnonymous(false);
    setReviewImages([]);
  };

  // 영업시간 렌더링
  const renderBusinessHours = () => {
    const hours = operations?.business_hours;
    if (!hours || typeof hours !== 'object') {
      return <Typography variant="body2" color="text.secondary">정보 없음</Typography>;
    }

    const weekdays = [
      { key: 'mon', label: '월' },
      { key: 'tue', label: '화' },
      { key: 'wed', label: '수' },
      { key: 'thu', label: '목' },
      { key: 'fri', label: '금' },
      { key: 'sat', label: '토' },
      { key: 'sun', label: '일' },
    ];

    return (
      <Box>
        {weekdays.map((day) => {
          const dayData = hours[day.key];
          let displayText = '-';
          const isClosed = dayData?.closed;

          if (dayData && !isClosed && dayData.open && dayData.close) {
            displayText = `${dayData.open} - ${dayData.close}`;
          } else if (isClosed) {
            displayText = '휴무';
          }

          return (
            <Box key={day.key} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ width: 24 }}>
                {day.label}
              </Typography>
              <Typography
                variant="body2"
                color={isClosed ? 'error.main' : 'text.primary'}
                fontWeight={isClosed ? 500 : 400}
              >
                {displayText}
              </Typography>
            </Box>
          );
        })}
        {operations?.break_time && (
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              브레이크타임: {operations.break_time}
            </Typography>
          </Box>
        )}
        {operations?.last_order && (
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              라스트오더: {operations.last_order}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  // 평점 분포 계산
  const getRatingDistribution = () => {
    if (!reviews.length) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    const dist: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rating = Math.round(r.rating);
      if (rating >= 1 && rating <= 5) {
        dist[rating]++;
      }
    });
    return dist;
  };

  // 로딩 상태
  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 3 }} />
          <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
          </Box>
        </Box>
      </MainLayout>
    );
  }

  // 에러 상태
  if (error || !restaurant) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Alert severity="error">{error || '맛집을 찾을 수 없습니다.'}</Alert>
        </Container>
      </MainLayout>
    );
  }

  const businessStatus = getBusinessStatus(operations);
  const ratingDist = getRatingDistribution();
  const maxRatingCount = Math.max(...Object.values(ratingDist), 1);

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8 }}>
        {/* Hero 이미지 섹션 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
            gap: 0.5,
            height: { xs: 280, md: 420 },
            mb: { xs: 0, md: 0 },
            cursor: 'pointer',
          }}
          onClick={() => {
            setGalleryIndex(0);
            setGalleryOpen(true);
          }}
        >
          {/* 대표 이미지 */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: 'grey.200',
              borderRadius: { xs: 0, md: '0 0 0 0' },
            }}
          >
            {photos.all.length > 0 ? (
              <Box
                component="img"
                src={photos.all[0]?.url}
                alt={restaurant.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.02)' },
                }}
              />
            ) : (
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.100',
              }}>
                <Typography color="text.secondary">이미지 없음</Typography>
              </Box>
            )}
          </Box>

          {/* 서브 이미지 그리드 (PC only) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 0.5,
            }}
          >
            {[1, 2, 3, 4].map((idx) => (
              <Box
                key={idx}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'grey.200',
                }}
              >
                {photos.all[idx] ? (
                  <Box
                    component="img"
                    src={photos.all[idx]?.thumbnail || photos.all[idx]?.url}
                    alt={`${restaurant.name} ${idx + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  />
                ) : (
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'grey.100',
                  }} />
                )}

                {/* 더보기 오버레이 */}
                {idx === 4 && photos.all.length > 5 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      },
                    }}
                  >
                    <Typography color="white" fontWeight={600}>
                      +{photos.all.length - 5}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* 모바일 이미지 인디케이터 */}
        {photos.all.length > 1 && (
          <Box sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            py: 1.5,
            gap: 0.5,
          }}>
            {photos.all.slice(0, 5).map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: idx === 0 ? 'primary.main' : 'grey.300',
                }}
              />
            ))}
            {photos.all.length > 5 && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                +{photos.all.length - 5}
              </Typography>
            )}
          </Box>
        )}

        {/* 맛집 헤더 정보 */}
        <Box sx={{ px: { xs: 2, md: 4 }, pt: { xs: 2, md: 4 }, pb: 3 }}>
          {/* 카테고리 */}
          {restaurant.categories && (
            <Typography
              variant="body2"
              sx={{
                color: restaurant.categories.color || 'primary.main',
                fontWeight: 600,
                mb: 1,
              }}
            >
              {restaurant.categories.name}
              {restaurant.sub_category && ` · ${restaurant.sub_category}`}
            </Typography>
          )}

          {/* 맛집명 */}
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            {restaurant.name}
          </Typography>

          {/* 소개 */}
          {restaurant.introduction && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {restaurant.introduction}
            </Typography>
          )}

          {/* 평점 & 통계 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarFilledIcon sx={{ fontSize: 20, color: '#FFB800' }} />
              <Typography variant="body1" fontWeight={700}>
                {restaurant.rating ? restaurant.rating.toFixed(1) : '-'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              리뷰 {restaurant.review_count || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              조회 {restaurant.view_count?.toLocaleString() || 0}
            </Typography>
          </Box>

          {/* 액션 버튼 */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant={isFavorited ? 'contained' : 'outlined'}
              startIcon={isFavorited ? <HeartFilledIcon /> : <HeartOutlineIcon />}
              onClick={handleToggleFavorite}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
              }}
            >
              {isFavorited ? '저장됨' : '저장'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShare}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
              }}
            >
              공유
            </Button>
            <Button
              variant="outlined"
              startIcon={<ReviewIcon />}
              onClick={() => setReviewDialogOpen(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
              }}
            >
              리뷰 작성
            </Button>
          </Box>

          {/* 태그 */}
          {tags && tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 3 }}>
              {tags.slice(0, 8).map((tag: any) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    fontSize: '0.8125rem',
                    height: 28,
                  }}
                />
              ))}
              {tags.length > 8 && (
                <Chip
                  label={`+${tags.length - 8}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    fontSize: '0.8125rem',
                    height: 28,
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Sticky 탭 네비게이션 */}
        <Box
          ref={tabRef}
          sx={{
            position: 'sticky',
            top: 64,
            zIndex: 100,
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            transition: 'box-shadow 0.2s',
            boxShadow: isTabSticky ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <Box sx={{
            display: 'flex',
            px: { xs: 2, md: 4 },
            maxWidth: 1200,
            mx: 'auto',
          }}>
            {[
              { id: 'menu', label: '메뉴' },
              { id: 'review', label: `리뷰 ${reviews.length > 0 ? `(${reviews.length})` : ''}` },
              { id: 'info', label: '정보' },
              { id: 'map', label: '위치' },
            ].map((tab) => (
              <Box
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                sx={{
                  py: 2,
                  px: { xs: 2, md: 3 },
                  cursor: 'pointer',
                  borderBottom: '2px solid',
                  borderColor: activeSection === tab.id ? 'primary.main' : 'transparent',
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    borderColor: activeSection === tab.id ? 'primary.main' : 'grey.300',
                  },
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={activeSection === tab.id ? 700 : 500}
                  color={activeSection === tab.id ? 'primary.main' : 'text.secondary'}
                >
                  {tab.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Quick Info 카드 */}
        <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            {/* 위치 */}
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Place sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  위치
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                {restaurant.address || '주소 정보 없음'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                <Button
                  size="small"
                  startIcon={<ContentCopy sx={{ fontSize: 16 }} />}
                  onClick={(e) => { e.stopPropagation(); handleCopyAddress(); }}
                  sx={{ textTransform: 'none', fontSize: '0.8125rem' }}
                >
                  복사
                </Button>
                <Button
                  size="small"
                  startIcon={<NavigationOutlined sx={{ fontSize: 16 }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(restaurant.address)}`, '_blank');
                  }}
                  sx={{ textTransform: 'none', fontSize: '0.8125rem' }}
                >
                  길찾기
                </Button>
              </Box>
            </Paper>

            {/* 영업시간 */}
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  영업시간
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor:
                      businessStatus.status === 'open' ? '#22C55E' :
                      businessStatus.status === 'break' ? '#F59E0B' : '#EF4444',
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={
                    businessStatus.status === 'open' ? 'success.main' :
                    businessStatus.status === 'break' ? 'warning.main' : 'error.main'
                  }
                >
                  {businessStatus.text}
                </Typography>
              </Box>
              {operations?.business_hours && (
                <Typography variant="body2" color="text.secondary">
                  {(() => {
                    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
                    const today = dayNames[new Date().getDay()];
                    const todayHours = operations.business_hours[today];
                    if (todayHours?.open && todayHours?.close) {
                      return `오늘 ${todayHours.open} - ${todayHours.close}`;
                    }
                    return '';
                  })()}
                </Typography>
              )}
            </Paper>

            {/* 연락처 */}
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  연락처
                </Typography>
              </Box>
              <Typography variant="body2">
                {contacts?.phone || restaurant?.phone || '전화번호 없음'}
              </Typography>
              {(contacts?.phone || restaurant?.phone) && (
                <Button
                  size="small"
                  variant="outlined"
                  href={`tel:${contacts?.phone || restaurant?.phone}`}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.8125rem',
                    mt: 'auto',
                    alignSelf: 'flex-start',
                  }}
                >
                  전화하기
                </Button>
              )}
            </Paper>

            {/* 편의정보 */}
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
                편의정보
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(facilities?.parking_available || restaurant?.parking_available) && (
                  <Chip label="주차" size="small" sx={{ height: 24, fontSize: '0.75rem' }} />
                )}
                {(facilities?.wifi_available || restaurant?.wifi_available) && (
                  <Chip label="WiFi" size="small" sx={{ height: 24, fontSize: '0.75rem' }} />
                )}
                {(services?.reservation_available || restaurant?.reservation_available) && (
                  <Chip label="예약" size="small" sx={{ height: 24, fontSize: '0.75rem' }} />
                )}
                {(services?.delivery_available || restaurant?.delivery_available) && (
                  <Chip label="배달" size="small" sx={{ height: 24, fontSize: '0.75rem' }} />
                )}
                {(services?.takeout_available || restaurant?.takeout_available) && (
                  <Chip label="포장" size="small" sx={{ height: 24, fontSize: '0.75rem' }} />
                )}
              </Box>
            </Paper>
          </Box>
        </Box>

        <Divider sx={{ mx: { xs: 2, md: 4 } }} />

        {/* 메뉴 섹션 */}
        <Box
          ref={menuSectionRef}
          data-section="menu"
          sx={{ px: { xs: 2, md: 4 }, py: 4 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              메뉴
            </Typography>
            {menus.all.length > 4 && (
              <Button
                endIcon={<ArrowForward />}
                onClick={() => setShowAllMenu(true)}
                sx={{ textTransform: 'none' }}
              >
                전체 메뉴
              </Button>
            )}
          </Box>

          {menus.all.length === 0 ? (
            <Typography color="text.secondary">메뉴 정보가 없습니다.</Typography>
          ) : (
            <Box>
              {/* 시그니처 메뉴 */}
              {menus.signature && menus.signature.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    시그니처
                  </Typography>
                  <Stack spacing={2}>
                    {menus.signature.slice(0, 2).map((menu: any) => (
                      <Paper
                        key={menu.id}
                        variant="outlined"
                        sx={{
                          display: 'flex',
                          overflow: 'hidden',
                          borderRadius: 2,
                        }}
                      >
                        {menu.images?.[0]?.url && (
                          <Box
                            component="img"
                            src={menu.images[0].medium || menu.images[0].url}
                            alt={menu.name}
                            sx={{
                              width: { xs: 100, sm: 140 },
                              height: { xs: 100, sm: 140 },
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {menu.name}
                              </Typography>
                              {menu.name_en && (
                                <Typography variant="caption" color="text.secondary">
                                  {menu.name_en}
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {menu.price?.toLocaleString()}원
                            </Typography>
                          </Box>
                          {menu.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {menu.description}
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* 인기 메뉴 (수평 스크롤) */}
              {menus.popular && menus.popular.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    인기 메뉴
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      overflowX: 'auto',
                      pb: 1,
                      mx: { xs: -2, md: 0 },
                      px: { xs: 2, md: 0 },
                      '&::-webkit-scrollbar': { display: 'none' },
                      scrollbarWidth: 'none',
                    }}
                  >
                    {menus.popular.map((menu: any) => (
                      <Box
                        key={menu.id}
                        sx={{
                          minWidth: 160,
                          maxWidth: 160,
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 160,
                            height: 160,
                            borderRadius: 2,
                            overflow: 'hidden',
                            mb: 1.5,
                            backgroundColor: 'grey.100',
                          }}
                        >
                          {menu.images?.[0]?.url ? (
                            <Box
                              component="img"
                              src={menu.images[0].medium || menu.images[0].url}
                              alt={menu.name}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Box sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Typography variant="caption" color="text.secondary">
                                이미지 없음
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {menu.name}
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {menu.price?.toLocaleString()}원
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* 전체 메뉴 (일부만 표시) */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  전체 메뉴
                </Typography>
                <Stack spacing={0} divider={<Divider />}>
                  {menus.all.slice(0, 6).map((menu: any) => (
                    <Box
                      key={menu.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 2,
                      }}
                    >
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body1" fontWeight={500}>
                            {menu.name}
                          </Typography>
                          {menu.is_signature && (
                            <Chip
                              label="시그니처"
                              size="small"
                              color="primary"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                          {menu.is_popular && (
                            <Chip
                              label="인기"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: '#FEF3C7',
                                color: '#92400E',
                              }}
                            />
                          )}
                          {!menu.is_available && (
                            <Chip
                              label="품절"
                              size="small"
                              color="error"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                        {menu.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {menu.description}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body1" fontWeight={600} sx={{ flexShrink: 0 }}>
                        {menu.price?.toLocaleString()}원
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                {menus.all.length > 6 && (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowAllMenu(true)}
                    sx={{ mt: 2, textTransform: 'none', borderRadius: 2 }}
                  >
                    전체 메뉴 보기 ({menus.all.length}개)
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>

        <Divider sx={{ mx: { xs: 2, md: 4 } }} />

        {/* 리뷰 섹션 */}
        <Box
          ref={reviewSectionRef}
          data-section="review"
          sx={{ px: { xs: 2, md: 4 }, py: 4 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              리뷰
            </Typography>
            <Button
              variant="contained"
              startIcon={<ReviewIcon />}
              onClick={() => setReviewDialogOpen(true)}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              리뷰 작성
            </Button>
          </Box>

          {reviews.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                아직 작성된 리뷰가 없습니다.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setReviewDialogOpen(true)}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                첫 리뷰 작성하기
              </Button>
            </Box>
          ) : (
            <Box>
              {/* 평점 요약 */}
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2,
                  display: 'flex',
                  gap: { xs: 3, md: 6 },
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                }}
              >
                {/* 평균 평점 */}
                <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                  <Typography variant="h3" fontWeight={700}>
                    {restaurant.rating?.toFixed(1) || '-'}
                  </Typography>
                  <Rating
                    value={restaurant.rating || 0}
                    precision={0.1}
                    readOnly
                    size="small"
                    sx={{ mb: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {reviews.length}개 리뷰
                  </Typography>
                </Box>

                {/* 평점 분포 */}
                <Box sx={{ flex: 1 }}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Box
                      key={rating}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ width: 16, textAlign: 'right' }}>
                        {rating}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(ratingDist[rating] / maxRatingCount) * 100}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 1,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#FFB800',
                            borderRadius: 1,
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ width: 24, textAlign: 'right' }}
                      >
                        {ratingDist[rating]}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* 리뷰 목록 */}
              <Stack spacing={3}>
                {(showAllReviews ? reviews : reviews.slice(0, 5)).map((review) => {
                  const isOwnReview = user?.id === review.user_id;
                  const isHelpful = helpfulReviews.has(review.id);

                  return (
                    <Box key={review.id}>
                      {/* 리뷰 헤더 */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Avatar
                            src={review.is_anonymous ? undefined : review.avatar_url}
                            sx={{ width: 40, height: 40 }}
                          >
                            {(review.username?.[0] || '익').toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {review.is_anonymous ? '익명' : (review.username || '사용자')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Rating value={review.rating || 0} size="small" readOnly />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(review.created_at).toLocaleDateString('ko-KR')}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {isOwnReview && (
                          <Box>
                            <IconButton size="small" onClick={() => handleOpenEditDialog(review)}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteReview(review.id)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>

                      {/* 리뷰 내용 */}
                      {review.title && (
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                          {review.title}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
                        {review.content}
                      </Typography>

                      {/* 리뷰 이미지 */}
                      {review.images && review.images.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          {review.images.map((img: string, idx: number) => (
                            <Box
                              key={idx}
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 1,
                                overflow: 'hidden',
                                cursor: 'pointer',
                              }}
                              onClick={() => window.open(img, '_blank')}
                            >
                              <Box
                                component="img"
                                src={img}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* 리뷰 액션 */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!isOwnReview && user && (
                          <>
                            <Button
                              size="small"
                              variant={isHelpful ? 'contained' : 'text'}
                              startIcon={isHelpful ? <ThumbUp /> : <ThumbUpOutlined />}
                              onClick={() => handleToggleHelpful(review.id)}
                              sx={{
                                textTransform: 'none',
                                color: isHelpful ? undefined : 'text.secondary',
                              }}
                            >
                              도움돼요 {review.helpful_count > 0 && review.helpful_count}
                            </Button>
                            <Button
                              size="small"
                              startIcon={<Report />}
                              onClick={() => {
                                setReportingReviewId(review.id);
                                setReportDialogOpen(true);
                              }}
                              sx={{ textTransform: 'none', color: 'text.secondary' }}
                            >
                              신고
                            </Button>
                          </>
                        )}
                        {!user && (
                          <Typography variant="caption" color="text.secondary">
                            {review.helpful_count > 0 && `${review.helpful_count}명에게 도움됨`}
                          </Typography>
                        )}
                      </Box>

                      <Divider sx={{ mt: 3 }} />
                    </Box>
                  );
                })}
              </Stack>

              {reviews.length > 5 && !showAllReviews && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setShowAllReviews(true)}
                  sx={{ mt: 3, textTransform: 'none', borderRadius: 2 }}
                >
                  리뷰 더보기 ({reviews.length - 5}개)
                </Button>
              )}
            </Box>
          )}
        </Box>

        <Divider sx={{ mx: { xs: 2, md: 4 } }} />

        {/* 상세 정보 섹션 */}
        <Box
          ref={infoSectionRef}
          data-section="info"
          sx={{ px: { xs: 2, md: 4 }, py: 4 }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            상세 정보
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            {/* 영업 정보 */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                영업 정보
              </Typography>
              {renderBusinessHours()}

              {operations?.regular_holidays && operations.regular_holidays.length > 0 && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    정기휴무: {operations.regular_holidays.join(', ')}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* 시설 정보 */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                시설
              </Typography>
              <Stack spacing={1}>
                {(facilities?.parking_available || restaurant?.parking_available) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">
                      주차 가능
                      {facilities?.parking_spaces && ` (${facilities.parking_spaces}대)`}
                    </Typography>
                  </Box>
                )}
                {facilities?.valet_parking && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">발렛파킹</Typography>
                  </Box>
                )}
                {(facilities?.wifi_available || restaurant?.wifi_available) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">무료 WiFi</Typography>
                  </Box>
                )}
                {(facilities?.wheelchair_accessible || restaurant?.wheelchair_accessible) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">휠체어 접근 가능</Typography>
                  </Box>
                )}
                {(facilities?.kids_zone || restaurant?.kids_zone) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">키즈존</Typography>
                  </Box>
                )}
                {(facilities?.pet_friendly || restaurant?.pet_friendly) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">반려동물 동반 가능</Typography>
                  </Box>
                )}
                {(facilities?.private_room || restaurant?.private_room) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">프라이빗 룸</Typography>
                  </Box>
                )}
                {(facilities?.outdoor_seating || restaurant?.outdoor_seating) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">야외 좌석</Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* 서비스 */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                서비스
              </Typography>
              <Stack spacing={1}>
                {(services?.reservation_available || restaurant?.reservation_available) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">예약 가능</Typography>
                  </Box>
                )}
                {services?.online_booking_available && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">온라인 예약</Typography>
                  </Box>
                )}
                {(services?.delivery_available || restaurant?.delivery_available) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">
                      배달 가능
                      {services?.min_order_amount && ` (최소 ${services.min_order_amount.toLocaleString()}원)`}
                    </Typography>
                  </Box>
                )}
                {(services?.takeout_available || restaurant?.takeout_available) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2">포장 가능</Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* 결제 */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                결제 수단
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(services?.card_payment ?? restaurant?.card_payment ?? true) && (
                  <Chip label="카드" size="small" variant="outlined" />
                )}
                {(services?.cash_payment ?? restaurant?.cash_payment ?? true) && (
                  <Chip label="현금" size="small" variant="outlined" />
                )}
                {(services?.mobile_payment || restaurant?.mobile_payment) && (
                  <Chip label="모바일 결제" size="small" variant="outlined" />
                )}
              </Box>
            </Paper>
          </Box>

          {/* 상세 설명 */}
          {restaurant.description && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                소개
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                {restaurant.description}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ mx: { xs: 2, md: 4 } }} />

        {/* 위치 섹션 */}
        <Box
          ref={mapSectionRef}
          data-section="map"
          sx={{ px: { xs: 2, md: 4 }, py: 4 }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            위치
          </Typography>

          <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <NaverMap
              latitude={restaurant.latitude || 37.5665}
              longitude={restaurant.longitude || 126.9780}
              address={restaurant.address}
              restaurantName={restaurant.name}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>
              {restaurant.address}
            </Typography>
            {restaurant.road_address && restaurant.road_address !== restaurant.address && (
              <Typography variant="body2" color="text.secondary">
                {restaurant.road_address}
              </Typography>
            )}
            {restaurant.detailed_address && (
              <Typography variant="body2" color="text.secondary">
                {restaurant.detailed_address}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={handleCopyAddress}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              주소 복사
            </Button>
            <Button
              variant="outlined"
              startIcon={<NavigationOutlined />}
              onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(restaurant.address)}`, '_blank')}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              네이버 지도
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.open(`https://map.kakao.com/link/search/${encodeURIComponent(restaurant.address)}`, '_blank')}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              카카오맵
            </Button>
          </Box>
        </Box>
      </Box>

      {/* 이미지 갤러리 모달 */}
      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'black',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
          py: 1.5,
        }}>
          <Typography>
            {galleryIndex + 1} / {photos.all.length}
          </Typography>
          <IconButton onClick={() => setGalleryOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          p: 0,
          minHeight: 400,
        }}>
          {photos.all.length > 0 && (
            <Box
              component="img"
              src={photos.all[galleryIndex]?.url}
              alt={`사진 ${galleryIndex + 1}`}
              sx={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          )}

          {/* 이전 버튼 */}
          {photos.all.length > 1 && (
            <IconButton
              onClick={() => setGalleryIndex((prev) => (prev - 1 + photos.all.length) % photos.all.length)}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'white' },
              }}
            >
              <ArrowBack />
            </IconButton>
          )}

          {/* 다음 버튼 */}
          {photos.all.length > 1 && (
            <IconButton
              onClick={() => setGalleryIndex((prev) => (prev + 1) % photos.all.length)}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'white' },
              }}
            >
              <ArrowForward />
            </IconButton>
          )}
        </DialogContent>
      </Dialog>

      {/* 전체 메뉴 모달 */}
      <Dialog
        open={showAllMenu}
        onClose={() => setShowAllMenu(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          전체 메뉴
          <IconButton onClick={() => setShowAllMenu(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={0} divider={<Divider />}>
            {menus.all.map((menu: any) => (
              <Box
                key={menu.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  py: 2,
                }}
              >
                <Box sx={{ flex: 1, mr: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {menu.name}
                    </Typography>
                    {menu.is_signature && (
                      <Chip label="시그니처" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                    )}
                    {menu.is_popular && (
                      <Chip label="인기" size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#FEF3C7', color: '#92400E' }} />
                    )}
                    {!menu.is_available && (
                      <Chip label="품절" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                    )}
                  </Box>
                  {menu.description && (
                    <Typography variant="body2" color="text.secondary">
                      {menu.description}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  {menu.original_price && menu.original_price > menu.price && (
                    <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', display: 'block' }}>
                      {menu.original_price.toLocaleString()}원
                    </Typography>
                  )}
                  <Typography variant="body1" fontWeight={600}>
                    {menu.price?.toLocaleString()}원
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* 리뷰 작성/수정 다이얼로그 */}
      <Dialog
        open={reviewDialogOpen}
        onClose={closeReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingReview ? '리뷰 수정' : '리뷰 작성'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
              rows={5}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="방문 경험을 공유해주세요"
              sx={{ mb: 2 }}
            />

            {/* 이미지 업로드 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
                    { multiple: false, folder: 'reviews', tags: ['review'] }
                  );
                }}
                disabled={reviewImages.length >= 5}
                sx={{ mb: 1, textTransform: 'none' }}
              >
                사진 추가
              </Button>

              {reviewImages.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {reviewImages.map((img, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: 80,
                        height: 80,
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component="img"
                        src={img}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== idx))}
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          padding: 0.5,
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                        }}
                      >
                        <Close sx={{ fontSize: 14 }} />
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
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeReviewDialog}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={editingReview ? handleUpdateReview : handleSubmitReview}
          >
            {editingReview ? '수정' : '작성'}
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
              부적절한 리뷰를 신고해주세요. 신고 내용은 검토 후 처리됩니다.
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
              label="상세 내용 (선택)"
              multiline
              rows={3}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="추가 설명이 필요하면 작성해주세요"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => {
            setReportDialogOpen(false);
            setReportingReviewId(null);
            setReportReason('');
            setReportDetails('');
          }}>
            취소
          </Button>
          <Button variant="contained" color="error" onClick={handleSubmitReport}>
            신고
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default RestaurantDetailPage;
