import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface EmailVerificationModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  open,
  onClose,
  email,
  onVerificationSuccess,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(300); // 5분 = 300초
  const [canResend, setCanResend] = useState(false);

  // 타이머 카운트다운
  useEffect(() => {
    if (!open || success) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, success]);

  // 타이머 포맷팅 (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 인증 코드 확인
  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:10000'}/api/verification/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setError('');

        // 2초 후 성공 처리
        setTimeout(() => {
          onVerificationSuccess();
          onClose();
        }, 2000);
      } else {
        setError(data.message || '인증에 실패했습니다. 코드를 확인해주세요.');
      }
    } catch (err) {
      console.error('인증 오류:', err);
      setError('인증 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 인증 코드 재발송
  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:10000'}/api/verification/resend-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setTimer(300); // 타이머 리셋
        setCanResend(false);
        setCode('');
        setError('');
        alert('새로운 인증 코드가 발송되었습니다.');
      } else {
        setError(data.message || '재발송에 실패했습니다.');
      }
    } catch (err) {
      console.error('재발송 오류:', err);
      setError('재발송 중 오류가 발생했습니다.');
    } finally {
      setResending(false);
    }
  };

  // 입력 필드에서 엔터키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && code.length === 6) {
      handleVerify();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={success ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {!success && (
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>
      )}

      <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
        {success ? (
          <Box>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={600}>
              인증 완료!
            </Typography>
          </Box>
        ) : (
          <Box>
            <EmailIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={600}>
              이메일 인증
            </Typography>
          </Box>
        )}
      </DialogTitle>

      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            이메일 인증이 완료되었습니다! 이제 모든 기능을 이용하실 수 있습니다.
          </Alert>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              <strong>{email}</strong>로<br />
              인증 코드를 발송했습니다.
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                📧 이메일을 확인하여 6자리 인증 코드를 입력해주세요.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                ⏰ 남은 시간: <strong>{formatTime(timer)}</strong>
              </Typography>
            </Alert>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="인증 코드"
              placeholder="6자리 숫자 입력"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 6) {
                  setCode(value);
                  setError('');
                }
              }}
              onKeyPress={handleKeyPress}
              inputProps={{
                maxLength: 6,
                style: { fontSize: 24, textAlign: 'center', letterSpacing: 8 }
              }}
              disabled={loading || success}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                이메일을 받지 못하셨나요?
              </Typography>
              <Button
                size="small"
                onClick={handleResend}
                disabled={!canResend || resending}
                sx={{ textTransform: 'none' }}
              >
                {resending ? <CircularProgress size={20} /> : canResend ? '재발송' : `재발송 (${formatTime(timer)})`}
              </Button>
            </Box>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                • 이메일 인증을 완료해야 리뷰와 댓글을 작성할 수 있습니다.<br />
                • 인증 코드는 5분간 유효합니다.<br />
                • 스팸함도 확인해주세요.
              </Typography>
            </Alert>
          </>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={onClose}
            color="inherit"
            disabled={loading}
          >
            나중에
          </Button>
          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={code.length !== 6 || loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : '인증하기'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default EmailVerificationModal;