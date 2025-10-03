import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import RestaurantSearch from '../RestaurantSearch';
import RestaurantGrid from '../RestaurantGrid';
import { ApiService } from '../../services/api';

interface RestaurantListCubeFaceProps {
  initialCategoryId?: number;
}

const RestaurantListCubeFace: React.FC<RestaurantListCubeFaceProps> = ({ initialCategoryId }) => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [searchFilters, setSearchFilters] = useState<{
    search?: string;
    categoryId?: number;
    sort?: string;
    page?: number;
  }>({
    sort: 'created_at_desc',
    page: 1,
    categoryId: initialCategoryId,
  });

  // 카테고리 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await ApiService.getPublicCategories();
        if (response.success && response.data) {
          setCategories(response.data.categories || []);
        }
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
      }
    };

    loadCategories();
  }, []);

  // 맛집 목록 로드
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getRestaurants({
          page: searchFilters.page || 1,
          limit: 20,
          category_id: searchFilters.categoryId,
          search: searchFilters.search,
          sort: searchFilters.sort as any,
        });

        if (response.success && response.data) {
          setRestaurants(response.data.restaurants || []);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error('맛집 목록 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [searchFilters]);

  const handleSearchChange = (filters: { search?: string; categoryId?: number; sort?: string }) => {
    setSearchFilters((prev) => ({
      ...prev,
      ...filters,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchFilters((prev) => ({ ...prev, page }));
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* 검색 필터 */}
      <RestaurantSearch
        categories={categories}
        onSearchChange={handleSearchChange}
        loading={loading}
      />

      {/* 맛집 그리드 */}
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        <RestaurantGrid
          restaurants={restaurants}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          showTitle={false}
        />
      </Box>
    </Box>
  );
};

export default RestaurantListCubeFace;
