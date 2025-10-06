import React from 'react';
import { Box, Fade } from '@mui/material';
import CubeLoader from './CubeLoader';

interface FullPageLoaderProps {
  message?: string;
  show: boolean;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ message, show }) => {
  if (!show) return null;

  return (
    <Fade in={show} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
        }}
      >
        <CubeLoader size={100} message={message} />
      </Box>
    </Fade>
  );
};

export default FullPageLoader;
