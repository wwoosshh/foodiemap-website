import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Badge,
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
        elevation={0}
        sx={{
          borderRadius: '24px',
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(20, 20, 20, 0.95)'
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 24px rgba(0, 0, 0, 0.4)'
            : '0 4px 24px rgba(0, 0, 0, 0.08)',
          width: 'calc(100vw - 32px)',
          maxWidth: '420px',
          mx: 'auto',
        }}
      >
        <BottomNavigation
          value={getCurrentValue()}
          onChange={handleNavigation}
          showLabels
          sx={{
            backgroundColor: 'transparent',
            height: 60,
            px: 0.5,
            borderRadius: '24px',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 4px',
              gap: '2px',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                '& .MuiBottomNavigationAction-label': {
                  fontWeight: 600,
                  fontSize: '0.65rem',
                },
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.05)',
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.6rem',
                fontWeight: 500,
                opacity: 1,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                marginTop: '2px',
              },
              '& .MuiSvgIcon-root': {
                fontSize: 22,
                transition: 'transform 0.2s ease',
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
