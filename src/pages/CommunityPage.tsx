import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Visibility as VisibilityIcon,
  ChevronLeft,
  ChevronRight,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_RESTAURANT_IMAGE, handleImageError } from '../constants/images';

interface Collection {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  type: string;
  item_count: number;
  like_count: number;
  save_count: number;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
  };
  preview_images?: string[];
  is_liked?: boolean;
  is_saved?: boolean;
}

interface CollectionCardProps {
  collection: Collection;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onClick: (id: string) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onLike, onSave, onClick }) => {
  const theme = useTheme();

  // 이미지 그리드를 위한 이미지 배열 (4칸 채우기)
  const getGridImages = () => {
    const images = collection.preview_images || [];
    if (images.length === 0) return [];
    if (images.length >= 4) return images.slice(0, 4);
    // 이미지가 4개 미만이면 있는 이미지를 반복해서 4칸 채우기
    const result = [...images];
    while (result.length < 4) {
      result.push(images[result.length % images.length]);
    }
    return result;
  };

  const gridImages = getGridImages();

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        bgcolor: 'background.paper',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
      onClick={() => onClick(collection.id)}
    >
      {/* 커버 이미지 또는 프리뷰 그리드 */}
      <Box sx={{ position: 'relative', height: 180, bgcolor: 'action.hover', overflow: 'hidden' }}>
        {collection.cover_image_url ? (
          <CardMedia
            component="img"
            image={collection.cover_image_url}
            alt={collection.title}
            onError={handleImageError}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : gridImages.length > 0 ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: '2px',
            }}
          >
            {gridImages.map((img, idx) => (
              <Box
                key={idx}
                component="img"
                src={img}
                alt=""
                onError={handleImageError}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ))}
          </Box>
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
            <RestaurantIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          </Box>
        )}

        {/* 맛집 수 배지 */}
        <Chip
          label={`${collection.item_count}개 맛집`}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '0.75rem',
          }}
        />
      </Box>

      <CardContent sx={{ p: 2 }}>
        {/* 제목 */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 0.5,
          }}
        >
          {collection.title}
        </Typography>

        {/* 설명 */}
        {collection.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1.5,
              minHeight: 40,
            }}
          >
            {collection.description}
          </Typography>
        )}

        {/* 사용자 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar
            src={collection.user?.avatar_url}
            alt={collection.user?.name}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {collection.user?.name}
          </Typography>
        </Box>

        {/* 좋아요, 저장, 조회수 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              onLike(collection.id);
            }}
          >
            {collection.is_liked ? (
              <FavoriteIcon sx={{ fontSize: 18, color: 'error.main' }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            )}
            <Typography variant="caption" color="text.secondary">
              {collection.like_count}
            </Typography>
          </Box>

          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              onSave(collection.id);
            }}
          >
            {collection.is_saved ? (
              <BookmarkIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            ) : (
              <BookmarkBorderIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            )}
            <Typography variant="caption" color="text.secondary">
              {collection.save_count}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {collection.view_count >= 1000
                ? `${(collection.view_count / 1000).toFixed(1)}k`
                : collection.view_count}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// 추천 컬렉션 카드 (가로 스크롤용)
const FeaturedCollectionCard: React.FC<{ collection: Collection; onClick: (id: string) => void }> = ({
  collection,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        minWidth: 200,
        maxWidth: 200,
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
        bgcolor: 'background.paper',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={() => onClick(collection.id)}
    >
      <Box sx={{ position: 'relative', paddingTop: '100%', bgcolor: 'action.hover' }}>
        {collection.cover_image_url ? (
          <CardMedia
            component="img"
            image={collection.cover_image_url}
            alt={collection.title}
            onError={handleImageError}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <RestaurantIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
          </Box>
        )}
      </Box>
      <CardContent sx={{ p: 1.5 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {collection.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            @{collection.user?.name}
          </Typography>
          <Box sx={{ mx: 0.5, color: 'text.secondary' }}>·</Box>
          <FavoriteIcon sx={{ fontSize: 12, color: 'error.main', mr: 0.3 }} />
          <Typography variant="caption" color="text.secondary">
            {collection.like_count}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortTab, setSortTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const sortOptions = ['popular', 'recent', 'most_saved'] as const;

  // 추천 컬렉션 로드
  const loadFeaturedCollections = useCallback(async () => {
    try {
      const response = await ApiService.getFeaturedCollections();
      if (response.success) {
        setFeaturedCollections(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load featured collections:', err);
    }
  }, []);

  // 컬렉션 목록 로드
  const loadCollections = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await ApiService.getCollections({
          sort: sortOptions[sortTab],
          page: pageNum,
          limit: 12,
        });

        if (response.success && response.data) {
          const newCollections = response.data.collections || [];

          if (reset) {
            setCollections(newCollections);
          } else {
            setCollections((prev) => [...prev, ...newCollections]);
          }

          setHasMore(pageNum < response.data.pagination.total_pages);
          setPage(pageNum);
        }
      } catch (err: any) {
        setError(err.userMessage || '컬렉션을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sortTab]
  );

  // 초기 로드
  useEffect(() => {
    loadFeaturedCollections();
    loadCollections(1, true);
  }, [loadFeaturedCollections, loadCollections]);

  // 정렬 변경 시 다시 로드
  useEffect(() => {
    loadCollections(1, true);
  }, [sortTab]);

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadCollections(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, loadCollections]);

  // 좋아요 토글
  const handleLike = async (collectionId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await ApiService.toggleCollectionLike(collectionId);
      if (response.success && response.data) {
        const isLiked = response.data.is_liked;
        setCollections((prev) =>
          prev.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  is_liked: isLiked,
                  like_count: isLiked ? c.like_count + 1 : c.like_count - 1,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  // 저장 토글
  const handleSave = async (collectionId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await ApiService.toggleCollectionSave(collectionId);
      if (response.success && response.data) {
        const isSaved = response.data.is_saved;
        setCollections((prev) =>
          prev.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  is_saved: isSaved,
                  save_count: isSaved ? c.save_count + 1 : c.save_count - 1,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  // 컬렉션 클릭
  const handleCollectionClick = (id: string) => {
    navigate(`/community/collections/${id}`);
  };

  // 컬렉션 만들기
  const handleCreateCollection = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    navigate('/community/collections/new');
  };

  // 추천 컬렉션 스크롤
  const scrollFeatured = (direction: 'left' | 'right') => {
    if (featuredScrollRef.current) {
      const scrollAmount = 220;
      featuredScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* 헤더: 검색 + 컬렉션 만들기 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 4,
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <TextField
            fullWidth
            placeholder="컬렉션 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'background.paper',
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCollection}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              whiteSpace: 'nowrap',
              minWidth: isMobile ? '100%' : 'auto',
            }}
          >
            컬렉션 만들기
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 추천 컬렉션 */}
        {featuredCollections.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                추천 컬렉션
              </Typography>
              <Box>
                <IconButton size="small" onClick={() => scrollFeatured('left')}>
                  <ChevronLeft />
                </IconButton>
                <IconButton size="small" onClick={() => scrollFeatured('right')}>
                  <ChevronRight />
                </IconButton>
              </Box>
            </Box>
            <Box
              ref={featuredScrollRef}
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              {featuredCollections.map((collection) => (
                <FeaturedCollectionCard
                  key={collection.id}
                  collection={collection}
                  onClick={handleCollectionClick}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 인기 컬렉션 */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              인기 컬렉션
            </Typography>
          </Box>

          {/* 정렬 탭 */}
          <Tabs
            value={sortTab}
            onChange={(_, newValue) => setSortTab(newValue)}
            sx={{ mb: 3 }}
            TabIndicatorProps={{ style: { display: 'none' } }}
          >
            <Tab
              label="인기순"
              sx={{
                borderRadius: 2,
                mr: 1,
                minHeight: 36,
                bgcolor: sortTab === 0 ? 'primary.main' : 'action.hover',
                color: sortTab === 0 ? 'white' : 'text.primary',
                '&.Mui-selected': { color: 'white' },
              }}
            />
            <Tab
              label="최신순"
              sx={{
                borderRadius: 2,
                mr: 1,
                minHeight: 36,
                bgcolor: sortTab === 1 ? 'primary.main' : 'action.hover',
                color: sortTab === 1 ? 'white' : 'text.primary',
                '&.Mui-selected': { color: 'white' },
              }}
            />
            <Tab
              label="저장순"
              sx={{
                borderRadius: 2,
                minHeight: 36,
                bgcolor: sortTab === 2 ? 'primary.main' : 'action.hover',
                color: sortTab === 2 ? 'white' : 'text.primary',
                '&.Mui-selected': { color: 'white' },
              }}
            />
          </Tabs>

          {/* 컬렉션 그리드 */}
          {loading ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} variant="rectangular" height={280} sx={{ borderRadius: 3 }} />
              ))}
            </Box>
          ) : collections.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: 'action.hover',
                borderRadius: 3,
              }}
            >
              <RestaurantIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                아직 컬렉션이 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                나만의 맛집 컬렉션을 만들어보세요!
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateCollection}>
                첫 컬렉션 만들기
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onLike={handleLike}
                  onSave={handleSave}
                  onClick={handleCollectionClick}
                />
              ))}
            </Box>
          )}

          {/* 더 보기 로딩 */}
          <Box ref={loadMoreRef} sx={{ py: 4, textAlign: 'center' }}>
            {loadingMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      animation: 'pulse 1s infinite',
                      animationDelay: `${i * 0.2}s`,
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.3 },
                        '50%': { opacity: 1 },
                      },
                    }}
                  />
                ))}
              </Box>
            )}
            {!hasMore && collections.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                모든 컬렉션을 불러왔습니다
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default CommunityPage;
