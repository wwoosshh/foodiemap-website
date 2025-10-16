import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Rating,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import NaverMap from '../components/NaverMap';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  StarFilledIcon,
  StarOutlineIcon,
  LocationIcon,
  PhoneIcon,
  HeartFilledIcon,
  HeartOutlineIcon,
  ShareIcon,
  ReviewIcon,
  ClockIcon,
  ArrowRightIcon,
} from '../components/icons/CustomIcons';
import {
  ThumbUp,
  ThumbUpOutlined,
  Report,
  Edit,
  Delete,
} from '@mui/icons-material';

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  // 리뷰 작성 상태
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewIsAnonymous, setReviewIsAnonymous] = useState(false);

  // 리뷰 인터랙션 상태
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  useEffect(() => {
    if (id) {
      loadRestaurantData();
    }
  }, [id]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getRestaurantCompleteData(id!);

      if (response.success && response.data) {
        setRestaurant(response.data.restaurant);
        setReviews(response.data.reviews?.items || []);
        setReviewStats(response.data.reviews?.stats);
        setMenus(response.data.menus || []);
        setIsFavorited(response.data.userInfo?.isFavorited || false);

        // 디버깅: 리뷰 데이터 확인
        console.log('리뷰 데이터:', response.data.reviews?.items);

        // 도움이 돼요 상태 초기화
        if (user && response.data.reviews?.items) {
          const helpfulSet = new Set<string>();
          response.data.reviews.items.forEach((review: any) => {
            if (review.user_helpful) {
              helpfulSet.add(review.id);
            }
          });
          setHelpfulReviews(helpfulSet);
        }
      }
    } catch (err: any) {
      console.error('Failed to load restaurant data:', err);
      setError(err.userMessage || '맛집 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (isFavorited) {
        await ApiService.removeFromFavorites(id!);
      } else {
        await ApiService.addToFavorites(id!);
      }
      setIsFavorited(!isFavorited);
    } catch (err: any) {
      alert(err.userMessage || '즐겨찾기 처리에 실패했습니다.');
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!reviewTitle.trim() || !reviewContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await ApiService.createReview({
        restaurant_id: id!,
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
        is_anonymous: reviewIsAnonymous,
      });

      alert('리뷰가 작성되었습니다.');
      setReviewDialogOpen(false);
      setReviewTitle('');
      setReviewContent('');
      setReviewRating(5);
      setReviewIsAnonymous(false);
      loadRestaurantData(); // 리뷰 목록 새로고침
    } catch (err: any) {
      alert(err.userMessage || '리뷰 작성에 실패했습니다.');
    }
  };

  const handleToggleHelpful = async (reviewId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await ApiService.toggleReviewHelpful(reviewId);
      if (response.success && response.data) {
        const responseData = response.data;

        // 로컬 상태 업데이트
        const newHelpfulReviews = new Set(helpfulReviews);
        if (responseData.is_helpful) {
          newHelpfulReviews.add(reviewId);
        } else {
          newHelpfulReviews.delete(reviewId);
        }
        setHelpfulReviews(newHelpfulReviews);

        // 리뷰 목록에서 해당 리뷰의 helpful_count 업데이트
        setReviews(reviews.map(review =>
          review.id === reviewId
            ? { ...review, helpful_count: responseData.helpful_count }
            : review
        ));
      }
    } catch (err: any) {
      alert(err.userMessage || '도움이 돼요 처리에 실패했습니다.');
    }
  };

  const handleOpenEditDialog = (review: any) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewTitle(review.title || '');
    setReviewContent(review.content || '');
    setReviewIsAnonymous(review.is_anonymous || false);
    setReviewDialogOpen(true);
  };

  const handleUpdateReview = async () => {
    if (!user || !editingReview) {
      return;
    }

    if (!reviewTitle.trim() || !reviewContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await ApiService.updateReview(editingReview.id, {
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
        is_anonymous: reviewIsAnonymous,
      });

      alert('리뷰가 수정되었습니다.');
      setReviewDialogOpen(false);
      setEditingReview(null);
      setReviewTitle('');
      setReviewContent('');
      setReviewRating(5);
      setReviewIsAnonymous(false);
      loadRestaurantData(); // 리뷰 목록 새로고침
    } catch (err: any) {
      alert(err.userMessage || '리뷰 수정에 실패했습니다.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await ApiService.deleteReview(reviewId);
      alert('리뷰가 삭제되었습니다.');
      loadRestaurantData(); // 리뷰 목록 새로고침
    } catch (err: any) {
      alert(err.userMessage || '리뷰 삭제에 실패했습니다.');
    }
  };

  const handleOpenReportDialog = (reviewId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    setReportingReviewId(reviewId);
    setReportDialogOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportingReviewId || !reportReason.trim()) {
      alert('신고 사유를 선택해주세요.');
      return;
    }

    try {
      await ApiService.reportReview(reportingReviewId, {
        reason: reportReason,
        details: reportDetails,
      });

      alert('신고가 접수되었습니다.');
      setReportDialogOpen(false);
      setReportingReviewId(null);
      setReportReason('');
      setReportDetails('');
    } catch (err: any) {
      alert(err.userMessage || '신고 접수에 실패했습니다.');
    }
  };

  const renderRating = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const fontSize = size === 'small' ? 16 : size === 'medium' ? 20 : 28;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <StarFilledIcon sx={{ fontSize, color: '#FFD93D' }} />
        <Typography variant={size === 'large' ? 'h5' : 'body1'} fontWeight={700}>
          {rating.toFixed(1)}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error || !restaurant) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Alert severity="error">{error || '맛집을 찾을 수 없습니다.'}</Alert>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* 이미지 갤러리 */}
        {restaurant.images && restaurant.images.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                width: '100%',
                height: 500,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                mb: 2,
              }}
            >
              <img
                src={restaurant.images[selectedImage]}
                alt={restaurant.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            {restaurant.images.length > 1 && (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)", md: "repeat(6, 1fr)" }, gap: 1 }}>
                {restaurant.images.map((image: string, index: number) => (
                  <Box key={index}>
                    <Box
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: '100%',
                        height: 100,
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '3px solid',
                        borderColor: selectedImage === index ? 'primary.main' : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.light',
                        },
                      }}
                    >
                      <img
                        src={image}
                        alt={`${restaurant.name} ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 4 }}>
          {/* 왼쪽: 맛집 정보 */}
          <Box>
            {/* 제목 & 액션 */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h3" fontWeight={800}>
                      {restaurant.name}
                    </Typography>
                    {restaurant.categories && (
                      <Chip
                        label={restaurant.categories.name}
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                  {renderRating(restaurant.rating || 0, 'large')}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    color={isFavorited ? 'primary' : 'default'}
                    onClick={handleToggleFavorite}
                    sx={{
                      width: 56,
                      height: 56,
                      border: '2px solid',
                      borderColor: isFavorited ? 'primary.main' : 'divider',
                    }}
                  >
                    {isFavorited ? (
                      <HeartFilledIcon sx={{ fontSize: 28 }} />
                    ) : (
                      <HeartOutlineIcon sx={{ fontSize: 28 }} />
                    )}
                  </IconButton>
                  <IconButton
                    sx={{
                      width: 56,
                      height: 56,
                      border: '2px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <ShareIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* 정보 카드 */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2, mb: 3 }}>
                <Box>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LocationIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            주소
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {restaurant.address}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {restaurant.phone && (
                  <Box>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PhoneIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              전화번호
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {restaurant.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Box>

              {/* 설명 */}
              {restaurant.description && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {restaurant.description}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* 탭 섹션 */}
            <Box sx={{ mb: 3 }}>
              <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
                <Tab label="리뷰" />
                <Tab label="메뉴" />
                <Tab label="지도" />
              </Tabs>
            </Box>

            {/* 리뷰 탭 */}
            {selectedTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight={700}>
                    리뷰 ({reviews.length})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<ReviewIcon />}
                    onClick={() => setReviewDialogOpen(true)}
                  >
                    리뷰 작성
                  </Button>
                </Box>

                {reviews.length === 0 ? (
                  <Alert severity="info">첫 번째 리뷰를 작성해보세요!</Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {reviews.map((review) => {
                      const isOwnReview = user?.id === review.user_id;
                      const isHelpful = helpfulReviews.has(review.id);

                      return (
                        <Card key={review.id} variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={review.is_anonymous ? undefined : review.avatar_url}>
                                  {review.username?.[0] || '익'}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    {review.username || '익명'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {renderRating(review.rating || 0, 'small')}
                                    <Typography variant="caption" color="text.secondary">
                                      {new Date(review.created_at).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>

                              {/* 본인 리뷰: 수정/삭제 버튼 */}
                              {isOwnReview && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenEditDialog(review)}
                                    sx={{ color: 'primary.main' }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteReview(review.id)}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>

                            {review.title && (
                              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                {review.title}
                              </Typography>
                            )}

                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {review.content}
                            </Typography>

                            {review.images && review.images.length > 0 && (
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                {review.images.map((img: string, idx: number) => (
                                  <Box
                                    key={idx}
                                    sx={{
                                      width: 100,
                                      height: 100,
                                      borderRadius: 2,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <img
                                      src={img}
                                      alt={`리뷰 이미지 ${idx + 1}`}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                      }}
                                    />
                                  </Box>
                                ))}
                              </Box>
                            )}

                            {/* 리뷰 액션 버튼 (다른 사람 리뷰) */}
                            {!isOwnReview && user && (
                              <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Button
                                  size="small"
                                  startIcon={isHelpful ? <ThumbUp /> : <ThumbUpOutlined />}
                                  onClick={() => handleToggleHelpful(review.id)}
                                  variant={isHelpful ? 'contained' : 'outlined'}
                                  sx={{ textTransform: 'none' }}
                                >
                                  도움이 돼요 {review.helpful_count > 0 && `(${review.helpful_count})`}
                                </Button>
                                <Button
                                  size="small"
                                  startIcon={<Report />}
                                  onClick={() => handleOpenReportDialog(review.id)}
                                  variant="outlined"
                                  color="error"
                                  sx={{ textTransform: 'none' }}
                                >
                                  신고
                                </Button>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}

            {/* 메뉴 탭 */}
            {selectedTab === 1 && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                  메뉴
                </Typography>
                {menus.length === 0 ? (
                  <Alert severity="info">등록된 메뉴가 없습니다.</Alert>
                ) : (
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                    {menus.map((menu) => (
                      <Box key={menu.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Box>
                                <Typography variant="h6" fontWeight={600}>
                                  {menu.name}
                                </Typography>
                                {menu.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {menu.description}
                                  </Typography>
                                )}
                              </Box>
                              <Typography variant="h6" fontWeight={700} color="primary.main">
                                {menu.price?.toLocaleString()}원
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* 지도 탭 */}
            {selectedTab === 2 && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                  위치
                </Typography>
                <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden' }}>
                  <NaverMap
                    latitude={restaurant.latitude || 37.5665}
                    longitude={restaurant.longitude || 126.9780}
                    address={restaurant.address}
                    restaurantName={restaurant.name}
                  />
                </Box>
              </Box>
            )}
          </Box>

          {/* 오른쪽: 통계 & 정보 */}
          <Box>
            <Card sx={{ position: 'sticky', top: 80 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  통계
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      평균 평점
                    </Typography>
                    <Box>{renderRating(restaurant.rating || 0, 'small')}</Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      리뷰 수
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {restaurant.review_count || 0}개
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      조회수
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {restaurant.view_count || 0}회
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      즐겨찾기
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {restaurant.favorite_count || 0}명
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/restaurants')}
                  endIcon={<ArrowRightIcon />}
                >
                  다른 맛집 보기
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* 리뷰 작성/수정 다이얼로그 */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => {
          setReviewDialogOpen(false);
          setEditingReview(null);
          setReviewTitle('');
          setReviewContent('');
          setReviewRating(5);
          setReviewIsAnonymous(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingReview ? '리뷰 수정' : '리뷰 작성'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              평점
            </Typography>
            <Rating
              value={reviewRating}
              onChange={(_, newValue) => setReviewRating(newValue || 5)}
              size="large"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="제목"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="내용"
              multiline
              rows={6}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={reviewIsAnonymous}
                  onChange={(e) => setReviewIsAnonymous(e.target.checked)}
                />
              }
              label="익명으로 작성"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setReviewDialogOpen(false);
              setEditingReview(null);
              setReviewTitle('');
              setReviewContent('');
              setReviewRating(5);
              setReviewIsAnonymous(false);
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={editingReview ? handleUpdateReview : handleSubmitReview}
          >
            {editingReview ? '수정하기' : '작성하기'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 신고 다이얼로그 */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => {
          setReportDialogOpen(false);
          setReportingReviewId(null);
          setReportReason('');
          setReportDetails('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>리뷰 신고</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              부적절한 리뷰를 신고해주세요. 신고 내용은 관리자가 검토합니다.
            </Typography>

            <TextField
              fullWidth
              select
              label="신고 사유"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="">선택해주세요</option>
              <option value="spam">스팸/광고</option>
              <option value="inappropriate">부적절한 내용</option>
              <option value="offensive">욕설/비방</option>
              <option value="false_info">허위 정보</option>
              <option value="other">기타</option>
            </TextField>

            <TextField
              fullWidth
              label="상세 내용 (선택사항)"
              multiline
              rows={4}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="신고 사유를 자세히 설명해주세요."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setReportDialogOpen(false);
              setReportingReviewId(null);
              setReportReason('');
              setReportDetails('');
            }}
          >
            취소
          </Button>
          <Button variant="contained" color="error" onClick={handleSubmitReport}>
            신고하기
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default RestaurantDetailPage;
