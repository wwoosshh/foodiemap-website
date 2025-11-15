import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Tooltip,
  Rating,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { HeartFilledIcon, RestaurantIcon } from './icons/CustomIcons';

interface FavoritesListViewProps {
  favorites: any[];
  onRemoveFavorite?: (id: string) => void;
  onEditMemo?: (id: string, memo: string) => void;
}

const FavoritesListView: React.FC<FavoritesListViewProps> = ({
  favorites,
  onRemoveFavorite,
  onEditMemo,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFolder, setFilterFolder] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');

  // 폴더 목록 추출
  const folders = useMemo(() => {
    const folderSet = new Set<string>();
    favorites.forEach(fav => {
      if (fav.folder_name) {
        folderSet.add(fav.folder_name);
      }
    });
    return Array.from(folderSet);
  }, [favorites]);

  // 필터링 및 정렬
  const filteredFavorites = useMemo(() => {
    let result = favorites;

    // 검색 필터
    if (searchTerm) {
      result = result.filter(fav =>
        fav.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.memo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 폴더 필터
    if (filterFolder !== 'all') {
      result = result.filter(fav => fav.folder_name === filterFolder);
    }

    // 정렬
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.restaurant?.name || '').localeCompare(b.restaurant?.name || '');
        case 'rating':
          return (b.restaurant?.rating || 0) - (a.restaurant?.rating || 0);
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [favorites, searchTerm, filterFolder, sortBy]);

  // 카테고리별 통계
  const categoryStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    favorites.forEach(fav => {
      const categoryName = fav.restaurant?.categories?.name || '기타';
      stats[categoryName] = (stats[categoryName] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [favorites]);

  // 평균 평점 계산
  const averageRating = useMemo(() => {
    if (favorites.length === 0) return 0;
    const sum = favorites.reduce((acc, fav) => acc + (fav.restaurant?.rating || 0), 0);
    return sum / favorites.length;
  }, [favorites]);

  return (
    <Box>
      {/* 통계 대시보드 */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          즐겨찾기 통계
        </Typography>
        <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight={800}>
              {favorites.length}
            </Typography>
            <Typography variant="body2">전체 맛집</Typography>
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800}>
              {averageRating.toFixed(1)}
            </Typography>
            <Typography variant="body2">평균 평점</Typography>
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800}>
              {categoryStats.length}
            </Typography>
            <Typography variant="body2">카테고리</Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            선호 카테고리 TOP 3
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {categoryStats.slice(0, 3).map(([name, count], index) => (
              <Chip
                key={name}
                label={`${index + 1}. ${name} (${count})`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            ))}
          </Stack>
        </Box>
      </Paper>

      {/* 필터 및 검색 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="검색"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="맛집 이름, 메모 검색..."
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>폴더</InputLabel>
            <Select value={filterFolder} onChange={(e) => setFilterFolder(e.target.value)} label="폴더">
              <MenuItem value="all">전체</MenuItem>
              {folders.map(folder => (
                <MenuItem key={folder} value={folder}>{folder}</MenuItem>
              ))}
              <MenuItem value="">미분류</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>정렬</InputLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="정렬">
              <MenuItem value="created_at">추가 순</MenuItem>
              <MenuItem value="name">이름 순</MenuItem>
              <MenuItem value="rating">평점 순</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* 리스트 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell width="40%"><strong>맛집 정보</strong></TableCell>
              <TableCell width="15%" align="center"><strong>평점</strong></TableCell>
              <TableCell width="15%"><strong>카테고리</strong></TableCell>
              <TableCell width="20%"><strong>메모</strong></TableCell>
              <TableCell width="10%" align="center"><strong>관리</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFavorites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">
                    즐겨찾기한 맛집이 없습니다
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredFavorites.map((fav) => (
                <TableRow
                  key={fav.id}
                  hover
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <TableCell onClick={() => navigate(`/restaurants/${fav.restaurant_id}`)}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <RestaurantIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {fav.restaurant?.name || '알 수 없음'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <LocationIcon sx={{ fontSize: 14 }} />
                          {fav.restaurant?.address || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Rating value={fav.restaurant?.rating || 0} readOnly precision={0.1} size="small" />
                      <Typography variant="body2" fontWeight={600}>
                        {(fav.restaurant?.rating || 0).toFixed(1)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={fav.restaurant?.categories?.name || '기타'}
                      size="small"
                      sx={{
                        bgcolor: fav.restaurant?.categories?.color || '#ccc',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      {fav.memo || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="메모 수정">
                        <IconButton size="small" onClick={(e) => {
                          e.stopPropagation();
                          const newMemo = prompt('메모를 입력하세요', fav.memo || '');
                          if (newMemo !== null && onEditMemo) {
                            onEditMemo(fav.id, newMemo);
                          }
                        }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton size="small" color="error" onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('즐겨찾기에서 제거하시겠습니까?') && onRemoveFavorite) {
                            onRemoveFavorite(fav.id);
                          }
                        }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredFavorites.length > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            총 {filteredFavorites.length}개의 맛집
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FavoritesListView;
