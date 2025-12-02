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
  TextField,
  Alert,
  useTheme,
  alpha,
  Skeleton,
  useMediaQuery,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  Restaurant as RestaurantIcon,
  Star as StarIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_RESTAURANT_IMAGE, handleImageError } from '../constants/images';

interface SelectedRestaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  thumbnail: string;
  note: string;
}

const CollectionFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'followers_only'>('public');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [selectedRestaurants, setSelectedRestaurants] = useState<SelectedRestaurant[]>([]);

  // 맛집 추가 다이얼로그
  const [restaurantDialogOpen, setRestaurantDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // 메모 수정 다이얼로그
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [editingRestaurantId, setEditingRestaurantId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState('');

  // 즐겨찾기/리뷰 목록
  const [favorites, setFavorites] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [sourceTab, setSourceTab] = useState<'search' | 'favorites' | 'reviews'>('search');

  // 로그인 체크
  useEffect(() => {
    if (!user) {
      navigate('/community');
    }
  }, [user, navigate]);

  // 편집 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && id) {
      loadCollection();
    }
  }, [isEditMode, id]);

  // 즐겨찾기, 리뷰 로드
  useEffect(() => {
    if (user) {
      loadFavorites();
      loadUserReviews();
    }
  }, [user]);

  const loadCollection = async () => {
    try {
      const response = await ApiService.getCollectionById(id!);
      if (response.success) {
        const data = response.data;
        setTitle(data.title);
        setDescription(data.description || '');
        setVisibility(data.visibility);
        setCoverImageUrl(data.cover_image_url || '');
        setSelectedRestaurants(
          data.items.map((item: any) => ({
            id: item.restaurant.id,
            name: item.restaurant.name,
            address: item.restaurant.address,
            rating: item.restaurant.rating,
            thumbnail: item.restaurant.thumbnail,
            note: item.note || '',
          }))
        );
      }
    } catch (err) {
      setError('컬렉션을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await ApiService.getUserFavorites();
      if (response.success) {
        setFavorites(response.data.favorites || []);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const loadUserReviews = async () => {
    try {
      const response = await ApiService.getUserReviews({ limit: 50 });
      if (response.success) {
        setUserReviews(response.data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  // 맛집 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await ApiService.getRestaurants({
        search: searchQuery,
        limit: 20,
      });
      if (response.success) {
        setSearchResults(response.data.restaurants || []);
      }
    } catch (err) {
      console.error('Failed to search restaurants:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // 맛집 선택/해제
  const toggleRestaurant = (restaurant: any) => {
    const exists = selectedRestaurants.find((r) => r.id === restaurant.id);

    if (exists) {
      setSelectedRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
    } else {
      setSelectedRestaurants((prev) => [
        ...prev,
        {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          rating: restaurant.rating || 0,
          thumbnail: restaurant.representative_image || restaurant.thumbnail || '',
          note: '',
        },
      ]);
    }
  };

  // 맛집 제거
  const removeRestaurant = (restaurantId: string) => {
    setSelectedRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
  };

  // 메모 저장
  const saveNote = () => {
    if (editingRestaurantId) {
      setSelectedRestaurants((prev) =>
        prev.map((r) => (r.id === editingRestaurantId ? { ...r, note: editingNote } : r))
      );
    }
    setNoteDialogOpen(false);
    setEditingRestaurantId(null);
    setEditingNote('');
  };

  // 폼 제출
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        // 수정
        await ApiService.updateCollection(id!, {
          title: title.trim(),
          description: description.trim(),
          visibility,
          cover_image_url: coverImageUrl || undefined,
        });
        navigate(`/community/collections/${id}`);
      } else {
        // 생성
        const response = await ApiService.createCollection({
          title: title.trim(),
          description: description.trim(),
          visibility,
          cover_image_url: coverImageUrl || undefined,
          restaurant_ids: selectedRestaurants.map((r) => r.id),
        });
        if (response.success) {
          navigate(`/community/collections/${response.data.id}`);
        }
      }
    } catch (err: any) {
      setError(err.userMessage || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 소스 목록 렌더링
  const renderSourceList = () => {
    let items: any[] = [];

    switch (sourceTab) {
      case 'search':
        items = searchResults;
        break;
      case 'favorites':
        items = favorites.map((f) => f.restaurant);
        break;
      case 'reviews':
        items = userReviews.map((r) => r.restaurant);
        break;
    }

    if (sourceTab === 'search' && searchResults.length === 0 && !searchLoading) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <SearchIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
          <Typography color="text.secondary">맛집을 검색해주세요</Typography>
        </Box>
      );
    }

    if (items.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <RestaurantIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
          <Typography color="text.secondary">
            {sourceTab === 'favorites' ? '즐겨찾기한 맛집이 없습니다' : '작성한 리뷰가 없습니다'}
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {items.map((restaurant) => {
          const isSelected = selectedRestaurants.some((r) => r.id === restaurant.id);

          return (
            <ListItem
              key={restaurant.id}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
              onClick={() => toggleRestaurant(restaurant)}
            >
              <Checkbox checked={isSelected} sx={{ mr: 1 }} />
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  src={restaurant.representative_image || restaurant.thumbnail}
                  sx={{ width: 56, height: 56 }}
                >
                  <RestaurantIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={restaurant.name}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                      <Typography variant="caption">{restaurant.rating?.toFixed(1)}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {restaurant.address}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 3 }} />
          <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: 'text.secondary' }}>
            취소
          </Button>
          <Typography variant="h6" fontWeight={700}>
            {isEditMode ? '컬렉션 수정' : '컬렉션 만들기'}
          </Typography>
          <Button variant="contained" onClick={handleSubmit} disabled={saving || !title.trim()}>
            {saving ? <CircularProgress size={20} /> : '저장'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* 커버 이미지 */}
        <Box
          sx={{
            position: 'relative',
            height: 200,
            borderRadius: 3,
            overflow: 'hidden',
            mb: 3,
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px dashed',
            borderColor: 'grey.300',
          }}
          onClick={() => {
            const url = prompt('커버 이미지 URL을 입력하세요:', coverImageUrl);
            if (url !== null) {
              setCoverImageUrl(url);
            }
          }}
        >
          {coverImageUrl ? (
            <>
              <Box
                component="img"
                src={coverImageUrl}
                alt="커버"
                onError={handleImageError}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCoverImageUrl('');
                }}
              >
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography color="text.secondary">커버 이미지 추가</Typography>
            </Box>
          )}
        </Box>

        {/* 제목 */}
        <TextField
          fullWidth
          label="제목"
          placeholder="예: 강남역 점심 맛집 추천"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        {/* 설명 */}
        <TextField
          fullWidth
          label="설명"
          placeholder="컬렉션에 대한 설명을 작성해주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 3 }}
        />

        {/* 공개 설정 */}
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">공개 설정</FormLabel>
          <RadioGroup
            row
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as any)}
          >
            <FormControlLabel value="public" control={<Radio />} label="전체 공개" />
            <FormControlLabel value="private" control={<Radio />} label="나만 보기" />
            <FormControlLabel value="followers_only" control={<Radio />} label="팔로워만" />
          </RadioGroup>
        </FormControl>

        {/* 맛집 목록 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              맛집 목록 ({selectedRestaurants.length})
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setRestaurantDialogOpen(true)}
            >
              맛집 추가
            </Button>
          </Box>

          {selectedRestaurants.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                bgcolor: 'grey.50',
                borderRadius: 3,
                border: '2px dashed',
                borderColor: 'grey.300',
              }}
            >
              <RestaurantIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
              <Typography color="text.secondary">맛집을 추가해주세요</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setRestaurantDialogOpen(true)}
                sx={{ mt: 1 }}
              >
                맛집 추가하기
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {selectedRestaurants.map((restaurant, index) => (
                <Card
                  key={restaurant.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 2,
                  }}
                >
                  <DragIcon sx={{ color: 'grey.400', mr: 1, cursor: 'grab' }} />

                  <Avatar
                    variant="rounded"
                    src={restaurant.thumbnail}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  >
                    <RestaurantIcon />
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {restaurant.name}
                    </Typography>
                    {restaurant.note && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        "{restaurant.note}"
                      </Typography>
                    )}
                  </Box>

                  <Chip
                    label={restaurant.note ? '메모 수정' : '메모 추가'}
                    size="small"
                    onClick={() => {
                      setEditingRestaurantId(restaurant.id);
                      setEditingNote(restaurant.note);
                      setNoteDialogOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  />

                  <IconButton
                    size="small"
                    onClick={() => removeRestaurant(restaurant.id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* 맛집 추가 다이얼로그 */}
        <Dialog
          open={restaurantDialogOpen}
          onClose={() => setRestaurantDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            맛집 추가
            <IconButton
              onClick={() => setRestaurantDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {/* 소스 탭 */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label="검색"
                onClick={() => setSourceTab('search')}
                color={sourceTab === 'search' ? 'primary' : 'default'}
              />
              <Chip
                label="즐겨찾기"
                onClick={() => setSourceTab('favorites')}
                color={sourceTab === 'favorites' ? 'primary' : 'default'}
              />
              <Chip
                label="내 리뷰"
                onClick={() => setSourceTab('reviews')}
                color={sourceTab === 'reviews' ? 'primary' : 'default'}
              />
            </Box>

            {/* 검색바 */}
            {sourceTab === 'search' && (
              <TextField
                fullWidth
                placeholder="맛집 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch} disabled={searchLoading}>
                        {searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}

            {/* 목록 */}
            {renderSourceList()}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => setRestaurantDialogOpen(false)}
              >
                완료 ({selectedRestaurants.length}개 선택)
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* 메모 수정 다이얼로그 */}
        <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>메모 추가</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              placeholder="이 맛집에 대한 메모를 작성해주세요"
              value={editingNote}
              onChange={(e) => setEditingNote(e.target.value)}
              multiline
              rows={3}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setNoteDialogOpen(false)}>취소</Button>
            <Button variant="contained" onClick={saveNote}>
              저장
            </Button>
          </Box>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default CollectionFormPage;
