import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Badge,
  alpha,
  useTheme,
} from '@mui/material';
import {
  RestaurantIcon,
  GiftIcon,
  UserIcon,
  HomeIcon,
  CommunityIcon,
} from './icons/CustomIcons';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useScrollDirection } from '../hooks/useScrollDirection';

interface MobileBottomNavProps {
  onLoginClick?: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isVisible } = useScrollDirection({ threshold: 10, alwaysShowAtTop: false });

  // 현재 경로에 따라 선택된 네비게이션 항목 결정
  const getCurrentValue = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.startsWith('/restaurants')) return 1;
    if (path.startsWith('/events')) return 2;
    if (path.startsWith('/community')) return 3;
    if (path.startsWith('/profile')) return 4;
    return 0;
  };

  const handleNavigation = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/restaurants');
        break;
      case 2:
        navigate('/events');
        break;
      case 3:
        navigate('/community');
        break;
      case 4:
        if (user) {
          navigate('/profile');
        } else {
          onLoginClick?.();
        }
        break;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: isVisible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(150%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1100,
        // 하단 Safe Area 처리 (iOS 등)
        mb: 'calc(env(safe-area-inset-bottom) / 2)',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          borderRadius: '50px',
          backgroundColor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.85)
            : alpha('#FFFFFF', 0.92),
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: theme.palette.mode === 'dark'
            ? `1px solid ${alpha('#FFFFFF', 0.1)}`
            : `1px solid ${alpha('#000000', 0.08)}`,
          boxShadow: theme.palette.mode === 'dark'
            ? `0 8px 32px ${alpha('#000000', 0.6)}, 0 0 0 1px ${alpha('#FFFFFF', 0.1)} inset`
            : `0 8px 32px ${alpha('#000000', 0.12)}, 0 0 0 1px ${alpha('#000000', 0.04)} inset`,
          width: 'calc(100vw - 32px)',
          maxWidth: '600px',
          mx: 'auto',
        }}
      >
        <BottomNavigation
          value={getCurrentValue()}
          onChange={handleNavigation}
          showLabels
          sx={{
            backgroundColor: 'transparent',
            height: 68,
            px: 1,
            py: 1,
            borderRadius: '50px',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '8px 6px',
              gap: '3px',
              borderRadius: '16px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                '& .MuiBottomNavigationAction-label': {
                  fontWeight: 700,
                  fontSize: '0.7rem',
                },
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.15)',
                  filter: theme.palette.mode === 'dark'
                    ? 'drop-shadow(0 2px 8px rgba(255, 107, 107, 0.5))'
                    : 'drop-shadow(0 2px 8px rgba(255, 107, 107, 0.4))',
                },
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.65rem',
                fontWeight: 500,
                opacity: 1,
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap',
              },
              '& .MuiSvgIcon-root': {
                fontSize: 22,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              },
            },
          }}
        >
          <BottomNavigationAction
            label={t.nav.home}
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label={t.nav.restaurantSearch}
            icon={<RestaurantIcon />}
          />
          <BottomNavigationAction
            label={t.nav.events}
            icon={
              <Badge badgeContent={0} color="error" max={9}>
                <GiftIcon />
              </Badge>
            }
          />
          <BottomNavigationAction
            label={t.nav.community}
            icon={<CommunityIcon />}
          />
          <BottomNavigationAction
            label={user ? t.nav.myProfile : t.nav.login}
            icon={<UserIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MobileBottomNav;
