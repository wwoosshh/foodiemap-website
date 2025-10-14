import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Card, CardContent, Chip } from '@mui/material';
import { Event as EventIcon, Campaign, AccessTime } from '@mui/icons-material';
import { ApiService } from '../../services/api';
import CubeLoader from '../CubeLoader';

interface EventCubeFaceProps {
  onNavigate: (face: string) => void;
}

const EventCubeFace: React.FC<EventCubeFaceProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [eventsResponse, noticesResponse] = await Promise.all([
          ApiService.getEvents({ page: 1, limit: 20 }),
          ApiService.getNotices({ page: 1, limit: 10 })
        ]);

        if (eventsResponse.success && eventsResponse.data) {
          setEvents(eventsResponse.data.events || []);
        }

        if (noticesResponse.success && noticesResponse.data) {
          setNotices(noticesResponse.data.notices || []);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatPeriod = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate).toLocaleDateString('ko-KR');
    if (!endDate) return `${start} ~ 상시 진행`;
    const end = new Date(endDate).toLocaleDateString('ko-KR');
    return `${start} ~ ${end}`;
  };

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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CubeLoader size={80} message="이벤트 정보 불러오는 중..." />
          </Box>
        ) : (
          <>
            {/* 이벤트 섹션 */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EventIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                <Typography variant="h4" fontWeight={700}>
                  진행 중인 이벤트
                </Typography>
              </Box>

              {events.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    진행 중인 이벤트가 없습니다
                  </Typography>
                </Box>
              ) : (
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
                      onClick={() => navigate(`/events/${event.id}`)}
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
                            {formatPeriod(event.start_date, event.end_date)}
                          </Typography>
                          <Chip
                            label={event.status === 'active' ? '진행중' : event.status === 'inactive' ? '대기' : '종료'}
                            size="small"
                            color={event.status === 'active' ? 'success' : 'default'}
                            variant="outlined"
                            sx={{ ml: 'auto' }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </>
        )}

        {/* 공지사항 섹션 */}
        {!loading && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Campaign sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
              <Typography variant="h4" fontWeight={700}>
                공지사항
              </Typography>
            </Box>

            {notices.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" color="text.secondary">
                  공지사항이 없습니다
                </Typography>
              </Box>
            ) : (
              <Card>
                <CardContent sx={{ p: 0 }}>
                  {notices.map((notice, index) => (
                    <Box
                      key={notice.id}
                      onClick={() => navigate(`/notices/${notice.id}`)}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {notice.is_important && (
                            <Chip label="중요" size="small" color="error" sx={{ fontWeight: 600 }} />
                          )}
                          <Typography variant="body1" fontWeight={notice.is_important ? 600 : 500}>
                            {notice.title}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default EventCubeFace;
