import React, { ReactNode } from 'react';
import { Box, Container, AppBar, Toolbar, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface StandardLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

/**
 * 일반 웹사이트 스타일의 레이아웃 컴포넌트
 * - 왼쪽 상단에 Cube 홈 버튼
 * - 스크롤 가능한 컨텐츠 영역
 * - Cube 메인 페이지와 독립적인 UI
 */
const StandardLayout: React.FC<StandardLayoutProps> = ({ children, maxWidth = 'lg' }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* 상단 네비게이션 바 */}
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#000000',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar>
          {/* Cube 홈 버튼 */}
          <Button
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              color: '#000000',
              fontWeight: 600,
              fontSize: '1.1rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Cube
          </Button>

          {/* 오른쪽 여백 */}
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>

      {/* 메인 컨텐츠 */}
      <Container maxWidth={maxWidth} sx={{ py: 4 }}>
        {children}
      </Container>

      {/* 푸터 */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#fafafa',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Button
              size="small"
              onClick={() => navigate('/terms')}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              이용약관
            </Button>
            <Button
              size="small"
              onClick={() => navigate('/privacy')}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              개인정보처리방침
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              © 2024 Cube. All rights reserved.
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default StandardLayout;
