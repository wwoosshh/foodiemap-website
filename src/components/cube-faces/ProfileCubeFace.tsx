import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Avatar, Card, CardContent, Button, Tabs, Tab } from '@mui/material';
import { Person, FavoriteBorder, RateReview, Logout as LogoutIcon, Star } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../LoginModal';
import { ApiService } from '../../services/api';
import RestaurantDetailModal from '../RestaurantDetailModal';
import CubeLoader from '../CubeLoader';

interface ProfileCubeFaceProps {
  onNavigate: (face: string) => void;
}

const ProfileCubeFace: React.FC<ProfileCubeFaceProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // 즐겨찾기 데이터 로드
  useEffect(() => {
    if (user && currentTab === 0) {
      const loadFavorites = async () => {
        setLoading(true);
        try {
          const response = await ApiService.getUserFavorites();
          if (response.success && response.data) {
            setFavorites(response.data.favorites || []);
          }
        } catch (error) {
          console.error('즐겨찾기 로드 실패:', error);
        } finally {
          setLoading(false);
        }
      };
      loadFavorites();
    }
  }, [user, currentTab]);

  // 리뷰 데이터 로드
  useEffect(() => {
    if (user && currentTab === 1) {
      const loadReviews = async () => {
        setLoading(true);
        try {
          const response = await ApiService.getUserReviews({ page: 1, limit: 20 });
          if (response.success && response.data) {
            setReviews(response.data.reviews || []);
          }
        } catch (error) {
          console.error('리뷰 로드 실패:', error);
        } finally {
          setLoading(false);
        }
      };
      loadReviews();
    }
  }, [user, currentTab]);

  const handleRestaurantClick = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setDetailModalOpen(true);
  };

  // 로그인 하지 않은 경우
  if (!user) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateZ(0)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Container maxWidth="sm">
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 24px',
                  backgroundColor: 'grey.300',
                }}
              >
                <Person sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                로그인이 필요합니다
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                맛집 리뷰와 즐겨찾기 기능을 이용하려면 로그인해주세요
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setLoginModalOpen(true)}
                sx={{ px: 4 }}
              >
                로그인 / 회원가입
              </Button>
            </CardContent>
          </Card>
        </Container>

        <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </Box>
    );
  }

  // 로그인한 경우
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
        {/* 프로필 헤더 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={user.avatar_url}
                sx={{ width: 100, height: 100 }}
              >
                <Person sx={{ fontSize: 60 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  {user.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                {user.phone && (
                  <Typography variant="body2" color="text.secondary">
                    {user.phone}
                  </Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* 탭 메뉴 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)}>
            <Tab icon={<FavoriteBorder />} label="즐겨찾기" />
            <Tab icon={<RateReview />} label="내 리뷰" />
          </Tabs>
        </Box>

        {/* 탭 컨텐츠 */}
        {currentTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              즐겨찾기한 맛집 ({favorites.length})
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CubeLoader size={60} message="즐겨찾기 불러오는 중..." />
              </Box>
            ) : favorites.length === 0 ? (
              <Box
                sx={{
                  minHeight: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  즐겨찾기한 맛집이 없습니다
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {favorites.map((fav) => (
                  <Card
                    key={fav.id}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleRestaurantClick(fav.restaurants)}
                  >
                    <Box
                      component="img"
                      src={fav.restaurants?.images?.[0] || '/placeholder-restaurant.png'}
                      alt={fav.restaurants?.name}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {fav.restaurants?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {fav.restaurants?.address}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}

        {currentTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              작성한 리뷰 ({reviews.length})
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CubeLoader size={60} message="리뷰 불러오는 중..." />
              </Box>
            ) : reviews.length === 0 ? (
              <Box
                sx={{
                  minHeight: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  작성한 리뷰가 없습니다
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleRestaurantClick(review.restaurants)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {review.restaurants?.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                sx={{
                                  fontSize: 20,
                                  color: i < review.rating ? '#FFB800' : '#E0E0E0',
                                }}
                              />
                            ))}
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {new Date(review.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {review.title && (
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {review.title}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {review.content}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* 레스토랑 상세 모달 */}
      <RestaurantDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        restaurant={selectedRestaurant}
      />
    </Box>
  );
};

export default ProfileCubeFace;
