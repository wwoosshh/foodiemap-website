import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
  Chip,
  alpha,
  ClickAwayListener,
  Popper,
  Fade,
  IconButton,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { ApiService } from '../services/api';
import { Restaurant } from '../types';
import { smartKoreanMatch, debounce } from '../utils/koreanSearch';
import { useLanguage } from '../context/LanguageContext';
import {
  SearchIcon,
  StarFilledIcon,
  LocationIcon,
  CloseIcon,
} from './icons/CustomIcons';
import { DEFAULT_RESTAURANT_IMAGE, handleImageError } from '../constants/images';

// 스타일 정의
const SearchContainer = styled('div')<{ variant?: 'navbar' | 'page' | 'mobile' }>(({ theme, variant }) => ({
  position: 'relative',
  borderRadius: variant === 'navbar' ? theme.shape.borderRadius : Number(theme.shape.borderRadius) * 3,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.95)
    : theme.palette.background.paper,
  border: variant === 'mobile' ? 'none' : `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: variant === 'mobile' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.background.paper
      : theme.palette.common.white,
    borderColor: variant === 'mobile' ? 'transparent' : theme.palette.primary.main,
    boxShadow: variant === 'mobile' ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
  },
  '&:focus-within': {
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.background.paper
      : theme.palette.common.white,
    borderColor: variant === 'mobile' ? 'transparent' : theme.palette.primary.main,
    boxShadow: variant === 'mobile'
      ? `0 4px 16px rgba(0,0,0,0.15), 0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
      : `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  transition: 'all 0.3s ease',
  width: (variant === 'page' || variant === 'mobile') ? '100%' : 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  zIndex: 1,
}));

const StyledInputBase = styled(InputBase)<{ variant?: 'navbar' | 'page' | 'mobile' }>(({ theme, variant }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: variant === 'mobile' ? theme.spacing(1.5, 1, 1.5, 0) : theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: theme.spacing(4),
    transition: theme.transitions.create('width'),
    width: '100%',
    color: theme.palette.text.primary,
    fontSize: variant === 'mobile' ? '1rem' : 'inherit',
    ...(variant === 'navbar' && {
      [theme.breakpoints.up('sm')]: {
        width: '20ch',
        '&:focus': {
          width: '30ch',
        },
      },
    }),
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.8,
    },
  },
}));

const ResultsDropdown = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: theme.spacing(1),
  maxHeight: 400,
  overflow: 'auto',
  zIndex: theme.zIndex.modal,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow: theme.shadows[8],
  border: `1px solid ${theme.palette.divider}`,
}));

const SearchResultItem = styled(ListItem)<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  padding: theme.spacing(1.5, 2),
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
  '&:hover': {
    backgroundColor: isSelected
      ? alpha(theme.palette.primary.main, 0.16)
      : alpha(theme.palette.primary.main, 0.08),
  },
}));

interface SearchAutocompleteProps {
  variant?: 'navbar' | 'page' | 'mobile';
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultClick?: (restaurant: Restaurant) => void;
  autoFocus?: boolean;
  initialValue?: string;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  variant = 'navbar',
  placeholder,
  onSearch,
  onResultClick,
  autoFocus = false,
  initialValue = '',
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // 최근 검색어 로드
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, []);

  // 최근 검색어 저장
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // 검색 API 호출
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.getRestaurants({
        search: searchQuery,
        limit: 8,
      });

      if (response.success && response.data) {
        let restaurants = response.data.restaurants || [];

        // 한글 초성 검색으로 정렬 (이름, 주소, 카테고리만 사용 - 본문 제외)
        restaurants = restaurants
          .map(restaurant => ({
            restaurant,
            score: Math.max(
              smartKoreanMatch(restaurant.name, searchQuery),         // 이름 매칭 (가장 중요)
              smartKoreanMatch(restaurant.address || '', searchQuery) * 0.7,  // 주소 매칭
              smartKoreanMatch(restaurant.categories?.name || '', searchQuery) * 0.8  // 카테고리 매칭
            )
          }))
          .sort((a, b) => b.score - a.score)
          .map(({ restaurant }) => restaurant);

        setResults(restaurants);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 디바운스 적용된 검색 함수
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchRestaurants = useCallback(debounce(performSearch, 300), []);

  // 검색어 변경 시 API 호출
  useEffect(() => {
    if (query.trim()) {
      searchRestaurants(query);
    } else {
      setResults([]);
    }
  }, [query, searchRestaurants]);

  // 검색 실행
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setIsOpen(false);

      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/restaurants?search=${encodeURIComponent(query.trim())}`);
      }

      if (variant === 'navbar') {
        setQuery('');
      }
    }
  };

  // 결과 항목 클릭
  const handleResultClick = (restaurant: Restaurant) => {
    saveRecentSearch(restaurant.name);
    setIsOpen(false);

    if (onResultClick) {
      onResultClick(restaurant);
    } else {
      navigate(`/restaurants/${restaurant.id}`);
    }

    if (variant === 'navbar') {
      setQuery('');
    }
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsOpen(false);

    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // 입력 필드 포커스
  const handleFocus = () => {
    setIsOpen(true);
  };

  // 검색어 초기화
  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  // 외부 클릭 시 드롭다운 닫기
  const handleClickAway = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const showDropdown = isOpen && (query.trim().length > 0 || recentSearches.length > 0);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        component="form"
        onSubmit={handleSearch}
        ref={containerRef}
        sx={{ position: 'relative', width: (variant === 'page' || variant === 'mobile') ? '100%' : 'auto' }}
      >
        <SearchContainer variant={variant}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            inputRef={inputRef}
            placeholder={placeholder || t.nav.searchPlaceholder}
            inputProps={{ 'aria-label': 'search' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
            variant={variant}
            endAdornment={
              query && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{
                    mr: 0.5,
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary' }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )
            }
          />
        </SearchContainer>

        {/* 검색 결과 드롭다운 */}
        <Popper
          open={showDropdown}
          anchorEl={containerRef.current}
          placement="bottom-start"
          transition
          style={{
            width: containerRef.current?.offsetWidth,
            zIndex: theme.zIndex.modal,
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <ResultsDropdown>
                {/* 로딩 상태 */}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}

                {/* 검색 결과 */}
                {!loading && results.length > 0 && (
                  <List disablePadding>
                    {results.map((restaurant, index) => (
                      <SearchResultItem
                        key={restaurant.id}
                        isSelected={index === selectedIndex}
                        onClick={() => handleResultClick(restaurant)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={restaurant.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
                            onError={handleImageError}
                            variant="rounded"
                            sx={{ width: 48, height: 48 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600} noWrap>
                                {restaurant.name}
                              </Typography>
                              {restaurant.categories && (
                                <Chip
                                  label={restaurant.categories.name}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    fontWeight: 500,
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, mt: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <StarFilledIcon sx={{ fontSize: 12, color: '#FFD93D' }} />
                                <Typography variant="caption" fontWeight={600}>
                                  {restaurant.rating.toFixed(1)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ({restaurant.review_count || 0})
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                  sx={{ maxWidth: 200 }}
                                >
                                  {restaurant.address}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </SearchResultItem>
                    ))}

                    {/* 전체 검색 결과 보기 */}
                    <ListItem
                      onClick={() => handleSearch()}
                      sx={{
                        justifyContent: 'center',
                        py: 1.5,
                        borderTop: 1,
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="primary"
                        fontWeight={600}
                      >
                        "{query}" {t.search?.viewAllResults || '전체 검색 결과 보기'}
                      </Typography>
                    </ListItem>
                  </List>
                )}

                {/* 검색 결과 없음 */}
                {!loading && query.trim() && results.length === 0 && (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t.search?.noResults || '검색 결과가 없습니다'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {t.search?.tryDifferent || '다른 검색어를 입력해 보세요'}
                    </Typography>
                  </Box>
                )}

                {/* 최근 검색어 (검색어가 없을 때) */}
                {!loading && !query.trim() && recentSearches.length > 0 && (
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mb: 1, display: 'block' }}
                    >
                      {t.search?.recentSearches || '최근 검색'}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {recentSearches.map((search, index) => (
                        <Chip
                          key={index}
                          label={search}
                          size="small"
                          onClick={() => handleRecentSearchClick(search)}
                          onDelete={() => {
                            const updated = recentSearches.filter((_, i) => i !== index);
                            setRecentSearches(updated);
                            localStorage.setItem('recentSearches', JSON.stringify(updated));
                          }}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </ResultsDropdown>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchAutocomplete;
