import React, { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/api';
import { Restaurant, Category } from '../types';
import {
  StarFilledIcon,
  LocationIcon,
  SearchIcon,
  FilterIcon,
  RestaurantIcon,
} from '../components/icons/CustomIcons';
import { DEFAULT_RESTAURANT_IMAGE, handleImageError } from '../constants/images';

const RestaurantsListPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
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

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>(
    searchParams.get('category') ? Number(searchParams.get('category')) : ''
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at_desc');

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
        category_id: category ? Number(category) : undefined,
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchQuery, page: '1' });
  };

  const handleCategoryChange = (categoryId: number | '') => {
    setSelectedCategory(categoryId);
    updateFilters({
      category: categoryId ? String(categoryId) : undefined,
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

  const updateFilters = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    setSearchParams(params);
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

  const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardActionArea onClick={() => handleRestaurantClick(restaurant.id)}>
        <CardMedia
          component="img"
          height="200"
          image={restaurant.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
          alt={restaurant.name}
          onError={handleImageError}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ flex: 1 }}>
              {restaurant.name}
            </Typography>
            {renderRating(restaurant.rating)}
          </Box>

          {restaurant.categories && (
            <Chip
              label={restaurant.categories.name}
              size="small"
              sx={{
                mb: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
              }}
            />
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '40px',
            }}
          >
            {restaurant.description || '맛있는 음식을 만나보세요'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <LocationIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" noWrap>
              {restaurant.address}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              리뷰 {restaurant.review_count || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              조회 {restaurant.view_count || 0}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* 페이지 헤더 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            맛집 찾기
          </Typography>
          <Typography variant="body1" color="text.secondary">
            전국의 맛집을 검색하고 탐색해보세요
          </Typography>
        </Box>

        {/* 필터 & 검색 섹션 */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2, alignItems: "center" }}>
            {/* 검색 */}
            <Box>
              <Box component="form" onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  placeholder="맛집 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            {/* 카테고리 필터 */}
            <Box>
              <FormControl fullWidth>
                <Select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value as number | '')}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <RestaurantIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>전체 카테고리</em>
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
              <FormControl fullWidth>
                <Select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="created_at_desc">최신순</MenuItem>
                  <MenuItem value="rating_desc">평점 높은순</MenuItem>
                  <MenuItem value="review_count_desc">리뷰 많은순</MenuItem>
                  <MenuItem value="view_count_desc">조회수 높은순</MenuItem>
                  <MenuItem value="favorite_count_desc">인기순</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* 결과 정보 */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            총 <strong>{pagination.total}</strong>개의 맛집
          </Typography>
        </Box>

        {/* 맛집 그리드 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : restaurants.length === 0 ? (
          <Alert severity="info" sx={{ my: 4 }}>
            검색 결과가 없습니다. 다른 검색어를 시도해보세요.
          </Alert>
        ) : (
          <>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3 }}>
              {restaurants.map((restaurant) => (
                <Box key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Box>
              ))}
            </Box>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
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
