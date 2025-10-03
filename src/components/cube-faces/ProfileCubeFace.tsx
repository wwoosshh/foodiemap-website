import React, { useState } from 'react';
import { Box, Container, Typography, Avatar, Card, CardContent, Button, Tabs, Tab } from '@mui/material';
import { Person, FavoriteBorder, RateReview, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../LoginModal';

interface ProfileCubeFaceProps {
  onNavigate: (face: string) => void;
}

const ProfileCubeFace: React.FC<ProfileCubeFaceProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const handleLogout = () => {
    logout();
  };

  // 로그인 하지 않은 경우
  if (!user) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 24px',
                  backgroundColor: 'grey.300',
                }}
              >
                <Person sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                로그인이 필요합니다
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                맛집 리뷰와 즐겨찾기 기능을 이용하려면 로그인해주세요
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setLoginModalOpen(true)}
                sx={{ px: 4 }}
              >
                로그인 / 회원가입
              </Button>
            </CardContent>
          </Card>
        </Container>

        <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </Box>
    );
  }

  // 로그인한 경우
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
        {/* 프로필 헤더 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={user.avatar_url}
                sx={{ width: 100, height: 100 }}
              >
                <Person sx={{ fontSize: 60 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  {user.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                {user.phone && (
                  <Typography variant="body2" color="text.secondary">
                    {user.phone}
                  </Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* 탭 메뉴 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)}>
            <Tab icon={<FavoriteBorder />} label="즐겨찾기" />
            <Tab icon={<RateReview />} label="내 리뷰" />
          </Tabs>
        </Box>

        {/* 탭 컨텐츠 */}
        {currentTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              즐겨찾기한 맛집
            </Typography>
            <Box
              sx={{
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                즐겨찾기한 맛집이 없습니다
              </Typography>
            </Box>
          </Box>
        )}

        {currentTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              작성한 리뷰
            </Typography>
            <Box
              sx={{
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                작성한 리뷰가 없습니다
              </Typography>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProfileCubeFace;
