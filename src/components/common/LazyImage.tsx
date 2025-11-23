import React, { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mui/material';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: string | number;
  fallbackSrc?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Lazy Loading 이미지 컴포넌트
 * - Intersection Observer API 사용
 * - 이미지가 뷰포트에 들어올 때만 로드
 * - 로딩 중 Skeleton 표시
 * - 이미지 로드 실패 시 fallback 이미지 표시
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = '100%',
  height = '100%',
  className,
  objectFit = 'cover',
  borderRadius = 0,
  fallbackSrc = '/placeholder-image.png',
  onClick,
  style
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // 50px 전에 미리 로드 시작
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        borderRadius,
        overflow: 'hidden',
        ...style
      }}
      onClick={onClick}
      className={className}
    >
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius
          }}
        />
      )}

      <img
        ref={imgRef}
        src={isInView ? (error ? fallbackSrc : src) : undefined}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: isLoaded ? 'block' : 'none',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 1 : 0
        }}
      />
    </Box>
  );
};

export default LazyImage;
