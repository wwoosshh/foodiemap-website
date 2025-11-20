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
  InfoIcon,
  UserIcon,
  HomeIcon,
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
    if (path.startsWith('/notices')) return 3;
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
        navigate('/notices');
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
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        // 하단 Safe Area 처리 (iOS 등)
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: '24px 24px 0 0',
          backgroundColor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.95)
            : alpha('#FFFFFF', 0.95),
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 -4px 20px rgba(0, 0, 0, 0.5)'
            : '0 -4px 20px rgba(0, 0, 0, 0.08)',
          // 알약 형태의 그림자 효과
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '4px',
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: '2px',
            mt: 1,
          },
        }}
      >
        <BottomNavigation
          value={getCurrentValue()}
          onChange={handleNavigation}
          showLabels
          sx={{
            backgroundColor: 'transparent',
            height: 70,
            pt: 1.5,
            pb: 1,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 12px',
              gap: '4px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                '& .MuiBottomNavigationAction-label': {
                  fontWeight: 700,
                  fontSize: '0.75rem',
                },
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.1)',
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                fontWeight: 500,
                opacity: 1,
                transition: 'all 0.2s ease',
              },
              '& .MuiSvgIcon-root': {
                fontSize: 24,
                transition: 'transform 0.2s ease',
              },
            },
          }}
        >
          <BottomNavigationAction
            label={t.nav.home}
            icon={<HomeIcon />}
            sx={{
              '&.Mui-selected': {
                '& .MuiSvgIcon-root': {
                  filter: 'drop-shadow(0 2px 8px rgba(255, 107, 107, 0.3))',
                },
              },
            }}
          />
          <BottomNavigationAction
            label={t.nav.restaurantSearch}
            icon={<RestaurantIcon />}
            sx={{
              '&.Mui-selected': {
                '& .MuiSvgIcon-root': {
                  filter: 'drop-shadow(0 2px 8px rgba(255, 107, 107, 0.3))',
                },
              },
            }}
          />
          <BottomNavigationAction
            label={t.nav.events}
            icon={
              <Badge badgeContent={0} color="error" max={9}>
                <GiftIcon />
              </Badge>
            }
            sx={{
              '&.Mui-selected': {
                '& .MuiSvgIcon-root': {
                  filter: 'drop-shadow(0 2px 8px rgba(255, 107, 107, 0.3))',
                },
              },
            }}
          />
          <BottomNavigationAction
            label={t.nav.notices}
            icon={
              <Badge badgeContent={0} color="error" max={9}>
                <InfoIcon />
              </Badge>
            }
            sx={{
              '&.Mui-selected': {
                '& .MuiSvgIcon-root': {
                  filter: 'drop-shadow(0 2px 8px rgba(255, 107, 107, 0.3))',
                },
              },
            }}
          />
          <BottomNavigationAction
            label={user ? t.nav.myProfile : t.nav.login}
            icon={<UserIcon />}
            sx={{
              '&.Mui-selected': {
                '& .MuiSvgIcon-root': {
                  filter: 'drop-shadow(0 2px 8px rgba(255, 107, 107, 0.3))',
                },
              },
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MobileBottomNav;
