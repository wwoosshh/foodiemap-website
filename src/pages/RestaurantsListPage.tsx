import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import SearchAutocomplete from '../components/SearchAutocomplete';
import { ApiService } from '../services/api';
import { Restaurant, Category } from '../types';
import {
  StarFilledIcon,
  LocationIcon,
  FilterIcon,
  RestaurantIcon,
} from '../components/icons/CustomIcons';
import { DEFAULT_RESTAURANT_IMAGE, handleImageError } from '../constants/images';
import { useLanguage } from '../context/LanguageContext';

const RestaurantsListPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | ''>(
    searchParams.get('category') || ''
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at_desc');

  // URL 검색 파라미터에서 초기 검색어 가져오기
  const initialSearchQuery = searchParams.get('search') || '';

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const response = await ApiService.getPublicCategories();
      if (response.success && response.data) {
        setCategories(response.data.categories || []);
      }
    } catch (err) {
      // 카테고리 로드 실패는 무시 (선택 사항)
    }
  };

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const page = Number(searchParams.get('page')) || 1;
      const search = searchParams.get('search') || '';
      const category = searchParams.get('category') || '';
      const sort = searchParams.get('sort') || 'created_at_desc';

      const response = await ApiService.getRestaurants({
        page,
        limit: pagination.limit,
        search: search || undefined,
        category_id: category || undefined,
        sort: sort as any,
      });

      if (response.success && response.data) {
        setRestaurants(response.data.restaurants || []);
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        });
      }
    } catch (err: any) {
      // 로드 실패 시 빈 목록 유지
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = useCallback((newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // 검색 실행 (SearchAutocomplete에서 호출)
  const handleSearch = useCallback((query: string) => {
    updateFilters({ search: query, page: '1' });
  }, [updateFilters]);

  const handleCategoryChange = (categoryId: string | '') => {
    setSelectedCategory(categoryId);
    updateFilters({
      category: categoryId || undefined,
      page: '1',
    });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateFilters({ sort, page: '1' });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    updateFilters({ page: String(page) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  // 데스크탑용 카드형 컴포넌트
  const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-4px)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardActionArea
        onClick={() => handleRestaurantClick(restaurant.id)}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {/* 이미지 영역 */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="220"
            image={restaurant.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
            alt={restaurant.name}
            onError={handleImageError}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
          />
          {/* 카테고리 배지 - 이미지 위에 오버레이 */}
          {restaurant.categories && (
            <Chip
              label={restaurant.categories.name}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                fontWeight: 600,
                borderRadius: 1,
              }}
            />
          )}
          {/* 평점 배지 - 이미지 위에 오버레이 */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.5,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              borderRadius: 1,
            }}
          >
            <StarFilledIcon sx={{ fontSize: 16, color: '#FFD93D' }} />
            <Typography variant="caption" fontWeight={700} sx={{ color: '#FFF' }}>
              {restaurant.rating.toFixed(1)}
            </Typography>
          </Box>
        </Box>

        {/* 컨텐츠 영역 */}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {restaurant.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '40px',
              lineHeight: 1.6,
            }}
          >
            {restaurant.description || ''}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5, color: 'text.secondary' }}>
            <LocationIcon sx={{ fontSize: 14 }} />
            <Typography
              variant="caption"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {restaurant.address}
            </Typography>
          </Box>

          {/* 통계 정보 - 깔끔한 구분선과 함께 */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              pt: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {t('restaurant.reviewCount')}
              </Typography>
              <Typography variant="caption" fontWeight={700}>
                {restaurant.review_count || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {t('restaurant.viewCount')}
              </Typography>
              <Typography variant="caption" fontWeight={700}>
                {restaurant.view_count || 0}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  // 모바일용 리스트형 컴포넌트
  const RestaurantListItem: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => (
    <Card
      onClick={() => handleRestaurantClick(restaurant.id)}
      sx={{
        display: 'flex',
        mb: 1.5,
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[4],
          borderColor: 'primary.main',
        },
      }}
    >
      {/* 이미지 - 왼쪽 고정 크기 */}
      <CardMedia
        component="img"
        sx={{
          width: 100,
          height: 100,
          objectFit: 'cover',
          flexShrink: 0,
        }}
        image={restaurant.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
        alt={restaurant.name}
        onError={handleImageError}
      />

      {/* 정보 영역 - 오른쪽 */}
      <CardContent sx={{ flex: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
        {/* 제목과 카테고리 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.3,
            }}
          >
            {restaurant.name}
          </Typography>
          {restaurant.categories && (
            <Chip
              label={restaurant.categories.name}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* 평점 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <StarFilledIcon sx={{ fontSize: 14, color: '#FFD93D' }} />
          <Typography variant="body2" fontWeight={600}>
            {restaurant.rating.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({restaurant.review_count || 0})
          </Typography>
        </Box>

        {/* 주소 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <LocationIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {restaurant.address}
          </Typography>
        </Box>

        {/* 설명 (1줄만) */}
        {restaurant.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {restaurant.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        {/* 페이지 헤더 */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '3rem' } }}>
            {t('restaurant.findTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
            {t('restaurant.findSubtitle')}
          </Typography>
        </Box>

        {/* 필터 & 검색 섹션 */}
        <Box
          sx={{
            mb: { xs: 2, md: 4 },
            p: { xs: 2, md: 3 },
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: { xs: 1.5, md: 2 }, alignItems: "center" }}>
            {/* 검색 - SearchAutocomplete 사용 */}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: 'auto' } }}>
              <SearchAutocomplete
                variant="page"
                placeholder={t('restaurant.searchPlaceholder')}
                onSearch={handleSearch}
                initialValue={initialSearchQuery}
              />
            </Box>

            {/* 카테고리 필터 */}
            <Box>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value as string | '')}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <RestaurantIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                    </InputAdornment>
                  }
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  <MenuItem value="">
                    <em>{t('restaurant.allCategories')}</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* 정렬 */}
            <Box>
              <FormControl fullWidth size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                    </InputAdornment>
                  }
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  <MenuItem value="created_at_desc">{t('restaurant.sortByNewest')}</MenuItem>
                  <MenuItem value="rating_desc">{t('restaurant.sortByRating')}</MenuItem>
                  <MenuItem value="review_count_desc">{t('restaurant.sortByReviews')}</MenuItem>
                  <MenuItem value="view_count_desc">{t('restaurant.sortByViews')}</MenuItem>
                  <MenuItem value="favorite_count_desc">인기순</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* 결과 정보 */}
        <Box sx={{ mb: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
            {t('restaurant.totalCount', { count: pagination.total })}
          </Typography>
        </Box>

        {/* 맛집 목록 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : restaurants.length === 0 ? (
          <Alert severity="info" sx={{ my: 4 }}>
            {t('restaurant.noResults')}
          </Alert>
        ) : (
          <>
            {/* 모바일/작은 태블릿: 리스트형 (xs, sm, md - 1200px 미만) */}
            <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
              {restaurants.map((restaurant) => (
                <RestaurantListItem key={restaurant.id} restaurant={restaurant} />
              ))}
            </Box>

            {/* 데스크탑/큰 태블릿: 카드형 그리드 (lg 이상 - 1200px+) */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'grid' },
                gridTemplateColumns: { lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
                gap: 3,
              }}
            >
              {restaurants.map((restaurant) => (
                <Box key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Box>
              ))}
            </Box>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 6 } }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="medium"
                  showFirstButton={pagination.totalPages > 5}
                  showLastButton={pagination.totalPages > 5}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </MainLayout>
  );
};

export default RestaurantsListPage;
