import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, CardActionArea, CircularProgress } from '@mui/material';
import { Category as CategoryIcon } from '@mui/icons-material';
import { ApiService } from '../../services/api';

interface CategoryCubeFaceProps {
  onNavigate: (face: string, categoryId?: number) => void;
}

const CategoryCubeFace: React.FC<CategoryCubeFaceProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await ApiService.getPublicCategories();
        if (response.success && response.data) {
          setCategories(response.data.categories || []);
        }
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    onNavigate('restaurants', categoryId);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 헤더 */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <CategoryIcon sx={{ fontSize: 40, mr: 1, color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            카테고리
          </Typography>
          <Typography variant="body1" color="text.secondary">
            원하는 카테고리를 선택하면 해당 맛집 목록으로 이동합니다
          </Typography>
        </Box>

        {/* 카테고리 그리드 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {categories.map((category) => (
              <Card
                key={category.id}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleCategoryClick(category.id)}
                  sx={{
                    height: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  <CardContent sx={{ textAlign: 'center', p: 0 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {category.name}
                    </Typography>
                    {category.description && (
                      <Typography variant="caption" color="text.secondary">
                        {category.description}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}

        {/* 전체 보기 카드 */}
        {!loading && categories.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Card
              sx={{
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                onClick={() => onNavigate('restaurants')}
                sx={{
                  py: 3,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" color="primary" fontWeight={600}>
                  전체 맛집 보기
                </Typography>
              </CardActionArea>
            </Card>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CategoryCubeFace;
