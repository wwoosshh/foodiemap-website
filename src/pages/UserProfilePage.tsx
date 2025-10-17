import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  CardMedia,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import ProfileEditModal from '../components/ProfileEditModal';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import {
  UserIcon,
  EmailIcon,
  PhoneIcon,
  HeartFilledIcon,
  ReviewIcon,
  SettingsIcon,
  StarFilledIcon,
  LocationIcon,
  RestaurantIcon,
} from '../components/icons/CustomIcons';
import { DEFAULT_RESTAURANT_IMAGE, handleImageError } from '../constants/images';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, refreshUser, logout } = useAuth();

  const [selectedTab, setSelectedTab] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 회원 탈퇴 관련 상태
  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
  const [deletionStatus, setDeletionStatus] = useState<any>(null);
  const [deletionLoading, setDeletionLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadUserData();
    loadDeletionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [favoritesRes, reviewsRes] = await Promise.all([
        ApiService.getUserFavorites(),
        ApiService.getUserReviews({ page: 1, limit: 10 }),
      ]);

      if (favoritesRes.success && favoritesRes.data) {
        setFavorites(favoritesRes.data.favorites || []);
      }

      if (reviewsRes.success && reviewsRes.data) {
        setMyReviews(reviewsRes.data.reviews || []);
      }
    } catch (err) {
      // 로드 실패 시 빈 배열 유지
    } finally {
      setLoading(false);
    }
  };

  // 탈퇴 상태 조회
  const loadDeletionStatus = async () => {
    try {
      const response = await ApiService.getDeletionStatus();
      if (response.success && response.data) {
        setDeletionStatus(response.data);
      }
    } catch (err) {
      console.error('탈퇴 상태 조회 실패:', err);
    }
  };

  // 회원 탈퇴 요청
  const handleRequestDeletion = async () => {
    try {
      setDeletionLoading(true);
      const response = await ApiService.requestAccountDeletion(deletionReason || undefined);

      if (response.success) {
        alert('회원 탈퇴 요청이 완료되었습니다. 30일 이내에 복구하실 수 있습니다.');
        setDeletionDialogOpen(false);
        setDeletionReason('');
        await loadDeletionStatus();

        // 로그아웃 처리
        setTimeout(() => {
          logout();
          navigate('/');
        }, 2000);
      }
    } catch (err: any) {
      alert(err.userMessage || '회원 탈퇴 요청 중 오류가 발생했습니다.');
    } finally {
      setDeletionLoading(false);
    }
  };

  // 계정 복구
  const handleRecoverAccount = async () => {
    try {
      setDeletionLoading(true);
      const response = await ApiService.recoverAccount();

      if (response.success) {
        alert('계정이 성공적으로 복구되었습니다.');
        await loadDeletionStatus();
        await refreshUser();
      }
    } catch (err: any) {
      alert(err.userMessage || '계정 복구 중 오류가 발생했습니다.');
    } finally {
      setDeletionLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const renderRating = (rating: number) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <StarFilledIcon sx={{ fontSize: 16, color: '#FFD93D' }} />
        <Typography variant="body2" fontWeight={600}>
          {rating.toFixed(1)}
        </Typography>
      </Box>
    );
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 프로필 헤더 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={user.avatar_url}
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid',
                  borderColor: 'primary.main',
                }}
              >
                <UserIcon sx={{ fontSize: 60 }} />
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  {user.name}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                    {user.email_verified && (
                      <Chip label="인증됨" size="small" color="success" />
                    )}
                  </Box>

                  {user.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {user.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  onClick={() => setEditModalOpen(true)}
                >
                  프로필 수정
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 통계 카드 */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3, mb: 4 }}>
          <Box>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <HeartFilledIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                <Typography variant="h4" fontWeight={800}>
                  {favorites.length}
                </Typography>
                <Typography variant="body2">즐겨찾기</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                color: 'white',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <ReviewIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                <Typography variant="h4" fontWeight={800}>
                  {myReviews.length}
                </Typography>
                <Typography variant="body2">작성한 리뷰</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, #FFB84D 100%)`,
                color: 'white',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <RestaurantIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                <Typography variant="h4" fontWeight={800}>
                  {favorites.length + myReviews.length}
                </Typography>
                <Typography variant="body2">활동 점수</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* 탈퇴 대기 알림 */}
        {deletionStatus?.is_deletion_scheduled && (
          <Alert
            severity="warning"
            icon={<WarningIcon />}
            action={
              deletionStatus.can_recover && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleRecoverAccount}
                  disabled={deletionLoading}
                  startIcon={<RestoreIcon />}
                >
                  계정 복구
                </Button>
              )
            }
            sx={{ mb: 3 }}
          >
            <Typography variant="body2" fontWeight={600}>
              탈퇴 대기 중인 계정입니다
            </Typography>
            <Typography variant="caption">
              {deletionStatus.deletion_deadline &&
                `${new Date(deletionStatus.deletion_deadline).toLocaleDateString()}
                (${Math.floor(deletionStatus.days_remaining || 0)}일 후) 완전히 삭제됩니다.`}
            </Typography>
          </Alert>
        )}

        {/* 탭 */}
        <Box sx={{ mb: 3 }}>
          <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
            <Tab label={`즐겨찾기 (${favorites.length})`} />
            <Tab label={`내 리뷰 (${myReviews.length})`} />
            <Tab label="설정" icon={<SettingsIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* 즐겨찾기 탭 */}
            {selectedTab === 0 && (
              <Box>
                {favorites.length === 0 ? (
                  <Alert severity="info">즐겨찾기한 맛집이 없습니다.</Alert>
                ) : (
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
                    {favorites.map((fav) => (
                      <Box key={fav.id}>
                        <Card>
                          <CardActionArea
                            onClick={() => navigate(`/restaurants/${fav.restaurant?.id}`)}
                          >
                            <CardMedia
                              component="img"
                              height="200"
                              image={
                                fav.restaurant?.images?.[0] || DEFAULT_RESTAURANT_IMAGE
                              }
                              alt={fav.restaurant?.name}
                              onError={handleImageError}
                            />
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" fontWeight={700}>
                                  {fav.restaurant?.name}
                                </Typography>
                                {renderRating(fav.restaurant?.rating || 0)}
                              </Box>

                              {fav.restaurant?.categories && (
                                <Chip
                                  label={fav.restaurant.categories.name}
                                  size="small"
                                  sx={{
                                    mb: 1,
                                    backgroundColor: theme.palette.primary.main,
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                  }}
                                />
                              )}

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  {fav.restaurant?.address}
                                </Typography>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* 내 리뷰 탭 */}
            {selectedTab === 1 && (
              <Box>
                {myReviews.length === 0 ? (
                  <Alert severity="info">작성한 리뷰가 없습니다.</Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {myReviews.map((review) => (
                      <Card key={review.id} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': { color: 'primary.main' },
                                }}
                                onClick={() => navigate(`/restaurants/${review.restaurant_id}`)}
                              >
                                {review.restaurant?.name || '맛집'}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                {renderRating(review.rating || 0)}
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          {review.title && (
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              {review.title}
                            </Typography>
                          )}

                          <Typography variant="body2" color="text.secondary">
                            {review.content}
                          </Typography>

                          {review.images && review.images.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
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
                                    onError={handleImageError}
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
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* 설정 탭 */}
            {selectedTab === 2 && (
              <Box>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      계정 관리
                    </Typography>

                    {deletionStatus?.is_deletion_scheduled ? (
                      <Alert
                        severity="warning"
                        icon={<WarningIcon />}
                        sx={{ mb: 3 }}
                      >
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          탈퇴 대기 중인 계정입니다
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {deletionStatus.deletion_deadline &&
                            `${new Date(deletionStatus.deletion_deadline).toLocaleDateString()}
                            (${Math.floor(deletionStatus.days_remaining || 0)}일 후) 완전히 삭제됩니다.`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                          30일 이내에 계정을 복구할 수 있습니다. 복구 후에는 정상적으로 서비스를 이용하실 수 있습니다.
                        </Typography>
                        {deletionStatus.can_recover && (
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<RestoreIcon />}
                            onClick={handleRecoverAccount}
                            disabled={deletionLoading}
                          >
                            계정 복구하기
                          </Button>
                        )}
                      </Alert>
                    ) : (
                      <Box>
                        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            회원 탈퇴 시 주의사항
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                            • 탈퇴 요청 후 30일간 유예기간이 제공됩니다.
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                            • 유예기간 동안 로그인이 불가하며, 계정 복구를 요청할 수 있습니다.
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                            • 30일이 지나면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                          </Typography>
                          <Typography variant="caption" component="div">
                            • 작성한 리뷰, 즐겨찾기 등 모든 활동 내역이 삭제됩니다.
                          </Typography>
                        </Alert>

                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteForeverIcon />}
                          onClick={() => setDeletionDialogOpen(true)}
                          fullWidth
                        >
                          회원 탈퇴
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </>
        )}
      </Container>

      {/* 회원 탈퇴 확인 다이얼로그 */}
      <Dialog
        open={deletionDialogOpen}
        onClose={() => !deletionLoading && setDeletionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" />
            <Typography variant="h6" fontWeight={700}>
              정말 탈퇴하시겠습니까?
            </Typography>
          </Box>
          <IconButton
            onClick={() => setDeletionDialogOpen(false)}
            disabled={deletionLoading}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              회원 탈퇴 시 주의사항
            </Typography>
            <Typography variant="caption" component="div">
              • 탈퇴 요청 후 30일간 유예기간이 제공됩니다<br />
              • 유예기간 동안 로그인이 불가하며, 계정 복구를 요청할 수 있습니다<br />
              • 30일이 지나면 모든 데이터가 영구적으로 삭제됩니다<br />
              • 작성한 리뷰, 즐겨찾기 등 모든 활동 내역이 삭제됩니다
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="탈퇴 사유 (선택사항)"
            placeholder="탈퇴하시는 이유를 알려주시면 서비스 개선에 도움이 됩니다."
            value={deletionReason}
            onChange={(e) => setDeletionReason(e.target.value)}
            disabled={deletionLoading}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeletionDialogOpen(false)} disabled={deletionLoading}>
            취소
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRequestDeletion}
            disabled={deletionLoading}
            startIcon={deletionLoading ? <CircularProgress size={20} /> : <DeleteForeverIcon />}
          >
            {deletionLoading ? '처리 중...' : '탈퇴하기'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          refreshUser();
          setEditModalOpen(false);
        }}
      />
    </MainLayout>
  );
};

export default UserProfilePage;
