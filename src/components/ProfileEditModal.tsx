import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, PhotoCamera, Person } from '@mui/icons-material';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ open, onClose, onSuccess }) => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [imagePreview, setImagePreview] = useState<string>(user?.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 타입 체크
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // 이미지를 base64로 변환
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Cloudinary에 업로드
        const response = await ApiService.uploadProfileImage(base64Image);

        if (response.success && response.data) {
          setFormData({ ...formData, avatar_url: response.data.url });
          setImagePreview(response.data.url);
          setSuccess('이미지가 업로드되었습니다.');
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.userMessage || '이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // 비밀번호 변경 검증
    if (formData.new_password) {
      if (formData.new_password !== formData.confirm_password) {
        setError('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      if (formData.new_password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
      }
      if (!formData.current_password) {
        setError('현재 비밀번호를 입력해주세요.');
        return;
      }
    }

    setSaving(true);

    try {
      const updateData: any = {
        name: formData.name,
        phone: formData.phone,
        avatar_url: formData.avatar_url,
      };

      // 비밀번호 변경 시 추가
      if (formData.new_password) {
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
      }

      const response = await ApiService.updateProfile(updateData);

      if (response.success && response.data?.user) {
        // 사용자 정보 업데이트
        updateUser(response.data.user);
        setSuccess('프로필이 수정되었습니다.');

        // 성공 콜백 호출
        if (onSuccess) {
          onSuccess();
        }

        // 2초 후 모달 닫기
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.userMessage || '프로필 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({
        name: user?.name || '',
        phone: user?.phone || '',
        avatar_url: user?.avatar_url || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setImagePreview(user?.avatar_url || '');
      setError('');
      setSuccess('');
      onClose();
    }
  };

  const isEmailLogin = user?.auth_provider === 'email';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          프로필 수정
          <IconButton onClick={handleClose} disabled={saving}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 프로필 이미지 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={imagePreview}
                sx={{ width: 120, height: 120 }}
              >
                {!imagePreview && <Person sx={{ fontSize: 60 }} />}
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageSelect}
                disabled={uploading}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={20} color="inherit" /> : <PhotoCamera />}
              </IconButton>
            </Box>
          </Box>

          {/* 기본 정보 */}
          <TextField
            label="이름"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
          />

          <TextField
            label="전화번호"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            fullWidth
            placeholder="010-1234-5678"
          />

          <TextField
            label="이메일"
            value={user?.email}
            fullWidth
            disabled
            helperText="이메일은 변경할 수 없습니다"
          />

          {/* 비밀번호 변경 (이메일 로그인만) */}
          {isEmailLogin && (
            <>
              <Box sx={{ pt: 2, pb: 1 }}>
                <Box sx={{ height: 1, backgroundColor: 'divider', mb: 2 }} />
                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>
                  비밀번호 변경 (선택사항)
                </Box>
              </Box>

              <TextField
                label="현재 비밀번호"
                type="password"
                value={formData.current_password}
                onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                fullWidth
              />

              <TextField
                label="새 비밀번호"
                type="password"
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                fullWidth
                helperText="최소 6자 이상"
              />

              <TextField
                label="새 비밀번호 확인"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                fullWidth
              />
            </>
          )}

          {!isEmailLogin && (
            <Alert severity="info">
              {user?.auth_provider === 'google' && 'Google 로그인 계정입니다.'}
              {user?.auth_provider === 'kakao' && 'Kakao 로그인 계정입니다.'}
              {user?.auth_provider === 'naver' && 'Naver 로그인 계정입니다.'}
              <br />
              소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.
            </Alert>
          )}

          {/* 에러/성공 메시지 */}
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={saving || !formData.name}
        >
          {saving ? <CircularProgress size={24} /> : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileEditModal;
