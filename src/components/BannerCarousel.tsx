import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Card,
  CardMedia,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ChevronLeft, ChevronRight, OpenInNew } from '@mui/icons-material';
import { Banner } from '../types';
import { DEFAULT_BANNER_IMAGE, handleImageError } from '../constants/images';

interface BannerCarouselProps {
  banners: Banner[];
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  height = 300, // 기본값 (사용되지 않음)
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 터치 스와이프 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 활성화된 배너만 필터링
  const activeBanners = banners.filter(banner => banner.is_active);

  // 반응형 배너 높이 (모바일: 4:3 비율, PC: 16:9 비율)
  const bannerHeight = isMobile ? 220 : 360;

  // 자동 재생 기능
  useEffect(() => {
    if (isAutoPlaying && activeBanners.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % activeBanners.length);
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, activeBanners.length, autoPlayInterval]);

  const handlePrevious = () => {
    setCurrentIndex(prev =>
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.link_url) {
      window.open(banner.link_url, '_blank');
    }
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(autoPlay);
  };

  // 터치 스와이프 핸들러
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsAutoPlaying(autoPlay);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }

    setIsAutoPlaying(autoPlay);
  };

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: bannerHeight,
        borderRadius: { xs: 0, md: 2 },
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={!isMobile ? handleMouseEnter : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 배너 컨테이너 */}
      <Box
        sx={{
          display: 'flex',
          width: `${activeBanners.length * 100}%`,
          height: '100%',
          transform: `translateX(-${currentIndex * (100 / activeBanners.length)}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {activeBanners.map((banner, index) => {
          // 현재 배너와 인접한 배너만 이미지 로드 (성능 최적화)
          const shouldLoadImage = Math.abs(index - currentIndex) <= 1;

          return (
            <Card
              key={banner.id}
              sx={{
                width: `${100 / activeBanners.length}%`,
                height: '100%',
                position: 'relative',
                cursor: banner.link_url ? 'pointer' : 'default',
                borderRadius: 0,
                ...(!isMobile && {
                  '&:hover': {
                    '& .banner-overlay': {
                      opacity: banner.link_url ? 0.3 : 0,
                    },
                    '& .banner-content': {
                      transform: 'translateY(-10px)',
                    },
                  },
                }),
              }}
              onClick={() => handleBannerClick(banner)}
            >
              {shouldLoadImage ? (
                <CardMedia
                  component="img"
                  height={bannerHeight}
                  image={banner.image_url || DEFAULT_BANNER_IMAGE}
                  alt={banner.title}
                  loading="lazy"
                  sx={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                  onError={(e) => handleImageError(e, DEFAULT_BANNER_IMAGE)}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f5f5f5',
                  }}
                />
              )}

            {/* 오버레이 */}
            <Box
              className="banner-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            />

            {/* 배너 콘텐츠 */}
            <Box
              className="banner-content"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 3, md: 4 },
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                color: 'white',
                transition: 'transform 0.3s ease',
              }}
            >
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                component="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {banner.title}
                {banner.link_url && (
                  <OpenInNew
                    sx={{
                      ml: 1,
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      verticalAlign: 'text-top'
                    }}
                  />
                )}
              </Typography>
              {banner.description && (
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {banner.description}
                </Typography>
              )}
            </Box>
          </Card>
          );
        })}
      </Box>

      {/* 네비게이션 화살표 */}
      {activeBanners.length > 1 && !isMobile && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(30,30,30,0.9)'
                : 'rgba(255,255,255,0.9)',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(30,30,30,1)'
                  : 'rgba(255,255,255,1)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.2s ease',
              zIndex: 2,
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(30,30,30,0.9)'
                : 'rgba(255,255,255,0.9)',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(30,30,30,1)'
                  : 'rgba(255,255,255,1)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.2s ease',
              zIndex: 2,
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}

      {/* 인디케이터 도트 */}
      {activeBanners.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2,
          }}
        >
          {activeBanners.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: (theme) => currentIndex === index
                  ? theme.palette.mode === 'dark'
                    ? 'rgba(30,30,30,0.9)'
                    : 'rgba(255,255,255,0.9)'
                  : theme.palette.mode === 'dark'
                    ? 'rgba(30,30,30,0.4)'
                    : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(30,30,30,0.7)'
                    : 'rgba(255,255,255,0.7)',
                  transform: 'scale(1.2)',
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BannerCarousel;