import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Chip,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { Category } from '../types';

interface RestaurantSearchProps {
  categories: Category[];
  onSearchChange: (filters: { search?: string; categoryId?: number; sort?: string }) => void;
  loading?: boolean;
}

const RestaurantSearch: React.FC<RestaurantSearchProps> = ({ categories, onSearchChange, loading = false }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [searchText, setSearchText] = useState('');
  const [appliedSearchText, setAppliedSearchText] = useState('');
  const [sortOption, setSortOption] = useState<string>('created_at_desc');

  const categoriesLoading = false; // props로 받으므로 로딩 없음

  // 검색 조건 변경 시 부모 컴포넌트에 알림 (카테고리, 정렬만 즉시 반영)
  useEffect(() => {
    onSearchChange({
      search: appliedSearchText || undefined,
      categoryId: selectedCategoryId,
      sort: sortOption
    });
  }, [appliedSearchText, selectedCategoryId, sortOption, onSearchChange]);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(selectedCategoryId === categoryId ? undefined : categoryId);
  };

  const handleSearchSubmit = () => {
    setAppliedSearchText(searchText);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSearchClear = () => {
    setSearchText('');
    setAppliedSearchText('');
  };

  const handleResetFilters = () => {
    setSearchText('');
    setAppliedSearchText('');
    setSelectedCategoryId(undefined);
    setSortOption('created_at_desc');
  };

  return (
    <Box sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 }, backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        sx={{
          fontWeight: 300,
          letterSpacing: 3,
          fontSize: { xs: '1.3rem', md: '1.8rem' },
          color: '#1a1a1a',
          mb: 1,
          textTransform: 'uppercase',
          fontFamily: '"Times New Roman", serif'
        }}
      >
        Discover
      </Typography>
      <Box sx={{ width: 30, height: 1, backgroundColor: '#000', mx: 'auto', mb: 2 }} />

      {/* 검색 및 필터 */}
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* 검색 입력 */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            placeholder="Search restaurants..."
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: '#666' }} />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSearchClear}
                    sx={{ p: 0.5, color: '#666' }}
                    disabled={loading}
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 0,
                backgroundColor: 'white',
                fontSize: '0.9rem'
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearchSubmit}
            disabled={loading}
            size="small"
            sx={{
              minWidth: '80px',
              px: 2,
              borderRadius: 0,
              backgroundColor: '#1a1a1a',
              fontSize: '0.85rem',
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
          >
            Search
          </Button>
        </Box>

        {/* 정렬 옵션 */}
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {[
            { value: 'created_at_desc', label: 'Latest' },
            { value: 'rating_desc', label: 'Rated' },
            { value: 'review_count_desc', label: 'Reviewed' },
          ].map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              onClick={() => setSortOption(option.value)}
              disabled={loading}
              variant={sortOption === option.value ? 'filled' : 'outlined'}
              size="small"
              sx={{
                fontSize: '0.75rem',
                height: '28px',
                borderRadius: 0,
                borderColor: '#e0e0e0',
                color: sortOption === option.value ? 'white' : '#666',
                backgroundColor: sortOption === option.value ? '#1a1a1a' : 'transparent',
                '&:hover': {
                  backgroundColor: sortOption === option.value ? '#333' : '#f5f5f5',
                }
              }}
            />
          ))}
        </Box>

        {/* 카테고리 필터 */}
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {!categoriesLoading && categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => handleCategorySelect(category.id)}
              disabled={loading}
              variant={selectedCategoryId === category.id ? 'filled' : 'outlined'}
              size="small"
              sx={{
                fontSize: '0.75rem',
                height: '28px',
                borderRadius: 0,
                borderColor: '#e0e0e0',
                color: selectedCategoryId === category.id ? 'white' : '#666',
                backgroundColor: selectedCategoryId === category.id ? '#1a1a1a' : 'transparent',
                '&:hover': {
                  backgroundColor: selectedCategoryId === category.id ? '#333' : '#f5f5f5',
                }
              }}
            />
          ))}
        </Box>

        {/* 필터 리셋 버튼 */}
        {(appliedSearchText || selectedCategoryId || sortOption !== 'created_at_desc') && (
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Button
              onClick={handleResetFilters}
              disabled={loading}
              size="small"
              sx={{
                color: '#666',
                fontSize: '0.75rem',
                textDecoration: 'underline',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#333'
                }
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RestaurantSearch;