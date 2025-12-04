import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  useTheme,
  alpha,
  Skeleton,
  useMediaQuery,
  IconButton,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Restaurant as RestaurantIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_RESTAURANT_IMAGE, handleImageError } from '../constants/images';

interface CollectionItem {
  id: string;
  note: string;
  display_order: number;
  added_at: string;
  restaurant: {
    id: string;
    name: string;
    address: string;
    rating: number;
    review_count: number;
    price_range: string;
    category: {
      id: string;
      name: string;
      icon: string;
    };
    thumbnail: string;
    image: string;
  };
}

interface CollectionDetail {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  type: string;
  visibility: string;
  item_count: number;
  like_count: number;
  save_count: number;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
    follower_count: number;
    collection_count: number;
  };
  items: CollectionItem[];
  is_liked: boolean;
  is_saved: boolean;
  is_owner: boolean;
  is_following: boolean;
}

const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collection, setCollection] = useState<CollectionDetail | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 중복 로드 방지
  const loadedRef = React.useRef(false);

  // 컬렉션 로드
  const loadCollection = useCallback(async () => {
    if (!id || loadedRef.current) return;
    loadedRef.current = true;

    setLoading(true);
    try {
      const response = await ApiService.getCollectionById(id);
      if (response.success) {
        setCollection(response.data);
      }
    } catch (err: any) {
      setError(err.userMessage || '컬렉션을 불러오는데 실패했습니다.');
      loadedRef.current = false; // 에러 시 재시도 허용
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadedRef.current = false; // id 변경 시 리셋
    loadCollection();
  }, [loadCollection]);

  // 좋아요 토글
  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!collection) return;

    try {
      const response = await ApiService.toggleCollectionLike(collection.id);
      if (response.success && response.data) {
        const isLiked = response.data.is_liked;
        setCollection((prev) =>
          prev
            ? {
                ...prev,
                is_liked: isLiked,
                like_count: isLiked ? prev.like_count + 1 : prev.like_count - 1,
              }
            : null
        );
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  // 저장 토글
  const handleSave = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!collection) return;

    try {
      const response = await ApiService.toggleCollectionSave(collection.id);
      if (response.success && response.data) {
        const isSaved = response.data.is_saved;
        setCollection((prev) =>
          prev
            ? {
                ...prev,
                is_saved: isSaved,
                save_count: isSaved ? prev.save_count + 1 : prev.save_count - 1,
              }
            : null
        );
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  // 팔로우 토글
  const handleFollow = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!collection) return;

    try {
      if (collection.is_following) {
        await ApiService.unfollowUser(collection.user.id);
      } else {
        await ApiService.followUser(collection.user.id);
      }
      setCollection((prev) =>
        prev
          ? {
              ...prev,
              is_following: !prev.is_following,
            }
          : null
      );
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    }
  };

  // 공유
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: collection?.title,
        text: collection?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!id) return;

    try {
      await ApiService.deleteCollection(id);
      navigate('/community');
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
    setDeleteDialogOpen(false);
  };

  // 맛집 클릭
  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, mb: 3 }} />
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2 }} />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error || !collection) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Alert severity="error">{error || '컬렉션을 찾을 수 없습니다.'}</Alert>
          <Button onClick={() => navigate('/community')} sx={{ mt: 2 }}>
            커뮤니티로 돌아가기
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* 뒤로가기 */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          뒤로
        </Button>

        {/* 커버 이미지 */}
        <Box
          sx={{
            position: 'relative',
            height: isMobile ? 200 : 300,
            borderRadius: 3,
            overflow: 'hidden',
            mb: 3,
            bgcolor: 'action.hover',
          }}
        >
          {collection.cover_image_url ? (
            <Box
              component="img"
              src={collection.cover_image_url}
              alt={collection.title}
              onError={handleImageError}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <RestaurantIcon sx={{ fontSize: 80, color: 'grey.400' }} />
            </Box>
          )}
        </Box>

        {/* 컬렉션 정보 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {collection.title}
              </Typography>
              {collection.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {collection.description}
                </Typography>
              )}
            </Box>

            {/* 메뉴 버튼 (본인 컬렉션인 경우) */}
            {collection.is_owner && (
              <>
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={() => setMenuAnchor(null)}
                >
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null);
                      navigate(`/community/collections/${id}/edit`);
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>수정하기</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null);
                      setDeleteDialogOpen(true);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>삭제하기</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* 작성자 정보 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={collection.user.avatar_url}
              alt={collection.user.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {collection.user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(collection.created_at)}
              </Typography>
            </Box>
            {!collection.is_owner && (
              <Button
                variant={collection.is_following ? 'outlined' : 'contained'}
                size="small"
                startIcon={collection.is_following ? <PersonRemoveIcon /> : <PersonAddIcon />}
                onClick={handleFollow}
              >
                {collection.is_following ? '팔로잉' : '팔로우'}
              </Button>
            )}
          </Box>

          {/* 통계 및 액션 버튼 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={collection.is_liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                onClick={handleLike}
              >
                좋아요 {collection.like_count}
              </Button>
              <Button
                variant="outlined"
                startIcon={collection.is_saved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                onClick={handleSave}
              >
                저장 {collection.save_count}
              </Button>
              <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleShare}>
                공유
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {collection.view_count.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 맛집 목록 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            맛집 목록 ({collection.item_count})
          </Typography>

          {collection.items.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                bgcolor: 'action.hover',
                borderRadius: 3,
              }}
            >
              <RestaurantIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">아직 추가된 맛집이 없습니다</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {collection.items.map((item, index) => (
                <Card
                  key={item.id}
                  sx={{
                    borderRadius: 2,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    bgcolor: 'background.paper',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                  onClick={() => handleRestaurantClick(item.restaurant.id)}
                >
                  <Box sx={{ display: 'flex' }}>
                    {/* 순서 번호 */}
                    <Box
                      sx={{
                        width: 36,
                        minWidth: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'action.hover',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: 'text.secondary',
                      }}
                    >
                      {index + 1}
                    </Box>

                    {/* 이미지 */}
                    <Box
                      sx={{
                        width: 100,
                        minWidth: 100,
                        height: 100,
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src={item.restaurant.thumbnail || item.restaurant.image || DEFAULT_RESTAURANT_IMAGE}
                        alt={item.restaurant.name}
                        onError={handleImageError}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>

                    {/* 정보 */}
                    <CardContent sx={{ flex: 1, py: 1.5, minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {item.restaurant.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2">{item.restaurant.rating?.toFixed(1) || '-'}</Typography>
                        </Box>
                        {item.restaurant.category?.name && (
                          <Typography variant="body2" color="text.secondary">
                            · {item.restaurant.category.name}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }} />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {item.restaurant.address}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Box>

                  {/* 메모 - 컬렉션 작성자의 추천 이유 */}
                  {item.note && (
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          fontStyle: 'italic',
                          lineHeight: 1.6,
                        }}
                      >
                        💬 "{item.note}"
                      </Typography>
                    </Box>
                  )}
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>컬렉션 삭제</DialogTitle>
          <DialogContent>
            <Typography>정말로 이 컬렉션을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default CollectionDetailPage;
