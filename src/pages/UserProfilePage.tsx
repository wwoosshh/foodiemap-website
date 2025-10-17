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
} from '@mui/material';
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
  const { user, refreshUser } = useAuth();

  const [selectedTab, setSelectedTab] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadUserData();
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

        {/* 탭 */}
        <Box sx={{ mb: 3 }}>
          <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
            <Tab label={`즐겨찾기 (${favorites.length})`} />
            <Tab label={`내 리뷰 (${myReviews.length})`} />
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
          </>
        )}
      </Container>

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
