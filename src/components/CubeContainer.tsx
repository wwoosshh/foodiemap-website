import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import HomeCubeFace from './cube-faces/HomeCubeFace';
import CategoryCubeFace from './cube-faces/CategoryCubeFace';
import RestaurantListCubeFace from './cube-faces/RestaurantListCubeFace';
import ProfileCubeFace from './cube-faces/ProfileCubeFace';
import EventCubeFace from './cube-faces/EventCubeFace';
import InfoCubeFace from './cube-faces/InfoCubeFace';

type CubeFace = 'home' | 'category' | 'restaurants' | 'profile' | 'event' | 'info';

interface CubeRotation {
  x: number;
  y: number;
}

const faceRotations: Record<CubeFace, CubeRotation> = {
  home: { x: 0, y: 0 },           // 앞면
  category: { x: -90, y: 0 },     // 위
  restaurants: { x: 0, y: 90 },   // 오른쪽
  profile: { x: 0, y: -90 },      // 왼쪽
  event: { x: 90, y: 0 },         // 아래
  info: { x: 0, y: 180 },         // 뒤
};

interface CubeContainerProps {
  currentFace: CubeFace;
  onNavigate: (face: CubeFace) => void;
  selectedCategoryId?: number;
}

const CubeContainer: React.FC<CubeContainerProps> = ({ currentFace, onNavigate, selectedCategoryId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rotation, setRotation] = useState<CubeRotation>({ x: 0, y: 0 });
  const [cubeWidth, setCubeWidth] = useState(window.innerWidth);
  const [cubeHeight, setCubeHeight] = useState(window.innerHeight - 64);

  // 화면 크기에 따라 큐브 크기 조정 (화면 전체를 채움)
  useEffect(() => {
    const updateSize = () => {
      setCubeWidth(window.innerWidth);
      setCubeHeight(window.innerHeight - 64); // AppBar 높이 제외
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 현재 면에 따라 회전 업데이트
  useEffect(() => {
    setRotation(faceRotations[currentFace]);
  }, [currentFace]);

  const handleNavigate = (face: string, categoryId?: number) => {
    onNavigate(face as CubeFace);
  };

  // 큐브 깊이는 화면 높이의 절반으로 설정 (3D 효과용)
  const cubeDepth = cubeHeight / 2;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        perspective: isMobile ? '1000px' : '1500px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* 3D 큐브 */}
      <Box
        sx={{
          position: 'absolute',
          width: `${cubeWidth}px`,
          height: `${cubeHeight}px`,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* 앞면 - 홈 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            backfaceVisibility: 'hidden',
            transform: `translateZ(${cubeDepth}px)`,
            overflow: 'hidden',
          }}
        >
          <HomeCubeFace onNavigate={handleNavigate} />
        </Box>

        {/* 위 - 카테고리 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            backfaceVisibility: 'hidden',
            transform: `rotateX(90deg) translateZ(${cubeDepth}px)`,
            overflow: 'hidden',
          }}
        >
          <CategoryCubeFace onNavigate={handleNavigate} />
        </Box>

        {/* 오른쪽 - 맛집 목록 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            backfaceVisibility: 'hidden',
            transform: `rotateY(90deg) translateZ(${cubeDepth}px)`,
            overflow: 'hidden',
          }}
        >
          <RestaurantListCubeFace initialCategoryId={selectedCategoryId} />
        </Box>

        {/* 왼쪽 - 프로필 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            backfaceVisibility: 'hidden',
            transform: `rotateY(-90deg) translateZ(${cubeDepth}px)`,
            overflow: 'hidden',
          }}
        >
          <ProfileCubeFace onNavigate={handleNavigate} />
        </Box>

        {/* 아래 - 이벤트 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            backfaceVisibility: 'hidden',
            transform: `rotateX(-90deg) translateZ(${cubeDepth}px)`,
            overflow: 'hidden',
          }}
        >
          <EventCubeFace onNavigate={handleNavigate} />
        </Box>

        {/* 뒤 - 정보 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            backfaceVisibility: 'hidden',
            transform: `rotateY(180deg) translateZ(${cubeDepth}px)`,
            overflow: 'hidden',
          }}
        >
          <InfoCubeFace onNavigate={handleNavigate} />
        </Box>
      </Box>
    </Box>
  );
};

export default CubeContainer;
