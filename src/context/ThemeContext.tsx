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

  // 라이트 테마
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#FF6B6B',
        light: '#FF9999',
        dark: '#E85555',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#4ECDC4',
        light: '#7EDBD4',
        dark: '#3AB5AD',
        contrastText: '#FFFFFF',
      },
      success: {
        main: '#95E1D3',
        light: '#B4EBE0',
        dark: '#76C7BB',
      },
      warning: {
        main: '#FFD93D',
        light: '#FFE570',
        dark: '#F5C400',
      },
      error: {
        main: '#FF6B6B',
        light: '#FF9999',
        dark: '#E85555',
      },
      info: {
        main: '#6C7A89',
        light: '#95A5A6',
        dark: '#556370',
      },
      background: {
        default: '#FFF5F0',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#2C3E50',
        secondary: '#6C7A89',
        disabled: '#BDC3C7',
      },
      divider: 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: '"Pretendard", "Noto Sans KR", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '2.5rem',
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.5rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
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
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 12,
            fontWeight: 600,
            padding: '10px 24px',
            fontSize: '0.95rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          contained: {
            boxShadow: '0px 4px 14px rgba(255, 107, 107, 0.35)',
            '&:hover': {
              boxShadow: '0px 8px 24px rgba(255, 107, 107, 0.4)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(0, 0, 0, 0.04)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
    },
  });

  // 다크 테마
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#FF8E8E',
        light: '#FFB4B4',
        dark: '#FF6B6B',
        contrastText: '#121212',
      },
      secondary: {
        main: '#4ECDC4',
        light: '#7EDBD4',
        dark: '#3AB5AD',
        contrastText: '#121212',
      },
      success: {
        main: '#76C7BB',
        light: '#95E1D3',
        dark: '#5AB3A7',
      },
      warning: {
        main: '#FFD93D',
        light: '#FFE570',
        dark: '#F5C400',
      },
      error: {
        main: '#FF8E8E',
        light: '#FFB4B4',
        dark: '#FF6B6B',
      },
      info: {
        main: '#95A5A6',
        light: '#B8C5C7',
        dark: '#6C7A89',
      },
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B0B0B0',
        disabled: '#6C6C6C',
      },
      divider: 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
      fontFamily: '"Pretendard", "Noto Sans KR", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '2.5rem',
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.5rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
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
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 12,
            fontWeight: 600,
            padding: '10px 24px',
            fontSize: '0.95rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          contained: {
            boxShadow: '0px 4px 14px rgba(255, 142, 142, 0.35)',
            '&:hover': {
              boxShadow: '0px 8px 24px rgba(255, 142, 142, 0.4)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
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
