import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Pagination,
  Skeleton,
  Alert,
  Divider,
} from '@mui/material';
import { Campaign, Visibility } from '@mui/icons-material';
import StandardLayout from '../components/StandardLayout';
import { ApiService } from '../services/api';

const NoticeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    const loadNotices = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getNotices({ page, limit });

        if (response.success && response.data) {
          setNotices(response.data.notices || []);
          setTotalPages(response.data.pagination?.totalPages || 1);
        } else {
          setError('공지사항을 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('공지사항 로드 실패:', err);
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, [page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StandardLayout maxWidth="md">
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Campaign sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>
          공지사항
        </Typography>
        <Typography variant="body1" color="text.secondary">
          중요한 소식과 업데이트를 확인하세요
        </Typography>
      </Box>

      {/* 로딩 상태 */}
      {loading ? (
        <Card>
          <CardContent>
            {[...Array(10)].map((_, i) => (
              <Box key={i} sx={{ mb: 3 }}>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="40%" height={20} />
                {i < 9 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : notices.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            등록된 공지사항이 없습니다.
          </Typography>
        </Box>
      ) : (
        <>
          {/* 공지사항 리스트 */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              {notices.map((notice, index) => (
                <Box key={notice.id}>
                  <Box
                    onClick={() => navigate(`/notices/${notice.id}`)}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    {/* 제목 영역 */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {notice.is_important && (
                        <Chip
                          label="중요"
                          size="small"
                          color="error"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                      <Typography
                        variant="h6"
                        fontWeight={notice.is_important ? 600 : 500}
                        sx={{
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {notice.title}
                      </Typography>
                    </Box>

                    {/* 메타 정보 */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        color: 'text.secondary',
                      }}
                    >
                      <Typography variant="body2">
                        {formatDate(notice.created_at)}
                      </Typography>
                      {notice.view_count !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Visibility sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{notice.view_count}</Typography>
                        </Box>
                      )}
                    </Box>

                    {/* 미리보기 */}
                    {notice.content && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {notice.content}
                      </Typography>
                    )}
                  </Box>

                  {index < notices.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>

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
    </StandardLayout>
  );
};

export default NoticeListPage;
