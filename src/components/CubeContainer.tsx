import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
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
  category: { x: -90, y: 0 },     // 위 - 큐브를 X축으로 -90도 회전
  restaurants: { x: 0, y: -90 },  // 오른쪽 - 큐브를 Y축으로 -90도 회전 (수정)
  profile: { x: 0, y: 90 },       // 왼쪽 - 큐브를 Y축으로 +90도 회전 (수정)
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

  // 현재 면에 따라 회전 업데이트
  useEffect(() => {
    setRotation(faceRotations[currentFace]);
  }, [currentFace]);

  const handleNavigate = (face: string, categoryId?: number) => {
    onNavigate(face as CubeFace);
  };

  // 큐브 깊이를 화면 크기에 비례하게 설정
  // 화면의 큰 쪽 기준으로 깊이를 설정하여 회전 시 면들이 겹치지 않도록
  const cubeDepth = Math.max(cubeWidth, cubeHeight) / 2;
  // perspective는 큐브 깊이의 3배로 설정하여 왜곡 최소화
  const perspectiveValue = cubeDepth * 3;

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
          willChange: 'transform',
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
          }}
        >
          <InfoCubeFace onNavigate={handleNavigate} />
        </Box>
      </Box>
    </Box>
  );
};

export default CubeContainer;
