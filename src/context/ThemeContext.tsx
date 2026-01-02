import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ApiService } from '../services/api';

interface ThemeContextType {
  themeMode: 'light' | 'dark' | 'auto';
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
  currentTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'auto'>('light');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // 실제 적용되는 테마 (auto일 경우 시스템 설정 따름)
  const currentTheme: 'light' | 'dark' = useMemo(() => {
    if (themeMode === 'auto') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, prefersDarkMode]);

  // 초기 로드 시 사용자 설정 불러오기
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          // 비로그인 시 로컬스토리지에서 가져오기
          const savedTheme = localStorage.getItem('theme_preference');
          if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto')) {
            setThemeModeState(savedTheme);
          }
          return;
        }

        const response = await ApiService.getUserPreferences();
        if (response.success && response.data) {
          const theme = response.data.theme || 'light';
          setThemeModeState(theme as 'light' | 'dark' | 'auto');
        }
      } catch (error) {
        console.error('테마 설정 로드 실패:', error);
      }
    };

    loadThemePreference();
  }, []);

  const setThemeMode = (mode: 'light' | 'dark' | 'auto') => {
    setThemeModeState(mode);
    // 로컬스토리지에도 저장 (비로그인 사용자용)
    localStorage.setItem('theme_preference', mode);
  };

  // 라이트 테마 - 세련되고 프리미엄한 맛집 브랜드
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#E8505B',      // 더 세련된 코랄 레드
        light: '#FF7A82',
        dark: '#C73E47',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#2D3436',      // 차분한 차콜 그레이
        light: '#636E72',
        dark: '#1E2426',
        contrastText: '#FFFFFF',
      },
      success: {
        main: '#00B894',
        light: '#55EFC4',
        dark: '#00A381',
      },
      warning: {
        main: '#FDCB6E',
        light: '#FFEAA7',
        dark: '#E5B85C',
      },
      error: {
        main: '#E8505B',
        light: '#FF7A82',
        dark: '#C73E47',
      },
      info: {
        main: '#74B9FF',
        light: '#A3D3FF',
        dark: '#5A9FE5',
      },
      background: {
        default: '#FAFAFA',   // 깔끔한 오프화이트
        paper: '#FFFFFF',
      },
      text: {
        primary: '#1A1A1A',   // 더 진한 텍스트
        secondary: '#6B7280',
        disabled: '#9CA3AF',
      },
      divider: 'rgba(0, 0, 0, 0.06)',
    },
    typography: {
      fontFamily: '"Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        letterSpacing: '-0.015em',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.1rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        letterSpacing: '-0.01em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        letterSpacing: '-0.005em',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '-0.01em',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 12,
            fontWeight: 600,
            padding: '12px 28px',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(232, 80, 91, 0.25)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
              backgroundColor: 'rgba(232, 80, 91, 0.04)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.25s ease',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: '#F8F9FA',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(232, 80, 91, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#E8505B',
                borderWidth: '1.5px',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          },
          elevation2: {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          },
          elevation3: {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
  });

  // 다크 테마 - 세련된 다크 모드
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#FF6B7A',      // 다크모드에서 더 밝은 코랄
        light: '#FF8E9A',
        dark: '#E8505B',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#E2E8F0',
        light: '#F1F5F9',
        dark: '#CBD5E1',
        contrastText: '#0F0F0F',
      },
      success: {
        main: '#34D399',
        light: '#6EE7B7',
        dark: '#10B981',
      },
      warning: {
        main: '#FBBF24',
        light: '#FCD34D',
        dark: '#F59E0B',
      },
      error: {
        main: '#FF6B7A',
        light: '#FF8E9A',
        dark: '#E8505B',
      },
      info: {
        main: '#60A5FA',
        light: '#93C5FD',
        dark: '#3B82F6',
      },
      background: {
        default: '#0A0A0A',
        paper: '#141414',
      },
      text: {
        primary: '#F9FAFB',
        secondary: '#9CA3AF',
        disabled: '#6B7280',
      },
      divider: 'rgba(255, 255, 255, 0.08)',
    },
    typography: {
      fontFamily: '"Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        letterSpacing: '-0.015em',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.1rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        letterSpacing: '-0.01em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        letterSpacing: '-0.005em',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '-0.01em',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 12,
            fontWeight: 600,
            padding: '12px 28px',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(255, 107, 122, 0.3)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              borderWidth: '1.5px',
              borderColor: '#FF6B7A',
              backgroundColor: 'rgba(255, 107, 122, 0.08)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: '0 2px 16px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.25s ease',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            backgroundColor: '#141414',
            '&:hover': {
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: '#1A1A1A',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 107, 122, 0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FF6B7A',
                borderWidth: '1.5px',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: '#141414',
          },
          elevation1: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          },
          elevation2: {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          },
          elevation3: {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
  });

  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, currentTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
