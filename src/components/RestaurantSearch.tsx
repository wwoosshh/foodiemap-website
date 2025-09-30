import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { ApiService } from '../services/api';
import { Category } from '../types';

interface RestaurantSearchProps {
  categories: Category[];
  onSearchChange: (filters: { search?: string; categoryId?: number }) => void;
  loading?: boolean;
}

const RestaurantSearch: React.FC<RestaurantSearchProps> = ({ categories, onSearchChange, loading = false }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [searchText, setSearchText] = useState('');

  const categoriesLoading = false; // props로 받으므로 로딩 없음

  // 카테고리 한국어 -> 영어 매핑
  const getCategoryEnglishName = (koreanName: string): string => {
    const mapping: Record<string, string> = {
      '한식': 'Korean',
      '중식': 'Chinese',
      '일식': 'Japanese',
      '양식': 'Western',
      '분식': 'Street Food',
      '치킨': 'Chicken',
      '피자': 'Pizza',
      '카페': 'Cafe',
      '디저트': 'Dessert',
      '기타': 'Others'
    };
    return mapping[koreanName] || koreanName;
  };

  // 검색 조건 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onSearchChange({
      search: searchText || undefined,
      categoryId: selectedCategoryId
    });
  }, [searchText, selectedCategoryId, onSearchChange]);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(selectedCategoryId === categoryId ? undefined : categoryId);
  };

  const handleSearchClear = () => {
    setSearchText('');
  };

  const handleResetFilters = () => {
    setSearchText('');
    setSelectedCategoryId(undefined);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        component="h2"
        align="center"
        sx={{
          fontWeight: 300,
          letterSpacing: 4,
          fontSize: { xs: '1.8rem', md: '2.5rem' },
          color: '#1a1a1a',
          mb: 1,
          textTransform: 'uppercase',
          fontFamily: '"Times New Roman", serif'
        }}
      >
        Discover
      </Typography>
      <Box sx={{ width: 40, height: 1, backgroundColor: '#000', mx: 'auto', mb: 2 }} />
      <Typography
        variant="body1"
        sx={{
          mb: 6,
          textAlign: 'center',
          color: '#666',
          fontSize: '1rem',
          letterSpacing: 1,
          fontWeight: 300,
          fontStyle: 'italic'
        }}
      >
        Find your perfect dining experience
      </Typography>

      {/* 검색 입력 */}
      <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        <TextField
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search restaurants, cuisine, or location..."
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <Button
                  onClick={handleSearchClear}
                  sx={{ minWidth: 'auto', p: 0.5, color: '#666' }}
                  disabled={loading}
                >
                  <ClearIcon fontSize="small" />
                </Button>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 0,
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
                borderWidth: 1
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#bdbdbd',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1a1a1a',
                borderWidth: 1
              }
            }
          }}
          sx={{
            '& .MuiInputBase-input': {
              padding: '16px 14px',
              fontSize: '1rem',
              letterSpacing: 0.5
            }
          }}
        />
      </Box>

      {/* 카테고리 필터 */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            mb: 3,
            color: '#333',
            fontSize: '1.1rem',
            fontWeight: 500,
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}
        >
          Categories
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
          {!categoriesLoading && categories.map((category) => (
            <Chip
              key={category.id}
              label={getCategoryEnglishName(category.name)}
              onClick={() => handleCategorySelect(category.id)}
              disabled={loading}
              variant={selectedCategoryId === category.id ? 'filled' : 'outlined'}
              sx={{
                px: 2,
                py: 0.5,
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: 1,
                textTransform: 'uppercase',
                borderRadius: 0,
                borderColor: '#e0e0e0',
                color: selectedCategoryId === category.id ? 'white' : '#666',
                backgroundColor: selectedCategoryId === category.id ? '#1a1a1a' : 'transparent',
                '&:hover': {
                  backgroundColor: selectedCategoryId === category.id ? '#333' : '#f5f5f5',
                  borderColor: '#bdbdbd'
                },
                '&.Mui-disabled': {
                  opacity: 0.6
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* 필터 리셋 버튼 */}
      {(searchText || selectedCategoryId) && (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            onClick={handleResetFilters}
            disabled={loading}
            sx={{
              color: '#666',
              fontSize: '0.9rem',
              fontWeight: 400,
              letterSpacing: 1,
              textTransform: 'uppercase',
              textDecoration: 'underline',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
                color: '#333'
              }
            }}
          >
            Clear All Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default RestaurantSearch;