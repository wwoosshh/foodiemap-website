import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fab, Tooltip, useTheme, alpha, Zoom, useMediaQuery } from '@mui/material';
import { Email } from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';
import { useScrollDirection } from '../hooks/useScrollDirection';

const FloatingContactButton: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isVisible } = useScrollDirection({ threshold: 10, alwaysShowAtTop: false });

  // 디버깅용 로그
  useEffect(() => {
    console.log('FloatingContactButton - isMobile:', isMobile, 'isVisible:', isVisible);
  }, [isMobile, isVisible]);

  const handleClick = () => {
    navigate('/contact');
  };

  // 모바일에서의 translateY 값 계산
  const getTransformValue = () => {
    if (!isMobile) return 'translateY(0)';
    return isVisible ? 'translateY(0)' : 'translateY(110px)';
  };

  const getHoverTransform = () => {
    if (!isMobile) return 'scale(1.1) translateY(-2px)';
    return isVisible ? 'scale(1.1) translateY(-2px)' : 'scale(1.1) translateY(108px)';
  };

  const getActiveTransform = () => {
    if (!isMobile) return 'scale(1.05) translateY(0)';
    return isVisible ? 'scale(1.05) translateY(0)' : 'scale(1.05) translateY(110px)';
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
          sx={{
            position: 'fixed',
            bottom: { xs: 130, md: 24 },
            right: { xs: 20, md: 24 },
            zIndex: 1200,
            width: { xs: 56, md: 64 },
            height: { xs: 56, md: 64 },
            transform: getTransformValue(),
            backgroundColor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.9)
              : theme.palette.primary.main,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: theme.palette.mode === 'dark'
              ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}, 0 0 0 1px ${alpha('#FFFFFF', 0.1)} inset`
              : `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, box-shadow 0.3s',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
              transform: getHoverTransform(),
              boxShadow: theme.palette.mode === 'dark'
                ? `0 12px 32px ${alpha(theme.palette.primary.main, 0.5)}, 0 0 0 1px ${alpha('#FFFFFF', 0.15)} inset`
                : `0 12px 32px ${alpha(theme.palette.primary.main, 0.45)}`,
            },
            '&:active': {
              transform: getActiveTransform(),
            },
            // 애니메이션 효과
            '@keyframes pulse': {
              '0%': {
                boxShadow: theme.palette.mode === 'dark'
                  ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`
                  : `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
              },
              '50%': {
                boxShadow: theme.palette.mode === 'dark'
                  ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.6)}`
                  : `0 8px 32px ${alpha(theme.palette.primary.main, 0.5)}`,
              },
              '100%': {
                boxShadow: theme.palette.mode === 'dark'
                  ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`
                  : `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
              },
            },
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          <Email sx={{ fontSize: { xs: 24, md: 28 } }} />
        </Fab>
      </Tooltip>
    </Zoom>
  );
};

export default FloatingContactButton;
