import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Button,
  Skeleton,
  Alert,
  Divider,
  Container,
} from '@mui/material';
import {
  Campaign,
  ArrowBack,
  Visibility,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/api';

const NoticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNotice = async () => {
      if (!id) {
        setError('공지사항 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await ApiService.getNoticeById(id);

        if (response.success && response.data) {
          setNotice(response.data);
        } else {
          setError('공지사항을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('공지사항 로드 실패:', err);
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadNotice();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
      {loading ? (
        <Box>
          <Skeleton variant="text" width="60%" height={60} />
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" width="100%" height={400} />
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
      ) : notice ? (
        <Box>
          {/* 뒤로가기 버튼 */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            목록으로
          </Button>

          {/* 공지사항 헤더 */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              {/* 중요 배지 */}
              {notice.is_important && (
                <Chip
                  label="중요"
                  color="error"
                  size="small"
                  sx={{ fontWeight: 600, mb: 2 }}
                />
              )}

              {/* 제목 */}
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {notice.title}
              </Typography>

              {/* 메타 정보 */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  alignItems: 'center',
                  color: 'text.secondary',
                  mt: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Campaign fontSize="small" />
                  <Typography variant="body2">공지사항</Typography>
                </Box>

                <Divider orientation="vertical" flexItem />

                <Typography variant="body2">{formatDate(notice.created_at)}</Typography>

                {notice.view_count !== undefined && (
                  <>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Visibility fontSize="small" />
                      <Typography variant="body2">조회 {notice.view_count}</Typography>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* 공지사항 내용 */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  minHeight: 200,
                }}
              >
                {notice.content}
              </Typography>
            </CardContent>
          </Card>

          {/* 하단 네비게이션 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              pt: 4,
              mt: 4,
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
              목록으로
            </Button>
            <Button startIcon={<Campaign />} onClick={() => navigate('/')}>
              다른 공지사항 보기
            </Button>
          </Box>
        </Box>
      ) : null}
    </Container>
    </MainLayout>
  );
};

export default NoticeDetailPage;
