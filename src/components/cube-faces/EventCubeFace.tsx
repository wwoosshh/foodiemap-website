import React from 'react';
import { Box, Container, Typography, Card, CardContent, Chip } from '@mui/material';
import { Event as EventIcon, Campaign, AccessTime } from '@mui/icons-material';

interface EventCubeFaceProps {
  onNavigate: (face: string) => void;
}

const EventCubeFace: React.FC<EventCubeFaceProps> = ({ onNavigate }) => {
  // 임시 이벤트 데이터
  const events = [
    {
      id: 1,
      title: '신규 회원 환영 이벤트',
      description: '회원가입하고 첫 리뷰 작성 시 포인트 지급!',
      period: '2025.01.01 ~ 2025.12.31',
      status: '진행중',
      badge: 'NEW',
    },
    {
      id: 2,
      title: '월간 베스트 리뷰어',
      description: '이달의 베스트 리뷰어에게 특별한 혜택을 드립니다',
      period: '매월 1일 ~ 말일',
      status: '진행중',
      badge: 'HOT',
    },
    {
      id: 3,
      title: '맛집 추천 이벤트',
      description: '숨겨진 맛집을 추천해주세요',
      period: '상시 진행',
      status: '진행중',
      badge: null,
    },
  ];

  const notices = [
    {
      id: 1,
      title: '3D 큐브 UI 업데이트 안내',
      date: '2025.01.15',
    },
    {
      id: 2,
      title: '개인정보 처리방침 변경 안내',
      date: '2025.01.10',
    },
    {
      id: 3,
      title: '서비스 점검 안내',
      date: '2025.01.05',
    },
  ];

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
        {/* 이벤트 섹션 */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EventIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              진행 중인 이벤트
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              },
              gap: 3,
            }}
          >
            {events.map((event) => (
              <Card
                key={event.id}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
                      {event.title}
                    </Typography>
                    {event.badge && (
                      <Chip
                        label={event.badge}
                        size="small"
                        color={event.badge === 'NEW' ? 'primary' : 'error'}
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {event.period}
                    </Typography>
                    <Chip
                      label={event.status}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* 공지사항 섹션 */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Campaign sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              공지사항
            </Typography>
          </Box>

          <Card>
            <CardContent sx={{ p: 0 }}>
              {notices.map((notice, index) => (
                <Box
                  key={notice.id}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    borderBottom: index < notices.length - 1 ? '1px solid #e0e0e0' : 'none',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight={500}>
                      {notice.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notice.date}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default EventCubeFace;
