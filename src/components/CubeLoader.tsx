import React from 'react';
import { Box, keyframes } from '@mui/material';

const rotateCube = keyframes`
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  25% {
    transform: rotateX(180deg) rotateY(180deg);
  }
  50% {
    transform: rotateX(180deg) rotateY(360deg);
  }
  75% {
    transform: rotateX(360deg) rotateY(360deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(720deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

interface CubeLoaderProps {
  size?: number;
  message?: string;
}

const CubeLoader: React.FC<CubeLoaderProps> = ({ size = 80, message = '로딩 중...' }) => {
  const cubeSize = size;
  const halfSize = cubeSize / 2;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      {/* 3D Cube Container */}
      <Box
        sx={{
          perspective: '800px',
          width: cubeSize,
          height: cubeSize,
        }}
      >
        <Box
          sx={{
            width: cubeSize,
            height: cubeSize,
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: `${rotateCube} 3s infinite ease-in-out`,
          }}
        >
          {/* Front Face */}
          <Box
            sx={{
              position: 'absolute',
              width: cubeSize,
              height: cubeSize,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transform: `translateZ(${halfSize}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: cubeSize / 3,
              fontWeight: 'bold',
              color: 'white',
              animation: `${pulse} 2s infinite ease-in-out`,
            }}
          >
            F
          </Box>

          {/* Back Face */}
          <Box
            sx={{
              position: 'absolute',
              width: cubeSize,
              height: cubeSize,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transform: `translateZ(-${halfSize}px) rotateY(180deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: cubeSize / 3,
              fontWeight: 'bold',
              color: 'white',
              animation: `${pulse} 2s infinite ease-in-out 0.2s`,
            }}
          >
            B
          </Box>

          {/* Right Face */}
          <Box
            sx={{
              position: 'absolute',
              width: cubeSize,
              height: cubeSize,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transform: `rotateY(90deg) translateZ(${halfSize}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: cubeSize / 3,
              fontWeight: 'bold',
              color: 'white',
              animation: `${pulse} 2s infinite ease-in-out 0.4s`,
            }}
          >
            R
          </Box>

          {/* Left Face */}
          <Box
            sx={{
              position: 'absolute',
              width: cubeSize,
              height: cubeSize,
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: cubeSize / 3,
              fontWeight: 'bold',
              color: 'white',
              animation: `${pulse} 2s infinite ease-in-out 0.6s`,
            }}
          >
            L
          </Box>

          {/* Top Face */}
          <Box
            sx={{
              position: 'absolute',
              width: cubeSize,
              height: cubeSize,
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transform: `rotateX(90deg) translateZ(${halfSize}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: cubeSize / 3,
              fontWeight: 'bold',
              color: 'white',
              animation: `${pulse} 2s infinite ease-in-out 0.8s`,
            }}
          >
            T
          </Box>

          {/* Bottom Face */}
          <Box
            sx={{
              position: 'absolute',
              width: cubeSize,
              height: cubeSize,
              background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: cubeSize / 3,
              fontWeight: 'bold',
              color: 'white',
              animation: `${pulse} 2s infinite ease-in-out 1s`,
            }}
          >
            D
          </Box>
        </Box>
      </Box>

      {/* Loading Message */}
      {message && (
        <Box
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'text.secondary',
            animation: `${pulse} 1.5s infinite ease-in-out`,
          }}
        >
          {message}
        </Box>
      )}
    </Box>
  );
};

export default CubeLoader;
