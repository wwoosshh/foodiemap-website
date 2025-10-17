import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Pagination,
  Skeleton,
  Alert,
  Container,
} from '@mui/material';
import { AccessTime, Event as EventIcon } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/api';
import { DEFAULT_EVENT_IMAGE, handleImageError } from '../constants/images';

const EventListPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getEvents({ page, limit });

        if (response.success && response.data) {
          setEvents(response.data.events || []);
          setTotalPages(response.data.pagination?.totalPages || 1);
        } else {
          setError('이벤트를 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('이벤트 로드 실패:', err);
        setError('이벤트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [page]);

  const formatPeriod = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate).toLocaleDateString('ko-KR');
    if (!endDate) return `${start} ~ 상시 진행`;
    const end = new Date(endDate).toLocaleDateString('ko-KR');
    return `${start} ~ ${end}`;
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <EventIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>
          이벤트
        </Typography>
        <Typography variant="body1" color="text.secondary">
          진행 중인 다양한 이벤트를 확인하세요
        </Typography>
      </Box>

      {/* 로딩 상태 */}
      {loading ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : events.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            진행 중인 이벤트가 없습니다.
          </Typography>
        </Box>
      ) : (
        <>
          {/* 이벤트 그리드 */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 6,
            }}
          >
            {events.map((event) => (
              <Card
                key={event.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={event.image_url || DEFAULT_EVENT_IMAGE}
                  alt={event.title}
                  onError={(e) => handleImageError(e, DEFAULT_EVENT_IMAGE)}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  {/* 배지 */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {event.badge && (
                      <Chip
                        label={event.badge}
                        size="small"
                        color={event.badge === 'NEW' ? 'primary' : 'error'}
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                    <Chip
                      label={
                        event.status === 'active'
                          ? '진행중'
                          : event.status === 'inactive'
                          ? '대기'
                          : '종료'
                      }
                      size="small"
                      color={event.status === 'active' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Box>

                  {/* 제목 */}
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {event.title}
                  </Typography>

                  {/* 설명 */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {event.description}
                  </Typography>

                  {/* 기간 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatPeriod(event.start_date, event.end_date)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
      </Container>
    </MainLayout>
  );
};

export default EventListPage;
