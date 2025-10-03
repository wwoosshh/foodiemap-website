import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import BannerCarousel from '../BannerCarousel';
import { ApiService } from '../../services/api';
import { Banner } from '../../types';

interface HomeCubeFaceProps {
  onNavigate: (face: string) => void;
}

const HomeCubeFace: React.FC<HomeCubeFaceProps> = ({ onNavigate }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const response = await ApiService.getHomeData();
        if (response.success && response.data) {
          setBanners(response.data.banners || []);
        }
      } catch (error) {
        console.error('홈 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []); // 빈 배열로 한 번만 실행

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        transform: 'translateZ(0)',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* 메인 타이틀 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontFamily: '"Times New Roman", "Noto Serif KR", serif',
            fontWeight: 300,
            color: '#1a1a1a',
            mb: 3,
            letterSpacing: { xs: 4, md: 6 },
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            textTransform: 'uppercase'
          }}
        >
          CUBE
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: '#666',
            fontWeight: 400,
            letterSpacing: 3,
            fontSize: { xs: '0.9rem', md: '1.1rem' },
            textTransform: 'uppercase',
            fontFamily: '"Inter", sans-serif',
            mb: 1
          }}
        >
          Fine Dining Experience
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#999',
            fontWeight: 300,
            letterSpacing: 1,
            fontSize: { xs: '0.75rem', md: '0.9rem' },
            fontStyle: 'italic'
          }}
        >
          Curated Excellence in Every Taste
        </Typography>
      </Box>

      {/* 배너 캐러셀 */}
      {!loading && banners && banners.length > 0 && (
        <Box sx={{ width: '100%', maxWidth: '900px', mx: 'auto' }}>
          <BannerCarousel
            banners={banners}
            height={300}
            autoPlay={true}
            autoPlayInterval={6000}
          />
        </Box>
      )}
    </Box>
  );
};

export default HomeCubeFace;
