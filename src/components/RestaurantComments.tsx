import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Alert,
  Skeleton,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  MoreVert,
  Reply,
  ThumbUp,
  ThumbUpOffAlt,
  Person
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  is_liked?: boolean;
  is_owner?: boolean;
  replies?: Comment[];
}

interface RestaurantCommentsProps {
  restaurantId: string;
  userId?: string;
  onCommentCountChange?: (count: number) => void;
}

const RestaurantComments: React.FC<RestaurantCommentsProps> = ({
  restaurantId,
  userId,
  onCommentCountChange
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);

  // 댓글 로딩
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await ApiService.getRestaurantComments(restaurantId, {
        limit: 50,
        offset: 0
      });

      if (response.success && response.data) {
        const commentData = response.data.comments || [];
        setComments(commentData);
        const totalComments = commentData.length + commentData.reduce((acc: number, comment: any) => acc + (comment.replies?.length || 0), 0);
        onCommentCountChange?.(totalComments);
      } else {
        // API 에러를 사용자에게 알기 쉽게 표시
        if (response.message?.includes('does not exist') || response.message?.includes('relation')) {
          setError('댓글 기능이 아직 준비 중입니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError(response.message || '댓글 데이터를 불러올 수 없습니다.');
        }
        setComments([]);
      }
    } catch (err: any) {
      console.error('댓글 로딩 실패:', err);

      // 네트워크 오류 vs 서버 오류 구분
      if (err.code === 'ERR_NETWORK') {
        setError('네트워크 연결을 확인해주세요.');
      } else if (err.response?.status === 500) {
        setError('댓글 기능이 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('댓글을 불러오는 중 오류가 발생했습니다.');
      }
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, onCommentCountChange]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !userId) return;

    // 이메일 인증 확인 (AuthContext의 user 정보 사용)
    if (user && !user.email_verified) {
      setError('댓글 작성은 이메일 인증 후 가능합니다. 이메일을 확인하고 인증을 완료해주세요.');
      return;
    }

    // 프론트엔드 검증
    if (newComment.trim().length < 1 || newComment.trim().length > 1000) {
      setError('댓글은 1자 이상 1000자 이하로 작성해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError(''); // 기존 오류 메시지 초기화

      const response = await ApiService.createComment({
        restaurant_id: restaurantId,
        content: newComment.trim()
      });

      if (response.success && response.data) {
        // 댓글 목록 다시 로드
        await loadComments();
        setNewComment('');
      } else {
        throw new Error(response.message || '댓글 작성에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('댓글 작성 실패:', err);
      // 사용자 친화적인 에러 메시지 사용
      setError(err.userMessage || err.response?.data?.message || '댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 답글 작성
  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim() || !userId) return;

    // 이메일 인증 확인 (AuthContext의 user 정보 사용)
    if (user && !user.email_verified) {
      setError('답글 작성은 이메일 인증 후 가능합니다. 이메일을 확인하고 인증을 완료해주세요.');
      return;
    }

    // 프론트엔드 검증
    if (replyContent.trim().length < 1 || replyContent.trim().length > 1000) {
      setError('답글은 1자 이상 1000자 이하로 작성해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError(''); // 기존 오류 메시지 초기화

      const response = await ApiService.createComment({
        restaurant_id: restaurantId,
        content: replyContent.trim(),
        parent_id: commentId
      });

      if (response.success && response.data) {
        // 댓글 목록 다시 로드
        await loadComments();
        setReplyContent('');
        setReplyTo(null);
      } else {
        throw new Error(response.message || '답글 작성에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('답글 작성 실패:', err);
      // 사용자 친화적인 에러 메시지 사용
      setError(err.userMessage || err.response?.data?.message || '답글 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 좋아요 토글
  const handleToggleLike = async (commentId: string) => {
    if (!userId) return;

    try {
      const response = await ApiService.toggleCommentLike(commentId);

      if (response.success && response.data) {
        // 댓글 목록 다시 로드하여 정확한 상태 반영
        await loadComments();
      } else {
        throw new Error(response.message || '좋아요 처리에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('좋아요 토글 실패:', err);
      // 사용자에게는 별도 오류 표시 안함 (좋아요는 부가 기능)
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, commentId: string) => {
    setMenuAnchor(event.currentTarget);
    setSelectedComment(commentId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedComment(null);
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko
    });
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <Paper
      key={comment.id}
      elevation={0}
      sx={{
        p: 3,
        mb: isReply ? 1 : 2,
        ml: isReply ? 4 : 0,
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        backgroundColor: isReply ? '#fafafa' : '#fff'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: '#e0e0e0' }}>
          <Person />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mr: 1 }}>
              {comment.username}
            </Typography>
            {comment.is_owner && (
              <Chip
                label="사장님"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  bgcolor: '#e8f5e8',
                  color: '#2e7d32'
                }}
              />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatDate(comment.created_at)}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => handleMenuClick(e, comment.id)}
          sx={{ opacity: 0.6 }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Box>

      <Typography
        variant="body2"
        sx={{
          lineHeight: 1.6,
          mb: 2,
          color: '#333'
        }}
      >
        {comment.content}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          size="small"
          startIcon={comment.is_liked ? <ThumbUp /> : <ThumbUpOffAlt />}
          onClick={() => handleToggleLike(comment.id)}
          sx={{
            color: comment.is_liked ? '#1976d2' : '#666',
            fontSize: '0.8rem',
            fontWeight: 500
          }}
        >
          {comment.likes_count}
        </Button>

        {!isReply && (
          <Button
            size="small"
            startIcon={<Reply />}
            onClick={() => setReplyTo(comment.id)}
            sx={{ color: '#666', fontSize: '0.8rem' }}
          >
            답글
          </Button>
        )}
      </Box>

      {/* 답글 작성 폼 */}
      {replyTo === comment.id && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="답글을 작성해주세요..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            error={replyContent.length > 1000}
            helperText={`${replyContent.length}/1000자${replyContent.length > 1000 ? ' (글자 수가 초과되었습니다)' : ''}`}
            size="small"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={() => {
                setReplyTo(null);
                setReplyContent('');
              }}
            >
              취소
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={!replyContent.trim() || submitting || replyContent.length > 1000}
              onClick={() => handleSubmitReply(comment.id)}
            >
              답글 작성
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );

  if (loading) {
    return (
      <Box>
        {[1, 2, 3].map((index) => (
          <Paper key={index} sx={{ p: 3, mb: 2, border: '1px solid #f0f0f0' }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="text" width="20%" height={16} />
              </Box>
            </Box>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 댓글 작성 폼 */}
      {userId ? (
        <Paper sx={{ p: 3, mb: 3, border: '1px solid #f0f0f0', borderRadius: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="이 맛집에 대한 경험을 공유해주세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            error={newComment.length > 1000}
            helperText={`${newComment.length}/1000자${newComment.length > 1000 ? ' (글자 수가 초과되었습니다)' : ''}`}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              disabled={!newComment.trim() || submitting || newComment.length > 1000}
              onClick={handleSubmitComment}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              댓글 작성
            </Button>
          </Box>
        </Paper>
      ) : (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            '& .MuiAlert-message': {
              fontSize: '0.9rem'
            }
          }}
        >
          댓글을 작성하려면 로그인이 필요합니다.
        </Alert>
      )}

      {/* 댓글 목록 */}
      <Box>
        {comments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              아직 댓글이 없습니다
            </Typography>
            <Typography variant="body2">
              첫 번째 댓글을 작성해보세요!
            </Typography>
          </Box>
        ) : (
          comments.map((comment) => (
            <Box key={comment.id}>
              {renderComment(comment)}
              {comment.replies?.map((reply) => renderComment(reply, true))}
            </Box>
          ))
        )}
      </Box>

      {/* 메뉴 */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 120 }
        }}
      >
        <MenuItem onClick={handleMenuClose}>신고하기</MenuItem>
        {selectedComment && userId && (
          <MenuItem onClick={handleMenuClose}>삭제하기</MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default RestaurantComments;