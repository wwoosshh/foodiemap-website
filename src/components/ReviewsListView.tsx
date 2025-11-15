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
  Stack,
  Tooltip,
  Rating,
  Avatar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { RestaurantIcon } from './icons/CustomIcons';
import { DEFAULT_RESTAURANT_IMAGE } from '../constants/images';

interface ReviewsListViewProps {
  reviews: any[];
  onDeleteReview?: (id: string) => void;
  onEditReview?: (id: string) => void;
}

const ReviewsListView: React.FC<ReviewsListViewProps> = ({
  reviews,
  onDeleteReview,
  onEditReview,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');

  // 필터링 및 정렬
  const filteredReviews = useMemo(() => {
    let result = reviews;

    // 검색 필터
    if (searchTerm) {
      result = result.filter(review =>
        review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.restaurants?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 평점 필터
    if (filterRating !== 'all') {
      result = result.filter(review => review.rating === parseInt(filterRating));
    }

    // 정렬
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating_desc':
          return b.rating - a.rating;
        case 'rating_asc':
          return a.rating - b.rating;
        case 'restaurant_name':
          return (a.restaurants?.name || '').localeCompare(b.restaurants?.name || '');
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [reviews, searchTerm, filterRating, sortBy]);

  // 평점별 통계
  const ratingStats = useMemo(() => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      stats[review.rating as keyof typeof stats]++;
    });
    return stats;
  }, [reviews]);

  // 평균 평점
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  return (
    <Box>
      {/* 통계 대시보드 */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          리뷰 통계
        </Typography>
        <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight={800}>
              {reviews.length}
            </Typography>
            <Typography variant="body2">전체 리뷰</Typography>
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800}>
              {averageRating.toFixed(1)}
            </Typography>
            <Typography variant="body2">평균 평점</Typography>
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800}>
              {ratingStats[5]}
            </Typography>
            <Typography variant="body2">5점 리뷰</Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            평점 분포
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {Object.entries(ratingStats).reverse().map(([rating, count]) => (
              <Chip
                key={rating}
                label={`${rating}★ ${count}`}
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
            placeholder="제목, 내용, 맛집 이름 검색..."
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>평점</InputLabel>
            <Select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} label="평점">
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="5">5점</MenuItem>
              <MenuItem value="4">4점</MenuItem>
              <MenuItem value="3">3점</MenuItem>
              <MenuItem value="2">2점</MenuItem>
              <MenuItem value="1">1점</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>정렬</InputLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="정렬">
              <MenuItem value="created_at">작성 순</MenuItem>
              <MenuItem value="rating_desc">평점 높은 순</MenuItem>
              <MenuItem value="rating_asc">평점 낮은 순</MenuItem>
              <MenuItem value="restaurant_name">맛집 이름 순</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* 리스트 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell width="35%"><strong>맛집 정보</strong></TableCell>
              <TableCell width="10%" align="center"><strong>평점</strong></TableCell>
              <TableCell width="30%"><strong>리뷰 내용</strong></TableCell>
              <TableCell width="15%"><strong>작성일</strong></TableCell>
              <TableCell width="10%" align="center"><strong>관리</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">
                    작성한 리뷰가 없습니다
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow
                  key={review.id}
                  hover
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <TableCell onClick={() => navigate(`/restaurants/${review.restaurant_id}`)}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={review.restaurants?.images?.[0] || DEFAULT_RESTAURANT_IMAGE}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      >
                        <RestaurantIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {review.restaurants?.name || '알 수 없음'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.restaurants?.address || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" fontWeight={600}>
                        {review.rating}.0
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      {review.title || '-'}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {review.content || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(review.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="상세보기">
                        <IconButton size="small" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/restaurants/${review.restaurant_id}`);
                        }}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="수정">
                        <IconButton size="small" onClick={(e) => {
                          e.stopPropagation();
                          if (onEditReview) {
                            onEditReview(review.id);
                          }
                        }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton size="small" color="error" onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('리뷰를 삭제하시겠습니까?') && onDeleteReview) {
                            onDeleteReview(review.id);
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

      {filteredReviews.length > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            총 {filteredReviews.length}개의 리뷰
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReviewsListView;
