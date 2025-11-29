import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateMetaTags, DEFAULT_META } from '../utils/seo';
import { generateOrganizationSchema, generateWebSiteSchema, insertMultipleStructuredData } from '../utils/structuredData';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Alert,
  useTheme,
  alpha,
  Skeleton,
  Paper,
  Divider,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import MainLayout, { useHeaderVisibility } from '../components/layout/MainLayout';
import BannerCarousel from '../components/BannerCarousel';
import SearchAutocomplete from '../components/SearchAutocomplete';
import { ApiService } from '../services/api';
import { Restaurant, Category, Banner } from '../types';
import {
  StarFilledIcon,
  LocationIcon,
  ArrowRightIcon,
  ReviewIcon,
  EyeIcon,
  HeartFilledIcon,
  NewIcon,
} from '../components/icons/CustomIcons';
import { DEFAULT_RESTAURANT_IMAGE, handleImageError } from '../constants/images';
import { useLanguage } from '../context/LanguageContext';

// 정렬 옵션 타입
type SortOption = 'rating_desc' | 'review_count_desc' | 'view_count_desc' | 'created_at_desc' | 'created_at_asc';

interface PushedRestaurant {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  badge_text?: string;
  badge_color?: string;
  restaurant: Restaurant;
}

const NewHomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isHeaderVisible } = useHeaderVisibility();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [pushedRestaurants, setPushedRestaurants] = useState<PushedRestaurant[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 다양한 알고리즘별 맛집 상태 (PC용)
  const [ratingRestaurants, setRatingRestaurants] = useState<Restaurant[]>([]);
  const [reviewCountRestaurants, setReviewCountRestaurants] = useState<Restaurant[]>([]);
  const [viewCountRestaurants, setViewCountRestaurants] = useState<Restaurant[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [latestRestaurants, setLatestRestaurants] = useState<Restaurant[]>([]);

  // 모바일용 단일 목록 상태
  const [mobileRestaurants, setMobileRestaurants] = useState<Restaurant[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mobilePage, setMobilePage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('rating_desc');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false); // 중복 요청 방지용
  const MOBILE_PAGE_SIZE = 10;

  // 정렬 옵션 목록
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'rating_desc', label: '별점순' },
    { value: 'review_count_desc', label: '리뷰순' },
    { value: 'view_count_desc', label: '조회순' },
    { value: 'created_at_desc', label: '최신순' },
    { value: 'created_at_asc', label: '오래된순' },
  ];

  const loadRestaurantsByCategory = useCallback(async (categoryId: string | null) => {
    try {
      // 통합 API로 한 번에 모든 정렬 방식의 맛집 로드
      const params = categoryId ? { category_id: categoryId, limit: 10 } : { limit: 10 };

      const multiSortRes = await ApiService.getRestaurantsMultiSort(params);

      if (multiSortRes.success && multiSortRes.data) {
        setRatingRestaurants(multiSortRes.data.byRating || []);
        setReviewCountRestaurants(multiSortRes.data.byReviewCount || []);
        setViewCountRestaurants(multiSortRes.data.byViewCount || []);
        setFavoriteRestaurants(multiSortRes.data.byFavoriteCount || []);
        setLatestRestaurants(multiSortRes.data.byLatest || []);
      }
    } catch (err: any) {
      console.error('Failed to load restaurants:', err);
    }
  }, []);

  // 모바일용 맛집 로드 함수
  const loadMobileRestaurants = useCallback(async (categoryId: string | null, page: number, sort: SortOption, reset: boolean = false) => {
    // 중복 요청 방지
    if (isLoadingRef.current && !reset) return;

    isLoadingRef.current = true;
    setLoadingMore(true);

    try {
      const params: any = {
        page,
        limit: MOBILE_PAGE_SIZE,
        sort,
      };
      if (categoryId) {
        params.category_id = categoryId;
      }

      const res = await ApiService.getRestaurants(params);

      if (res.success && res.data) {
        const newRestaurants = res.data.restaurants || [];

        if (reset) {
          setMobileRestaurants(newRestaurants);
          setMobilePage(1);
        } else {
          setMobileRestaurants(prev => [...prev, ...newRestaurants]);
        }

        // 더 이상 데이터가 없으면 hasMore를 false로
        if (newRestaurants.length < MOBILE_PAGE_SIZE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error('Failed to load mobile restaurants:', err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      // 모든 데이터를 한 번에 로드 (최적화)
      const homeDataRes = await ApiService.getHomeData();

      if (homeDataRes.success && homeDataRes.data) {
        // 배너, 푸시 맛집 설정
        setBanners(homeDataRes.data.banners || []);
        setPushedRestaurants(homeDataRes.data.pushedRestaurants || []);

        // 카테고리 설정 (별도 API 호출 제거)
        setCategories(homeDataRes.data.categories || []);

        // Multi-sort 맛집 데이터 설정 (별도 API 호출 제거)
        if (homeDataRes.data.multiSort) {
          setRatingRestaurants(homeDataRes.data.multiSort.byRating || []);
          setReviewCountRestaurants(homeDataRes.data.multiSort.byReviewCount || []);
          setViewCountRestaurants(homeDataRes.data.multiSort.byViewCount || []);
          setFavoriteRestaurants(homeDataRes.data.multiSort.byFavoriteCount || []);
          setLatestRestaurants(homeDataRes.data.multiSort.byLatest || []);

          // 모바일용 초기 데이터 (byRating 사용)
          setMobileRestaurants(homeDataRes.data.multiSort.byRating || []);
          setHasMore((homeDataRes.data.multiSort.byRating || []).length >= MOBILE_PAGE_SIZE);
        }
      }
    } catch (err: any) {
      setError(err.userMessage || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // SEO: 메타 태그 및 구조화된 데이터 설정
  useEffect(() => {
    updateMetaTags({
      ...DEFAULT_META,
      url: window.location.href
    });

    // 구조화된 데이터 추가 (Organization, WebSite)
    const schemas = [
      generateOrganizationSchema(),
      generateWebSiteSchema()
    ];
    insertMultipleStructuredData(schemas);
  }, []);

  useEffect(() => {
    // 초기 로드가 완료되고, 카테고리가 변경되었을 때 실행 (null 포함)
    if (!isInitialLoad) {
      loadRestaurantsByCategory(selectedCategoryId);
      // 모바일: 카테고리 변경 시 목록 리셋
      if (isMobile) {
        setMobilePage(1);
        setHasMore(true);
        loadMobileRestaurants(selectedCategoryId, 1, sortOption, true);
      }
    }
  }, [selectedCategoryId, isInitialLoad, loadRestaurantsByCategory, isMobile, loadMobileRestaurants, sortOption]);

  // 모바일 무한 스크롤: IntersectionObserver
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingRef.current) {
          setMobilePage(prev => {
            const nextPage = prev + 1;
            loadMobileRestaurants(selectedCategoryId, nextPage, sortOption, false);
            return nextPage;
          });
        }
      },
      { threshold: 0.5, rootMargin: '100px' }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isMobile, hasMore, selectedCategoryId, sortOption, loadMobileRestaurants]);

  // 정렬 변경 핸들러
  const handleSortChange = (newSort: SortOption) => {
    if (newSort !== sortOption) {
      setSortOption(newSort);
      setMobilePage(1);
      setHasMore(true);
      setMobileRestaurants([]);
      loadMobileRestaurants(selectedCategoryId, 1, newSort, true);
    }
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  const renderRating = (rating: number) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <StarFilledIcon sx={{ fontSize: 18, color: '#FFD93D' }} />
        <Typography variant="body2" fontWeight={600}>
          {rating.toFixed(1)}
        </Typography>
      </Box>
    );
  };

  const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => {
    // 모바일: 카드 없이 이미지 + 텍스트 분리 레이아웃
    if (isMobile) {
      return (
        <Box
          sx={{
            cursor: 'pointer',
            '&:active': {
              opacity: 0.7,
            },
          }}
          onClick={() => handleRestaurantClick(restaurant.id)}
        >
          {/* 이미지 영역 - 4:3 비율 */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '75%', // 4:3 비율
              borderRadius: 2,
              overflow: 'hidden',
              mb: 1,
            }}
          >
            <Box
              component="img"
              src={restaurant.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
              alt={restaurant.name}
              onError={handleImageError}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* 카테고리 뱃지 - 이미지 왼쪽 상단 */}
            {restaurant.categories && (
              <Chip
                label={restaurant.categories.name}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '0.65rem',
                  height: 20,
                }}
              />
            )}
          </Box>

          {/* 텍스트 영역 - 이미지 아래 공백 */}
          <Box sx={{ px: 0.5 }}>
            {/* 가게 이름 + 별점 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  mr: 1,
                }}
              >
                {restaurant.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, flexShrink: 0 }}>
                <StarFilledIcon sx={{ fontSize: 12, color: '#FFD93D' }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  {restaurant.rating.toFixed(1)}
                </Typography>
              </Box>
            </Box>

            {/* 주소 */}
            <Typography
              sx={{
                fontSize: '0.72rem',
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 0.3,
              }}
            >
              {restaurant.address}
            </Typography>

            {/* 리뷰 수 · 조회수 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled' }}>
                리뷰 {restaurant.review_count || 0}
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled' }}>
                ·
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled' }}>
                조회 {restaurant.view_count || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
      );
    }

    // PC: 기존 오버레이 스타일
    return (
      <Card
        sx={{
          position: 'relative',
          height: { sm: 200, md: 220 },
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0px 20px 40px rgba(255, 107, 107, 0.3)',
            '& .restaurant-image': {
              transform: 'scale(1.15)',
            },
            '& .restaurant-overlay': {
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
            },
          },
          '&:active': {
            transform: 'translateY(-4px) scale(1.01)',
          },
        }}
        onClick={() => handleRestaurantClick(restaurant.id)}
      >
        <CardMedia
          component="img"
          className="restaurant-image"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          image={restaurant.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
          alt={restaurant.name}
          onError={handleImageError}
        />

        <Box
          className="restaurant-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
            transition: 'background 0.5s ease',
          }}
        />

        <CardContent
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            color: 'white',
            p: 2.5,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ flex: 1, color: 'white', fontSize: '1.25rem' }}>
              {restaurant.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              <StarFilledIcon sx={{ fontSize: 18, color: '#FFD93D' }} />
              <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
                {restaurant.rating.toFixed(1)}
              </Typography>
            </Box>
          </Box>

          {restaurant.categories && (
            <Chip
              label={restaurant.categories.name}
              size="small"
              sx={{
                mb: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.9),
                color: '#FFFFFF',
                fontWeight: 600,
                border: 'none',
                height: 24,
                fontSize: '0.8rem',
              }}
            />
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <LocationIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant="caption" noWrap sx={{ fontSize: '0.875rem', color: 'white' }}>
              {restaurant.address}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
              {t('restaurant.reviewCount')} {restaurant.review_count || 0}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
              {t('restaurant.viewCount')} {restaurant.view_count || 0}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const RestaurantSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    restaurants: Restaurant[];
    sortParam: string;
  }> = ({ title, icon, restaurants, sortParam }) => {
    if (restaurants.length === 0) return null;

    return (
      <Box sx={{
        mb: { xs: 6, md: 8 },
        pb: { xs: 4, md: 0 },
        borderBottom: { xs: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`, md: 'none' },
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 3, md: 3 },
          pb: { xs: 2, md: 0 },
          borderBottom: { xs: `3px solid ${theme.palette.primary.main}`, md: 'none' },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 36, md: 40 },
                height: { xs: 36, md: 40 },
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              {icon}
            </Box>
            <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2rem' } }}>
              {title}
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowRightIcon />}
            onClick={() => {
              const categoryParam = selectedCategoryId ? `&category=${selectedCategoryId}` : '';
              navigate(`/restaurants?sort=${sortParam}${categoryParam}`);
            }}
            sx={{
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              px: { xs: 1, md: 2 },
            }}
          >
            {t('home.viewMore')}
          </Button>
        </Box>

        {/* 리스트 레이아웃 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {restaurants.slice(0, 8).map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
          <Skeleton variant="rectangular" sx={{ height: { xs: 200, md: 400 }, borderRadius: 2, mb: { xs: 2, md: 4 } }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: { xs: 2, md: 3 } }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton variant="rectangular" sx={{ height: { xs: 200, md: 300 }, borderRadius: 2 }} />
              </Box>
            ))}
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </MainLayout>
    );
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <MainLayout>
      {/* 모바일 검색바 - 배너 위 */}
      {isMobile && (
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, mt: 2 }}>
          <SearchAutocomplete
            variant="mobile"
            placeholder={t('search.placeholder') || '맛집을 검색해보세요...'}
          />
        </Container>
      )}

      {/* 배너 캐러셀 - 상단 여백 추가, PC 폭 제한 */}
      {banners.length > 0 && (
        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 2, md: 3 },
            mb: { xs: 4, md: 8 },
            px: { xs: 0, md: 3 },
          }}
        >
          <BannerCarousel banners={banners} />
        </Container>
      )}

      {/* 푸시 맛집 섹션 - 두 번째 배치 */}
      {pushedRestaurants.length > 0 && (
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
              theme.palette.secondary.main,
              0.08
            )} 100%)`,
            py: { xs: 3, md: 6 },
            mb: { xs: 3, md: 6 },
          }}
        >
          <Container maxWidth="xl">
            <Typography
              variant="h3"
              fontWeight={800}
              align="center"
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: { xs: 3, md: 5 },
                fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
              }}
            >
              {t('home.featuredTitle')}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: { xs: 2, md: 4 },
              }}
            >
              {pushedRestaurants.map((pushed, index) => (
                    <Card
                      key={pushed.id}
                      sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      opacity: 0,
                      animation: `fadeInUp 0.8s ease-out ${index * 0.2}s forwards`,
                    '@keyframes fadeInUp': {
                      from: {
                        opacity: 0,
                        transform: 'translateY(40px)',
                      },
                      to: {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: { xs: 'translateY(-8px) scale(1.02)', md: 'translateY(-16px) scale(1.03)' },
                      boxShadow: '0px 24px 48px rgba(255, 107, 107, 0.35)',
                      '& .pushed-image': {
                        transform: 'scale(1.1)',
                      },
                    },
                    '&:active': {
                      transform: { xs: 'translateY(-4px) scale(1.01)', md: 'translateY(-12px) scale(1.02)' },
                    },
                  }}
                  onClick={() => handleRestaurantClick(pushed.restaurant.id)}
                >
                  {/* 배지 */}
                  {pushed.badge_text && (
                    <Chip
                      label={pushed.badge_text}
                      sx={{
                        position: 'absolute',
                        top: { xs: 12, md: 16 },
                        right: { xs: 12, md: 16 },
                        zIndex: 2,
                        backgroundColor: pushed.badge_color || '#FF6B6B',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', md: '0.85rem' },
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }}
                    />
                  )}

                  <CardMedia
                    component="img"
                    className="pushed-image"
                    sx={{
                      height: { xs: 140, sm: 180, md: 250 },
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    image={pushed.restaurant.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
                    alt={pushed.restaurant.name}
                    onError={handleImageError}
                  />

                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Typography variant="overline" color="primary" fontWeight={700} sx={{ display: 'block', mb: { xs: 0.5, md: 1 }, fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                      {pushed.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '0.95rem', md: '1.5rem' }, mb: { xs: 0.5, md: 1 } }}>
                      {pushed.restaurant.name}
                    </Typography>
                    {pushed.subtitle && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' }, lineHeight: 1.3 }}>
                        {pushed.subtitle}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: { xs: 1, md: 2 } }}>
                      {renderRating(pushed.restaurant.rating)}
                      <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 2 }, flexWrap: 'wrap' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                          {t('restaurant.reviewCount')} {pushed.restaurant.review_count || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                          {t('restaurant.viewCount')} {pushed.restaurant.view_count || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* 메인 콘텐츠 */}
      {isMobile ? (
        /* ===== 모바일 레이아웃 ===== */
        <>
          {/* Sticky 카테고리 + 정렬 필터 바 - 스크롤 시 상단에 고정 */}
          <Box
            sx={{
              position: 'sticky',
              top: isHeaderVisible ? 73 : 0, // 헤더 높이 73px, 헤더 숨김 시 최상단
              zIndex: 99,
              backgroundColor: theme.palette.background.paper,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              py: 1,
              px: 2,
              mx: -2, // Container 패딩 상쇄
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'top 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* 카테고리 행 */}
            <Box
              sx={{
                display: 'flex',
                gap: 0.8,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              <Chip
                label="전체"
                size="small"
                onClick={() => handleCategoryClick(null)}
                sx={{
                  flexShrink: 0,
                  backgroundColor: selectedCategoryId === null ? theme.palette.primary.main : 'transparent',
                  color: selectedCategoryId === null ? 'white' : 'text.primary',
                  border: selectedCategoryId === null ? 'none' : `1px solid ${theme.palette.divider}`,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                }}
              />
              {categories.slice(0, 10).map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  size="small"
                  onClick={() => handleCategoryClick(category.id)}
                  sx={{
                    flexShrink: 0,
                    backgroundColor: selectedCategoryId === category.id ? theme.palette.primary.main : 'transparent',
                    color: selectedCategoryId === category.id ? 'white' : 'text.primary',
                    border: selectedCategoryId === category.id ? 'none' : `1px solid ${theme.palette.divider}`,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 28,
                  }}
                />
              ))}
            </Box>
            {/* 정렬 행 */}
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                overflowX: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              {sortOptions.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  size="small"
                  onClick={() => handleSortChange(opt.value)}
                  sx={{
                    flexShrink: 0,
                    backgroundColor: sortOption === opt.value ? alpha(theme.palette.secondary.main, 0.15) : 'transparent',
                    color: sortOption === opt.value ? theme.palette.secondary.main : 'text.secondary',
                    border: 'none',
                    fontWeight: sortOption === opt.value ? 600 : 400,
                    fontSize: '0.7rem',
                    height: 24,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* 단일 맛집 목록 - 1열 */}
          <Container maxWidth="xl" sx={{ px: 2, py: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {mobileRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </Box>

            {/* 무한 스크롤 트리거 */}
            {hasMore && (
              <Box ref={loadMoreRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                {loadingMore && <CircularProgress size={24} />}
              </Box>
            )}

            {!hasMore && mobileRestaurants.length > 0 && (
              <Typography sx={{ textAlign: 'center', py: 3, color: 'text.disabled', fontSize: '0.8rem' }}>
                모든 맛집을 불러왔습니다
              </Typography>
            )}
          </Container>
        </>
      ) : (
        /* ===== PC 레이아웃 ===== */
        <Container maxWidth="xl" sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', gap: 4, position: 'relative' }}>
            {/* 메인 콘텐츠 영역 */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* 선택된 카테고리 표시 */}
              {selectedCategoryId && selectedCategory && (
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      label={selectedCategory.name}
                      onDelete={() => handleCategoryClick(null)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem',
                        py: 2.5,
                        '& .MuiChip-deleteIcon': {
                          color: 'white',
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      {t('home.selectedCategory')}
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
              )}

              {/* 다양한 알고리즘별 맛집 섹션 */}
              <RestaurantSection
                title={t.home.highRatedRestaurants}
                icon={<StarFilledIcon />}
                restaurants={ratingRestaurants}
                sortParam="rating_desc"
              />
              <RestaurantSection
                title={t('home.mostReviewedRestaurants')}
                icon={<ReviewIcon />}
                restaurants={reviewCountRestaurants}
                sortParam="review_count_desc"
              />
              <RestaurantSection
                title={t('home.mostViewedRestaurants')}
                icon={<EyeIcon />}
                restaurants={viewCountRestaurants}
                sortParam="view_count_desc"
              />
              <RestaurantSection
                title={t('home.mostLikedRestaurants')}
                icon={<HeartFilledIcon />}
                restaurants={favoriteRestaurants}
                sortParam="favorite_count_desc"
              />
              <RestaurantSection
                title={t('home.newRestaurants')}
                icon={<NewIcon />}
                restaurants={latestRestaurants}
                sortParam="created_at_desc"
              />
            </Box>

          {/* 우측 카테고리 사이드바 (Sticky) */}
          <Box
            sx={{
              width: 250,
              display: { xs: 'none', lg: 'block' },
            }}
          >
            <Paper
              elevation={2}
              sx={{
                position: 'sticky',
                top: 100,
                p: 3,
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1E1E1E 0%, #252525 100%)'
                  : 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F5 100%)',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                {t.home.categories}
              </Typography>

              {/* 전체 보기 버튼 */}
              <Button
                fullWidth
                variant={selectedCategoryId === null ? 'contained' : 'outlined'}
                onClick={() => handleCategoryClick(null)}
                sx={{
                  mb: 2,
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  py: 1.5,
                  fontWeight: selectedCategoryId === null ? 700 : 500,
                }}
              >
                {t('home.viewAll')}
              </Button>

              <Divider sx={{ my: 2 }} />

              {/* 카테고리 버튼들 - 2열 grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? 'contained' : 'outlined'}
                    onClick={() => handleCategoryClick(category.id)}
                    sx={{
                      py: 1,
                      px: 1.5,
                      fontSize: '0.85rem',
                      fontWeight: selectedCategoryId === category.id ? 700 : 500,
                      transition: 'all 0.2s ease',
                      minHeight: '42px',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Typography variant="caption" fontWeight="inherit" noWrap>
                      {category.name}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
      )}
    </MainLayout>
  );
};

export default NewHomePage;
