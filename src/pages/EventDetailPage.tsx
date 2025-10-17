import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Button,
  Skeleton,
  Alert,
  Container,
} from '@mui/material';
import {
  AccessTime,
  Event as EventIcon,
  ArrowBack,
  OpenInNew,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/api';
import { DEFAULT_EVENT_IMAGE, handleImageError } from '../constants/images';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        setError('이벤트 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await ApiService.getEventById(id);

        if (response.success && response.data) {
          setEvent(response.data);
        } else {
          setError('이벤트를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('이벤트 로드 실패:', err);
        setError('이벤트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPeriod = (startDate: string, endDate: string | null) => {
    const start = formatDate(startDate);
    if (!endDate) return `${start} ~ 상시 진행`;
    const end = formatDate(endDate);
    return `${start} ~ ${end}`;
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
      {loading ? (
        <Box>
          <Skeleton variant="text" width="60%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ my: 3 }} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
        </Box>
      ) : error ? (
        <Box>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </Box>
      ) : event ? (
        <Box>
          {/* 뒤로가기 버튼 */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            목록으로
          </Button>

          {/* 이벤트 헤더 */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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

            <Typography variant="h3" fontWeight={700} gutterBottom>
              {event.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <AccessTime fontSize="small" />
              <Typography variant="body2">
                {formatPeriod(event.start_date, event.end_date)}
              </Typography>
            </Box>
          </Box>

          {/* 이벤트 이미지 */}
          <Card sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              image={event.image_url || DEFAULT_EVENT_IMAGE}
              alt={event.title}
              onError={(e) => handleImageError(e, DEFAULT_EVENT_IMAGE)}
              sx={{
                width: '100%',
                maxHeight: 500,
                objectFit: 'contain',
                backgroundColor: '#f5f5f5',
              }}
            />
          </Card>

          {/* 이벤트 설명 */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                }}
              >
                {event.description}
              </Typography>
            </CardContent>
          </Card>

          {/* 외부 링크 버튼 */}
          {event.link_url && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<OpenInNew />}
                onClick={() => window.open(event.link_url, '_blank')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                이벤트 참여하기
              </Button>
            </Box>
          )}

          {/* 하단 네비게이션 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              pt: 4,
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
              목록으로
            </Button>
            <Button startIcon={<EventIcon />} onClick={() => navigate('/')}>
              다른 이벤트 보기
            </Button>
          </Box>
        </Box>
      ) : null}
    </Container>
    </MainLayout>
  );
};

export default EventDetailPage;
