import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';

// Code Splitting: 각 큐브 면을 동적으로 로드
const HomeCubeFace = lazy(() => import('./cube-faces/HomeCubeFace'));
const CategoryCubeFace = lazy(() => import('./cube-faces/CategoryCubeFace'));
const RestaurantListCubeFace = lazy(() => import('./cube-faces/RestaurantListCubeFace'));
const ProfileCubeFace = lazy(() => import('./cube-faces/ProfileCubeFace'));
const EventCubeFace = lazy(() => import('./cube-faces/EventCubeFace'));
const InfoCubeFace = lazy(() => import('./cube-faces/InfoCubeFace'));

type CubeFace = 'home' | 'category' | 'restaurants' | 'profile' | 'event' | 'info';

interface CubeRotation {
  x: number;
  y: number;
}

const faceRotations: Record<CubeFace, CubeRotation> = {
  home: { x: 0, y: 0 },           // 앞면
  category: { x: -90, y: 0 },     // 위 - 큐브를 X축으로 -90도 회전
  restaurants: { x: 0, y: -90 },  // 오른쪽 - 큐브를 Y축으로 -90도 회전
  profile: { x: 0, y: 90 },       // 왼쪽 - 큐브를 Y축으로 90도 회전
  event: { x: 90, y: 0 },         // 아래 - 큐브를 X축으로 +90도 회전
  info: { x: 0, y: 180 },         // 뒤 - 큐브를 Y축으로 180도 회전
};

interface CubeContainerProps {
  currentFace: CubeFace;
  onNavigate: (face: CubeFace) => void;
  selectedCategoryId?: number;
}

const CubeContainer: React.FC<CubeContainerProps> = ({ currentFace, onNavigate, selectedCategoryId }) => {
  const [rotation, setRotation] = useState<CubeRotation>({ x: 0, y: 0 });
  const [cubeWidth, setCubeWidth] = useState(window.innerWidth);
  const [cubeHeight, setCubeHeight] = useState(window.innerHeight - 64);
  const [isRotating, setIsRotating] = useState(false);

  // 각 face가 현재 보이는지 확인하는 함수
  const isFaceVisible = (face: CubeFace): boolean => {
    return face === currentFace;
  };

  // 현재 면과 인접한 면들을 반환하는 함수
  const getAdjacentFaces = (face: CubeFace): CubeFace[] => {
    const adjacencyMap: Record<CubeFace, CubeFace[]> = {
      home: ['category', 'restaurants', 'profile', 'event'],
      category: ['home', 'restaurants', 'profile', 'info'],
      restaurants: ['home', 'category', 'event', 'info'],
      profile: ['home', 'category', 'event', 'info'],
      event: ['home', 'restaurants', 'profile', 'info'],
      info: ['category', 'restaurants', 'profile', 'event'],
    };
    return adjacencyMap[face] || [];
  };

  // 렌더링 여부 결정 (현재 면 + 인접 면만 렌더링)
  const shouldRenderFace = (face: CubeFace): boolean => {
    return face === currentFace || getAdjacentFaces(currentFace).includes(face);
  };

  // 화면 크기에 따라 큐브 크기 조정
  useEffect(() => {
    const updateSize = () => {
      setCubeWidth(window.innerWidth);
      setCubeHeight(window.innerHeight - 64); // AppBar 높이 제외
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 최단 거리로 회전하도록 각도 계산
  const calculateShortestRotation = (from: CubeRotation, to: CubeRotation): CubeRotation => {
    const calculateShortestAngle = (fromAngle: number, toAngle: number): number => {
      let delta = toAngle - fromAngle;

      // 차이가 180도를 넘으면 반대 방향이 더 짧음
      while (delta > 180) delta -= 360;
      while (delta < -180) delta += 360;

      return fromAngle + delta;
    };

    return {
      x: calculateShortestAngle(from.x, to.x),
      y: calculateShortestAngle(from.y, to.y),
    };
  };

  // 큐브 깊이를 화면 크기에 비례하게 설정 (useMemo로 최적화)
  const cubeDepth = useMemo(() => Math.max(cubeWidth, cubeHeight) / 2, [cubeWidth, cubeHeight]);

  // perspective는 큐브 깊이의 3배로 설정하여 왜곡 최소화 (useMemo로 최적화)
  const perspectiveValue = useMemo(() => cubeDepth * 3, [cubeDepth]);

  // 현재 면에 따라 회전 업데이트 (최단 경로)
  useEffect(() => {
    const targetRotation = faceRotations[currentFace];
    setIsRotating(true);
    setRotation(prev => calculateShortestRotation(prev, targetRotation));

    // 회전 애니메이션 완료 후 isRotating false로 설정 (1초 후)
    const timer = setTimeout(() => {
      setIsRotating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentFace]);

  const handleNavigate = (face: string, categoryId?: number) => {
    onNavigate(face as CubeFace);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        perspective: `${perspectiveValue}px`,
        perspectiveOrigin: 'center center',
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
          // 큐브를 뒤로 밀어서 (translateZ -cubeDepth) 줌 효과 제거
          transform: `translate(-50%, -50%) translateZ(-${cubeDepth}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
          // 회전 중에만 willChange 적용하여 GPU 메모리 최적화
          ...(isRotating && { willChange: 'transform' }),
        }}
      >
        {/* 앞면 - 홈 */}
        {shouldRenderFace('home') && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              backfaceVisibility: 'hidden',
              transform: `translateZ(${cubeDepth}px)`,
              border: '2px solid #e0e0e0',
              boxSizing: 'border-box',
              pointerEvents: isFaceVisible('home') ? 'auto' : 'none',
            }}
          >
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>}>
              <HomeCubeFace onNavigate={handleNavigate} />
            </Suspense>
          </Box>
        )}

        {/* 위 - 카테고리 */}
        {shouldRenderFace('category') && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              backfaceVisibility: 'hidden',
              transform: `rotateX(90deg) translateZ(${cubeDepth}px)`,
              border: '2px solid #e0e0e0',
              boxSizing: 'border-box',
              pointerEvents: isFaceVisible('category') ? 'auto' : 'none',
            }}
          >
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>}>
              <CategoryCubeFace onNavigate={handleNavigate} />
            </Suspense>
          </Box>
        )}

        {/* 오른쪽 - 맛집 목록 */}
        {shouldRenderFace('restaurants') && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              backfaceVisibility: 'hidden',
              transform: `rotateY(90deg) translateZ(${cubeDepth}px)`,
              border: '2px solid #e0e0e0',
              boxSizing: 'border-box',
              pointerEvents: isFaceVisible('restaurants') ? 'auto' : 'none',
            }}
          >
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>}>
              <RestaurantListCubeFace initialCategoryId={selectedCategoryId} />
            </Suspense>
          </Box>
        )}

        {/* 왼쪽 - 프로필 */}
        {shouldRenderFace('profile') && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              backfaceVisibility: 'hidden',
              transform: `rotateY(-90deg) translateZ(${cubeDepth}px)`,
              border: '2px solid #e0e0e0',
              boxSizing: 'border-box',
              pointerEvents: isFaceVisible('profile') ? 'auto' : 'none',
            }}
          >
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>}>
              <ProfileCubeFace onNavigate={handleNavigate} />
            </Suspense>
          </Box>
        )}

        {/* 아래 - 이벤트 */}
        {shouldRenderFace('event') && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              backfaceVisibility: 'hidden',
              transform: `rotateX(-90deg) translateZ(${cubeDepth}px)`,
              border: '2px solid #e0e0e0',
              boxSizing: 'border-box',
              pointerEvents: isFaceVisible('event') ? 'auto' : 'none',
            }}
          >
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>}>
              <EventCubeFace onNavigate={handleNavigate} />
            </Suspense>
          </Box>
        )}

        {/* 뒤 - 정보 */}
        {shouldRenderFace('info') && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              backfaceVisibility: 'hidden',
              transform: `rotateY(180deg) translateZ(${cubeDepth}px)`,
              border: '2px solid #e0e0e0',
              boxSizing: 'border-box',
              pointerEvents: isFaceVisible('info') ? 'auto' : 'none',
            }}
          >
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>}>
              <InfoCubeFace onNavigate={handleNavigate} />
            </Suspense>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CubeContainer;
