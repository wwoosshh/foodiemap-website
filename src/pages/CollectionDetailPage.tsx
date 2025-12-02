import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Alert,
  useTheme,
  alpha,
  Skeleton,
  useMediaQuery,
  IconButton,
  Avatar,
  TextField,
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
  Send as SendIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Restaurant as RestaurantIcon,
  Comment as CommentIcon,
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

interface Comment {
  id: string;
  content: string;
  like_count: number;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
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
  comment_count: number;
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 컬렉션 로드
  const loadCollection = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await ApiService.getCollectionById(id);
      if (response.success) {
        setCollection(response.data);
      }
    } catch (err: any) {
      setError(err.userMessage || '컬렉션을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 댓글 로드
  const loadComments = useCallback(async () => {
    if (!id) return;

    try {
      const response = await ApiService.getCollectionComments(id);
      if (response.success) {
        setComments(response.data.comments || []);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  }, [id]);

  useEffect(() => {
    loadCollection();
    loadComments();
  }, [loadCollection, loadComments]);

  // 좋아요 토글
  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!collection) return;

    try {
      const response = await ApiService.toggleCollectionLike(collection.id);
      if (response.success) {
        setCollection((prev) =>
          prev
            ? {
                ...prev,
                is_liked: response.data.is_liked,
                like_count: response.data.is_liked ? prev.like_count + 1 : prev.like_count - 1,
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
      if (response.success) {
        setCollection((prev) =>
          prev
            ? {
                ...prev,
                is_saved: response.data.is_saved,
                save_count: response.data.is_saved ? prev.save_count + 1 : prev.save_count - 1,
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

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!newComment.trim() || !id) return;

    setSubmittingComment(true);
    try {
      const response = await ApiService.createCollectionComment(id, {
        content: newComment.trim(),
      });
      if (response.success) {
        setComments((prev) => [response.data, ...prev]);
        setNewComment('');
        if (collection) {
          setCollection((prev) =>
            prev ? { ...prev, comment_count: prev.comment_count + 1 } : null
          );
        }
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmittingComment(false);
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

  // 가격 범위 표시
  const getPriceDisplay = (priceRange: string) => {
    switch (priceRange) {
      case 'low':
        return '₩';
      case 'medium':
        return '₩₩';
      case 'high':
        return '₩₩₩';
      case 'very_high':
        return '₩₩₩₩';
      default:
        return '';
    }
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
            bgcolor: 'grey.100',
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CommentIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {collection.comment_count}
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
                bgcolor: 'grey.50',
                borderRadius: 3,
              }}
            >
              <RestaurantIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
              <Typography color="text.secondary">아직 추가된 맛집이 없습니다</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {collection.items.map((item, index) => (
                <Card
                  key={item.id}
                  sx={{
                    display: 'flex',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                  onClick={() => handleRestaurantClick(item.restaurant.id)}
                >
                  {/* 순서 번호 */}
                  <Box
                    sx={{
                      width: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                      fontWeight: 700,
                      color: 'text.secondary',
                    }}
                  >
                    {index + 1}
                  </Box>

                  {/* 이미지 */}
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 100, objectFit: 'cover' }}
                    image={item.restaurant.thumbnail || item.restaurant.image || DEFAULT_RESTAURANT_IMAGE}
                    alt={item.restaurant.name}
                    onError={handleImageError}
                  />

                  {/* 정보 */}
                  <CardContent sx={{ flex: 1, py: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.restaurant.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="body2">{item.restaurant.rating?.toFixed(1)}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        · {item.restaurant.category?.name}
                      </Typography>
                      {item.restaurant.price_range && (
                        <Typography variant="body2" color="text.secondary">
                          · {getPriceDisplay(item.restaurant.price_range)}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.restaurant.address}
                      </Typography>
                    </Box>

                    {/* 메모 */}
                    {item.note && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          borderRadius: 1,
                          fontStyle: 'italic',
                        }}
                      >
                        "{item.note}"
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 댓글 섹션 */}
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            댓글 ({collection.comment_count})
          </Typography>

          {/* 댓글 작성 */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Avatar src={user?.avatar_url} sx={{ width: 40, height: 40 }} />
            <TextField
              fullWidth
              placeholder={user ? '댓글을 작성해주세요...' : '로그인 후 댓글을 작성할 수 있습니다'}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user || submittingComment}
              multiline
              maxRows={4}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || submittingComment}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* 댓글 목록 */}
          {comments.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                bgcolor: 'grey.50',
                borderRadius: 3,
              }}
            >
              <CommentIcon sx={{ fontSize: 40, color: 'grey.300', mb: 1 }} />
              <Typography color="text.secondary">아직 댓글이 없습니다</Typography>
              <Typography variant="caption" color="text.secondary">
                첫 댓글을 남겨보세요!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {comments.map((comment) => (
                <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
                  <Avatar src={comment.user.avatar_url} sx={{ width: 36, height: 36 }} />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {comment.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.created_at)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
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
