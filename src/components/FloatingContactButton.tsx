import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fab, Tooltip, useTheme, Zoom, useMediaQuery } from '@mui/material';
import { Email } from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';
import { useScrollDirection } from '../hooks/useScrollDirection';

const FloatingContactButton: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isVisible } = useScrollDirection({ threshold: 10, alwaysShowAtTop: false });

  const handleClick = () => {
    navigate('/contact');
  };

  // 모바일에서의 translateY 값 계산
  const getTransformValue = () => {
    if (!isMobile) return 'translateY(0)';
    return isVisible ? 'translateY(0)' : 'translateY(110px)';
  };

  return (
    <Zoom in={true} timeout={500}>
      <Tooltip
        title={t.footer?.contact || '문의하기'}
        placement="left"
        arrow
      >
        <Fab
          color="primary"
          aria-label="contact"
          onClick={handleClick}
          style={{
            transform: getTransformValue(),
          }}
          sx={{
            position: 'fixed',
            bottom: { xs: 110, md: 24 },
            right: { xs: 16, md: 24 },
            zIndex: 1200,
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            backgroundColor: theme.palette.primary.main,
            boxShadow: '0 4px 16px rgba(232, 80, 91, 0.3)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              transform: `${getTransformValue()} scale(1.05)`,
              boxShadow: '0 6px 20px rgba(232, 80, 91, 0.4)',
            },
            '&:active': {
              transform: `${getTransformValue()} scale(0.98)`,
            },
          }}
        >
          <Email sx={{ fontSize: { xs: 22, md: 24 } }} />
        </Fab>
      </Tooltip>
    </Zoom>
  );
};

export default FloatingContactButton;
