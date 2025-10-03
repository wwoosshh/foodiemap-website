import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, CardActionArea, CircularProgress } from '@mui/material';
import { ApiService } from '../../services/api';

interface CategoryCubeFaceProps {
  onNavigate: (face: string, categoryId?: number) => void;
}

const CategoryCubeFace: React.FC<CategoryCubeFaceProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const response = await ApiService.getPublicCategories();
        if (response.success && response.data && isMounted) {
          setCategories(response.data.categories || []);
        }
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []); // 빈 배열로 한 번만 실행

  const handleCategoryClick = (categoryId: number) => {
    onNavigate('restaurants', categoryId);
  };

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
        {/* 헤더 */}
        <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 300,
              letterSpacing: 4,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              color: '#1a1a1a',
              mb: 1,
              textTransform: 'uppercase',
              fontFamily: '"Times New Roman", serif'
            }}
          >
            Categories
          </Typography>
          <Box sx={{ width: 40, height: 1, backgroundColor: '#000', mx: 'auto', mb: 2 }} />
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: { xs: '0.85rem', md: '0.95rem' },
              letterSpacing: 0.5
            }}
          >
            Select a category to explore restaurants
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
                lg: 'repeat(5, 1fr)',
              },
              gap: 2,
            }}
          >
            {categories.map((category) => (
              <Card
                key={category.id}
                sx={{
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#fafafa',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderColor: '#1a1a1a',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleCategoryClick(category.id)}
                  sx={{
                    height: { xs: 100, md: 120 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 1.5,
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: '#1a1a1a',
                        letterSpacing: 0.5
                      }}
                    >
                      {category.name}
                    </Typography>
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
                borderRadius: 0,
                border: '1px solid #1a1a1a',
                boxShadow: 'none',
                transition: 'all 0.2s',
                backgroundColor: '#1a1a1a',
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              <CardActionArea
                onClick={() => onNavigate('restaurants')}
                sx={{
                  py: 2,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: '#fff',
                    fontWeight: 500,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    fontSize: '0.9rem'
                  }}
                >
                  View All Restaurants
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
