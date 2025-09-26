import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Rating,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Skeleton,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Star,
  StarBorder,
  ThumbUp,
  ThumbUpOffAlt,
  MoreVert,
  Person,
  Camera,
  Edit,
  Delete
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ApiService } from '../services/api';

interface Review {
  id: string;
  user_id: string;
  username: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  created_at: string;
  updated_at: string;
  helpful_count: number;
  is_helpful?: boolean;
  tags?: string[];
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface RestaurantReviewsProps {
  restaurantId: string;
  userId?: string;
  onReviewCountChange?: (count: number) => void;
  onRatingChange?: (rating: number) => void;
}

const RestaurantReviews: React.FC<RestaurantReviewsProps> = ({
  restaurantId,
  userId,
  onReviewCountChange,
  onRatingChange
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [writeDialogOpen, setWriteDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  // 리뷰 작성 폼 상태
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    images: [] as string[],
    tags: [] as string[]
  });

  // 리뷰 데이터 로딩
  const loadReviews = async () => {
    try {
      setLoading(true);
      setError('');

      // 리뷰 통계와 리뷰 목록을 동시에 로드
      const [statsResponse, reviewsResponse] = await Promise.all([
        ApiService.getRestaurantReviewStats(restaurantId),
        ApiService.getRestaurantReviews(restaurantId, {
          limit: 20,
          offset: 0,
          sort: 'newest'
        })
      ]);

      if (statsResponse.success && statsResponse.data) {
        setReviewStats(statsResponse.data);
        onReviewCountChange?.(statsResponse.data.total_reviews);
        onRatingChange?.(statsResponse.data.average_rating);
      } else {
        // API 에러를 사용자에게 알기 쉽게 표시
        if (statsResponse.message?.includes('does not exist') || statsResponse.message?.includes('relation')) {
          setError('리뷰 기능이 아직 준비 중입니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError(statsResponse.message || '리뷰 통계를 불러올 수 없습니다.');
        }
        setReviews([]);
        setReviewStats(null);
        return;
      }

      if (reviewsResponse.success && reviewsResponse.data) {
        setReviews(reviewsResponse.data.reviews || []);
      } else {
        // API 에러를 사용자에게 알기 쉽게 표시
        if (reviewsResponse.message?.includes('does not exist') || reviewsResponse.message?.includes('relation')) {
          setError('리뷰 기능이 아직 준비 중입니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError(reviewsResponse.message || '리뷰 목록을 불러올 수 없습니다.');
        }
        setReviews([]);
      }
    } catch (err: any) {
      console.error('리뷰 로딩 실패:', err);

      // 네트워크 오류 vs 서버 오류 구분
      if (err.code === 'ERR_NETWORK') {
        setError('네트워크 연결을 확인해주세요.');
      } else if (err.response?.status === 500) {
        setError('리뷰 기능이 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('리뷰를 불러오는 중 오류가 발생했습니다.');
      }
      setReviews([]);
      setReviewStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [restaurantId]);

  // 리뷰 작성/수정
  const handleSubmitReview = async () => {
    if (!newReview.title.trim() || !newReview.content.trim() || !userId) return;

    // 프론트엔드 검증
    const title = newReview.title.trim();
    const content = newReview.content.trim();
    const rating = newReview.rating;

    if (title.length < 1 || title.length > 100) {
      setError('리뷰 제목은 1자 이상 100자 이하로 작성해주세요.');
      return;
    }

    if (content.length < 10 || content.length > 2000) {
      setError('리뷰 내용은 10자 이상 2000자 이하로 작성해주세요.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setError('평점은 1점부터 5점까지 선택해주세요.');
      return;
    }

    // 중복 리뷰 확인 (새 리뷰 작성 시에만)
    if (!editingReview) {
      const userHasReview = reviews.some(review => review.user_id === userId);
      if (userHasReview) {
        setError('이미 이 맛집에 리뷰를 작성하셨습니다. 기존 리뷰를 수정하거나 삭제 후 다시 작성해주세요.');
        return;
      }
    }

    try {
      setSubmitting(true);
      setError(''); // 기존 오류 메시지 초기화

      let response;
      if (editingReview) {
        // 리뷰 수정
        response = await ApiService.updateReview(editingReview.id, {
          rating: newReview.rating,
          title: title,
          content: content,
          images: newReview.images,
          tags: newReview.tags
        });
      } else {
        // 리뷰 작성
        response = await ApiService.createReview({
          restaurant_id: restaurantId,
          rating: newReview.rating,
          title: title,
          content: content,
          images: newReview.images,
          tags: newReview.tags
        });
      }

      if (response.success && response.data) {
        // 리뷰 목록과 통계 다시 로드
        await loadReviews();
        handleCloseDialog();
      } else {
        throw new Error(response.message || '리뷰 저장에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('리뷰 저장 실패:', err);
      // 사용자 친화적인 에러 메시지 사용
      setError(err.userMessage || err.response?.data?.message || '리뷰 저장 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 도움이 돼요 토글
  const handleToggleHelpful = async (reviewId: string) => {
    if (!userId) return;

    // 자신의 리뷰인지 확인
    const review = reviews.find(r => r.id === reviewId);
    if (review && review.user_id === userId) {
      setError('본인이 작성한 리뷰에는 도움이 돼요를 누를 수 없습니다.');
      return;
    }

    try {
      const response = await ApiService.toggleReviewHelpful(reviewId);

      if (response.success && response.data) {
        // 리뷰 목록 다시 로드하여 정확한 상태 반영
        await loadReviews();
      } else {
        throw new Error(response.message || '도움이 돼요 처리에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('도움이 돼요 토글 실패:', err);
      // 사용자 친화적인 에러 메시지 사용
      setError(err.userMessage || err.response?.data?.message || '도움이 돼요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleOpenWriteDialog = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      setNewReview({
        rating: review.rating,
        title: review.title,
        content: review.content,
        images: review.images,
        tags: review.tags || []
      });
    } else {
      setEditingReview(null);
      setNewReview({
        rating: 5,
        title: '',
        content: '',
        images: [],
        tags: []
      });
    }
    setWriteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setWriteDialogOpen(false);
    setEditingReview(null);
    setNewReview({
      rating: 5,
      title: '',
      content: '',
      images: [],
      tags: []
    });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, reviewId: string) => {
    setMenuAnchor(event.currentTarget);
    setSelectedReview(reviewId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedReview(null);
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko
    });
  };

  const getRatingBarPercentage = (count: number) => {
    if (!reviewStats) return 0;
    return (count / reviewStats.total_reviews) * 100;
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 3, borderRadius: 2 }} />
        {[1, 2, 3].map((index) => (
          <Paper key={index} sx={{ p: 3, mb: 2, border: '1px solid #f0f0f0' }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="text" width="20%" height={16} />
              </Box>
            </Box>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 리뷰 통계 */}
      {reviewStats && (
        <Paper sx={{ p: 4, mb: 4, border: '1px solid #f0f0f0', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 300, mb: 1 }}>
                {reviewStats.average_rating.toFixed(1)}
              </Typography>
              <Rating
                value={reviewStats.average_rating}
                precision={0.1}
                readOnly
                size="large"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {reviewStats.total_reviews}개의 리뷰
              </Typography>
            </Box>
            <Box sx={{ flex: '2 1 300px' }}>
              <Box sx={{ ml: 2 }}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ minWidth: 40, mr: 2 }}>
                      {rating}점
                    </Typography>
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getRatingBarPercentage(reviewStats.rating_distribution[rating as keyof typeof reviewStats.rating_distribution])}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#ffc107'
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30 }}>
                      {reviewStats.rating_distribution[rating as keyof typeof reviewStats.rating_distribution]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleOpenWriteDialog()}
              disabled={!userId}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              리뷰 작성하기
            </Button>
            {!userId && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                리뷰 작성은 로그인 후 가능합니다
              </Typography>
            )}
          </Box>
        </Paper>
      )}

      {/* 리뷰 목록 */}
      <Box>
        {reviews.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              아직 리뷰가 없습니다
            </Typography>
            <Typography variant="body2">
              첫 번째 리뷰를 작성해보세요!
            </Typography>
          </Box>
        ) : (
          reviews.map((review) => (
            <Paper
              key={review.id}
              sx={{
                p: 3,
                mb: 3,
                border: '1px solid #f0f0f0',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#e0e0e0' }}>
                  <Person />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 2 }}>
                      {review.username}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" sx={{ mr: 2 }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(review.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {review.title}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, review.id)}
                  sx={{ opacity: 0.6 }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.7,
                  mb: 2,
                  color: '#333'
                }}
              >
                {review.content}
              </Typography>

              {/* 리뷰 이미지 */}
              {review.images.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {review.images.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={image}
                      alt={`리뷰 이미지 ${index + 1}`}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid #f0f0f0'
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* 태그 */}
              {review.tags && review.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {review.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        bgcolor: '#f5f5f5',
                        '&:hover': { bgcolor: '#eeeeee' }
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* 도움이 돼요 버튼 */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  startIcon={review.is_helpful ? <ThumbUp /> : <ThumbUpOffAlt />}
                  onClick={() => handleToggleHelpful(review.id)}
                  disabled={review.user_id === userId || !userId}
                  sx={{
                    color: review.is_helpful ? '#1976d2' : '#666',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    opacity: (review.user_id === userId || !userId) ? 0.5 : 1
                  }}
                >
                  도움이 돼요 {review.helpful_count}
                </Button>

                {review.user_id === userId && (
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleOpenWriteDialog(review)}
                    sx={{ fontSize: '0.85rem' }}
                  >
                    수정
                  </Button>
                )}
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* 리뷰 작성 다이얼로그 */}
      <Dialog
        open={writeDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {editingReview ? '리뷰 수정' : '리뷰 작성'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              별점
            </Typography>
            <Rating
              value={newReview.rating}
              onChange={(_, value) => setNewReview(prev => ({ ...prev, rating: value || 1 }))}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            label="제목"
            value={newReview.title}
            onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
            error={newReview.title.length > 100}
            helperText={`${newReview.title.length}/100자${newReview.title.length > 100 ? ' (글자 수가 초과되었습니다)' : ''}`}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="리뷰 내용"
            placeholder="음식의 맛, 서비스, 분위기 등에 대해 자세히 써주세요..."
            value={newReview.content}
            onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
            error={(newReview.content.length < 10 && newReview.content.length > 0) || newReview.content.length > 2000}
            helperText={`${newReview.content.length}/2000자 (최소 10자 이상)${newReview.content.length > 2000 ? ' (글자 수가 초과되었습니다)' : newReview.content.length < 10 && newReview.content.length > 0 ? ' (10자 이상 입력해주세요)' : ''}`}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<Camera />}
              variant="outlined"
              component="label"
              sx={{ mr: 2 }}
            >
              사진 추가
              <input type="file" hidden multiple accept="image/*" />
            </Button>
            <Typography variant="caption" color="text.secondary">
              최대 5장까지 업로드 가능
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={
              !newReview.title.trim() ||
              !newReview.content.trim() ||
              newReview.title.length > 100 ||
              newReview.content.length < 10 ||
              newReview.content.length > 2000 ||
              submitting
            }
          >
            {editingReview ? '수정' : '작성'} 완료
          </Button>
        </DialogActions>
      </Dialog>

      {/* 메뉴 */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 120 }
        }}
      >
        <MenuItem onClick={handleMenuClose}>신고하기</MenuItem>
        {selectedReview && userId && (
          <MenuItem onClick={handleMenuClose}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            삭제하기
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default RestaurantReviews;