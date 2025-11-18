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
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
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
import { useAuth } from '../context/AuthContext';

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
  is_anonymous?: boolean;
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
  initialReviews?: Review[];
  initialStats?: ReviewStats | null;
  onReviewCountChange?: (count: number) => void;
  onRatingChange?: (rating: number) => void;
}

const RestaurantReviews: React.FC<RestaurantReviewsProps> = ({
  restaurantId,
  userId,
  initialReviews = [],
  initialStats = null,
  onReviewCountChange,
  onRatingChange
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(initialStats);
  const [error, setError] = useState('');
  const [writeDialogOpen, setWriteDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);

  // 리뷰 작성 폼 상태
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    images: [] as string[],
    tags: [] as string[],
    is_anonymous: false
  });

  // 초기 데이터 동기화
  useEffect(() => {
    setReviews(initialReviews);
    setReviewStats(initialStats);
  }, [initialReviews, initialStats]);

  // 리뷰 작성/수정
  const handleSubmitReview = async () => {
    if (!newReview.title.trim() || !newReview.content.trim() || !userId) return;

    // 프론트엔드 검증
    const title = newReview.title.trim();
    const content = newReview.content.trim();
    const rating = newReview.rating;

    // 제목 검증
    if (title.length < 1) {
      setError('리뷰 제목을 입력해주세요.');
      return;
    }
    if (title.length > 100) {
      setError('리뷰 제목은 100자 이하로 작성해주세요.');
      return;
    }

    // 내용 검증
    if (content.length < 10) {
      setError(`리뷰 내용은 최소 10자 이상 작성해주세요. (현재 ${content.length}자)`);
      return;
    }
    if (content.length > 2000) {
      setError('리뷰 내용은 2000자 이하로 작성해주세요.');
      return;
    }

    // 평점 검증
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
          tags: newReview.tags,
          is_anonymous: newReview.is_anonymous
        });
      } else {
        // 리뷰 작성
        response = await ApiService.createReview({
          restaurant_id: restaurantId,
          rating: newReview.rating,
          title: title,
          content: content,
          images: newReview.images,
          tags: newReview.tags,
          is_anonymous: newReview.is_anonymous
        });
      }

      if (response.success && response.data) {
        // 리뷰 목록과 통계 다시 로드 - 부모에게 알림
        onReviewCountChange?.(0); // 부모가 전체 데이터를 다시 로드하도록 트리거
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
        // 부모 컴포넌트가 데이터를 다시 로드하도록 트리거
        onReviewCountChange?.(0);
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
    // 이메일 인증 확인
    if (!userId) {
      setError('리뷰 작성은 로그인 후 가능합니다.');
      return;
    }

    // AuthContext에서 user 정보 사용
    if (user && !user.email_verified) {
      setError('리뷰 작성은 이메일 인증 후 가능합니다. 이메일을 확인하고 인증을 완료해주세요.');
      return;
    }

    if (review) {
      setEditingReview(review);
      setNewReview({
        rating: review.rating,
        title: review.title,
        content: review.content,
        images: review.images,
        tags: review.tags || [],
        is_anonymous: review.is_anonymous || false
      });
    } else {
      setEditingReview(null);
      setNewReview({
        rating: 5,
        title: '',
        content: '',
        images: [],
        tags: [],
        is_anonymous: false
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
      tags: [],
      is_anonymous: false
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

  const handleMenuCloseOnly = () => {
    setMenuAnchor(null);
    // selectedReview는 초기화하지 않음
  };

  // 리뷰 삭제
  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      const response = await ApiService.deleteReview(selectedReview);
      if (response.success) {
        onReviewCountChange?.(0); // 부모가 전체 데이터를 다시 로드하도록 트리거
        handleMenuClose();
      } else {
        setError(response.message || '리뷰 삭제에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('리뷰 삭제 오류:', err);
      setError(err.userMessage || '리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  // 리뷰 신고
  const handleReportReview = async () => {
    console.log('신고 시작:', { reportingReviewId, reportReason, reportDetails });

    if (!reportingReviewId || !reportReason.trim()) {
      console.log('필수 값 누락:', { reportingReviewId, reportReason: reportReason.trim() });
      return;
    }

    try {
      console.log('신고 API 호출 중...');
      const response = await ApiService.reportReview(reportingReviewId, {
        reason: reportReason,
        details: reportDetails.trim() || undefined
      });

      console.log('신고 API 응답:', response);

      if (response.success) {
        handleCloseReportDialog();
        alert('신고가 접수되었습니다. 빠른 시일 내에 검토하겠습니다.');
      } else {
        console.error('신고 실패:', response.message);
        setError(response.message || '신고 접수에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('리뷰 신고 오류:', err);
      setError(err.userMessage || err.response?.data?.message || '신고 접수 중 오류가 발생했습니다.');
    }
  };

  const handleOpenReportDialog = () => {
    console.log('신고 다이얼로그 열기:', selectedReview);

    // 프론트엔드에서 본인 글 신고 방지
    if (selectedReview && userId) {
      const selectedReviewData = reviews.find(r => r.id === selectedReview);
      if (selectedReviewData?.user_id === userId) {
        setError('본인이 작성한 리뷰는 신고할 수 없습니다.');
        handleMenuCloseOnly();
        return;
      }
    }

    setReportingReviewId(selectedReview); // 신고할 리뷰 ID 저장
    setReportDialogOpen(true);
    handleMenuCloseOnly(); // 메뉴만 닫고 selectedReview는 유지
  };

  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
    setReportReason('');
    setReportDetails('');
    setReportingReviewId(null);
    setSelectedReview(null); // 이제 선택 초기화
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

  // 초기 로딩 상태 제거 - 부모에서 데이터를 받기 때문에

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
        aria-labelledby="review-dialog-title"
        aria-describedby="review-dialog-description"
        PaperProps={{
          sx: { borderRadius: 2 },
          'aria-modal': true,
          role: 'dialog'
        }}
      >
        <DialogTitle id="review-dialog-title" sx={{ pb: 1 }}>
          {editingReview ? '리뷰 수정' : '리뷰 작성'}
        </DialogTitle>
        <DialogContent id="review-dialog-description">
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              별점
            </Typography>
            <Rating
              value={newReview.rating}
              onChange={(_, value) => setNewReview(prev => ({ ...prev, rating: value || 1 }))}
              size="large"
              aria-label="리뷰 별점 선택"
            />
          </Box>

          <TextField
            fullWidth
            label="제목"
            placeholder="리뷰 제목을 입력해주세요 (1자 이상)"
            value={newReview.title}
            onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
            error={(newReview.title.length > 100) || (newReview.title.trim().length === 0 && newReview.title.length > 0)}
            helperText={
              newReview.title.length > 100
                ? `${newReview.title.length}/100자 - 제목은 100자 이하로 입력해주세요`
                : newReview.title.trim().length === 0 && newReview.title.length > 0
                ? '제목을 입력해주세요 (공백만으로는 작성할 수 없습니다)'
                : `${newReview.title.length}/100자`
            }
            sx={{ mb: 3 }}
            aria-label="리뷰 제목 입력"
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="리뷰 내용"
            placeholder="음식의 맛, 서비스, 분위기 등에 대해 자세히 써주세요 (최소 10자 이상)..."
            value={newReview.content}
            onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
            error={(newReview.content.trim().length < 10 && newReview.content.length > 0) || newReview.content.length > 2000}
            helperText={
              newReview.content.length > 2000
                ? `${newReview.content.length}/2000자 - 리뷰 내용은 2000자 이하로 작성해주세요`
                : newReview.content.trim().length < 10 && newReview.content.length > 0
                ? `${newReview.content.trim().length}/2000자 - 리뷰 내용은 최소 10자 이상 작성해주세요 (현재 ${newReview.content.trim().length}자)`
                : `${newReview.content.length}/2000자 (최소 10자 이상 필수)`
            }
            sx={{ mb: 3 }}
            aria-label="리뷰 내용 입력"
          />

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newReview.is_anonymous}
                  onChange={(e) => setNewReview(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                  aria-label="익명으로 작성"
                />
              }
              label={
                <Box>
                  <Typography variant="body2">익명으로 작성</Typography>
                  <Typography variant="caption" color="text.secondary">
                    익명으로 작성하면 이름과 프로필 사진이 공개되지 않습니다
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<Camera />}
              variant="outlined"
              component="label"
              sx={{ mr: 2 }}
              aria-label="리뷰 사진 업로드"
            >
              사진 추가
              <input type="file" hidden multiple accept="image/*" aria-label="이미지 파일 선택" />
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
              newReview.title.trim().length > 100 ||
              newReview.content.trim().length < 10 ||
              newReview.content.trim().length > 2000 ||
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
        {/* 본인 글이 아닌 경우에만 신고 메뉴 표시 */}
        {selectedReview && userId && reviews.find(r => r.id === selectedReview)?.user_id !== userId && (
          <MenuItem onClick={handleOpenReportDialog}>신고하기</MenuItem>
        )}
        {/* 비로그인 사용자에게도 신고 메뉴 표시 */}
        {!userId && (
          <MenuItem onClick={() => {
            setError('리뷰 신고는 로그인 후 가능합니다.');
            handleMenuCloseOnly();
          }}>신고하기</MenuItem>
        )}
        {selectedReview && userId && reviews.find(r => r.id === selectedReview)?.user_id === userId && (
          <MenuItem onClick={handleDeleteReview}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            삭제하기
          </MenuItem>
        )}
      </Menu>

      {/* 신고 다이얼로그 */}
      <Dialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="report-dialog-title"
        disableEscapeKeyDown={false}
        keepMounted={false}
      >
        <DialogTitle id="report-dialog-title">
          리뷰 신고하기
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            부적절한 내용의 리뷰를 신고해주세요. 신고 내용은 검토 후 조치됩니다.
          </Typography>
          <TextField
            select
            fullWidth
            label="신고 사유"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            sx={{ mb: 2 }}
            id="report-reason-select"
            SelectProps={{
              native: false,
            }}
          >
            <MenuItem value="spam">스팸/광고</MenuItem>
            <MenuItem value="inappropriate">부적절한 내용</MenuItem>
            <MenuItem value="fake">허위 정보</MenuItem>
            <MenuItem value="harassment">욕설/비방</MenuItem>
            <MenuItem value="other">기타</MenuItem>
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="상세 설명 (선택사항)"
            placeholder="신고 사유에 대한 추가 설명을 입력해주세요..."
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            inputProps={{ maxLength: 500 }}
            helperText={`${reportDetails.length}/500자`}
            id="report-details-input"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReportDialog}>
            취소
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReportReview}
            disabled={!reportReason.trim()}
          >
            신고하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantReviews;