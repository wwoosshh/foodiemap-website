import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
  Restore as RestoreIcon,
  PhotoCamera,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import FavoritesListView from '../components/FavoritesListView';
import ReviewsListView from '../components/ReviewsListView';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import {
  UserIcon,
  EmailIcon,
  PhoneIcon,
  SettingsIcon,
} from '../components/icons/CustomIcons';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();

  const [selectedTab, setSelectedTab] = useState(0);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 회원 탈퇴 관련 상태
  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
  const [deletionStatus, setDeletionStatus] = useState<any>(null);
  const [deletionLoading, setDeletionLoading] = useState(false);

  // 프로필 수정 상태
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || '',
  });
  const [imagePreview, setImagePreview] = useState<string>(user?.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 사용자 설정 상태
  const [preferences, setPreferences] = useState({
    preferred_language: 'ko',
    theme: 'light',
    notification_enabled: true,
    email_notification: true,
  });
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadUserData();
    loadDeletionStatus();
    loadUserPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 사용자 정보 변경 시 폼 업데이트
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        avatar_url: user.avatar_url || '',
      });
      setImagePreview(user.avatar_url || '');
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [favoritesRes, reviewsRes] = await Promise.all([
        ApiService.getUserFavorites(),
        ApiService.getUserReviews({ page: 1, limit: 10 }),
      ]);

      if (favoritesRes.success && favoritesRes.data) {
        setFavorites(favoritesRes.data.favorites || []);
      }

      if (reviewsRes.success && reviewsRes.data) {
        setMyReviews(reviewsRes.data.reviews || []);
      }
    } catch (err) {
      // 로드 실패 시 빈 배열 유지
    } finally {
      setLoading(false);
    }
  };

  // 탈퇴 상태 조회
  const loadDeletionStatus = async () => {
    try {
      const response = await ApiService.getDeletionStatus();
      if (response.success && response.data) {
        setDeletionStatus(response.data);
      }
    } catch (err) {
      console.error('탈퇴 상태 조회 실패:', err);
    }
  };

  // 사용자 설정 로드
  const loadUserPreferences = async () => {
    try {
      const response = await ApiService.getUserPreferences();
      if (response.success && response.data) {
        setPreferences({
          preferred_language: response.data.preferred_language || 'ko',
          theme: response.data.theme || 'light',
          notification_enabled: response.data.notification_enabled !== false,
          email_notification: response.data.email_notification !== false,
        });
      }
    } catch (err) {
      console.error('사용자 설정 로드 실패:', err);
    }
  };

  // 프로필 이미지 업로드
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSettingsMessage({ type: 'error', text: '이미지 크기는 5MB 이하여야 합니다.' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setSettingsMessage({ type: 'error', text: '이미지 파일만 업로드 가능합니다.' });
      return;
    }

    setUploading(true);
    setSettingsMessage(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const response = await ApiService.uploadProfileImage(base64Image);

        if (response.success && response.data) {
          setProfileForm({ ...profileForm, avatar_url: response.data.url });
          setImagePreview(response.data.url);
          setSettingsMessage({ type: 'success', text: '이미지가 업로드되었습니다.' });
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.userMessage || '이미지 업로드에 실패했습니다.' });
    } finally {
      setUploading(false);
    }
  };

  // 프로필 정보 저장
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setSettingsMessage(null);

    try {
      const response = await ApiService.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        avatar_url: profileForm.avatar_url,
      });

      if (response.success) {
        await refreshUser();
        setSettingsMessage({ type: 'success', text: '프로필이 수정되었습니다.' });
      }
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.userMessage || '프로필 수정에 실패했습니다.' });
    } finally {
      setProfileSaving(false);
    }
  };

  // 언어 설정 변경
  const handleLanguageChange = async (language: string) => {
    setPreferencesSaving(true);
    setSettingsMessage(null);

    try {
      const response = await ApiService.updateLanguagePreference(language);
      if (response.success) {
        setPreferences({ ...preferences, preferred_language: language });
        setSettingsMessage({ type: 'success', text: '언어 설정이 변경되었습니다.' });
      }
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.userMessage || '언어 설정 변경에 실패했습니다.' });
    } finally {
      setPreferencesSaving(false);
    }
  };

  // 테마 설정 변경
  const handleThemeChange = async (theme: string) => {
    setPreferencesSaving(true);
    setSettingsMessage(null);

    try {
      const response = await ApiService.updateThemePreference(theme);
      if (response.success) {
        setPreferences({ ...preferences, theme });
        setSettingsMessage({ type: 'success', text: '테마 설정이 변경되었습니다.' });
      }
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.userMessage || '테마 설정 변경에 실패했습니다.' });
    } finally {
      setPreferencesSaving(false);
    }
  };

  // 알림 설정 변경
  const handleNotificationChange = async (field: string, value: boolean) => {
    setPreferencesSaving(true);
    setSettingsMessage(null);

    try {
      const response = await ApiService.updateNotificationPreferences({
        notification_enabled: field === 'notification_enabled' ? value : preferences.notification_enabled,
        email_notification: field === 'email_notification' ? value : preferences.email_notification,
      });

      if (response.success) {
        setPreferences({ ...preferences, [field]: value });
        setSettingsMessage({ type: 'success', text: '알림 설정이 변경되었습니다.' });
      }
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.userMessage || '알림 설정 변경에 실패했습니다.' });
    } finally {
      setPreferencesSaving(false);
    }
  };

  // 회원 탈퇴 요청
  const handleRequestDeletion = async () => {
    try {
      setDeletionLoading(true);
      const response = await ApiService.requestAccountDeletion(deletionReason || undefined);

      if (response.success) {
        alert('회원 탈퇴 요청이 완료되었습니다. 30일 이내에 복구하실 수 있습니다.');
        setDeletionDialogOpen(false);
        setDeletionReason('');
        await loadDeletionStatus();

        // 로그아웃 처리
        setTimeout(() => {
          logout();
          navigate('/');
        }, 2000);
      }
    } catch (err: any) {
      alert(err.userMessage || '회원 탈퇴 요청 중 오류가 발생했습니다.');
    } finally {
      setDeletionLoading(false);
    }
  };

  // 계정 복구
  const handleRecoverAccount = async () => {
    try {
      setDeletionLoading(true);
      const response = await ApiService.recoverAccount();

      if (response.success) {
        alert('계정이 성공적으로 복구되었습니다.');
        await loadDeletionStatus();
        await refreshUser();
      }
    } catch (err: any) {
      alert(err.userMessage || '계정 복구 중 오류가 발생했습니다.');
    } finally {
      setDeletionLoading(false);
    }
  };

  if (!user) {
    return null;
  }


  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 프로필 헤더 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={user.avatar_url}
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid',
                  borderColor: 'primary.main',
                }}
              >
                <UserIcon sx={{ fontSize: 60 }} />
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  {user.name}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                    {user.email_verified && (
                      <Chip label="인증됨" size="small" color="success" />
                    )}
                  </Box>

                  {user.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {user.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  onClick={() => setSelectedTab(2)}
                >
                  설정
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 탈퇴 대기 알림 */}
        {deletionStatus?.is_deletion_scheduled && (
          <Alert
            severity="warning"
            icon={<WarningIcon />}
            action={
              deletionStatus.can_recover && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleRecoverAccount}
                  disabled={deletionLoading}
                  startIcon={<RestoreIcon />}
                >
                  계정 복구
                </Button>
              )
            }
            sx={{ mb: 3 }}
          >
            <Typography variant="body2" fontWeight={600}>
              탈퇴 대기 중인 계정입니다
            </Typography>
            <Typography variant="caption">
              {deletionStatus.deletion_deadline &&
                `${new Date(deletionStatus.deletion_deadline).toLocaleDateString()}
                (${Math.floor(deletionStatus.days_remaining || 0)}일 후) 완전히 삭제됩니다.`}
            </Typography>
          </Alert>
        )}

        {/* 탭 */}
        <Box sx={{ mb: 3 }}>
          <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
            <Tab label={`즐겨찾기 (${favorites.length})`} />
            <Tab label={`내 리뷰 (${myReviews.length})`} />
            <Tab label="설정" icon={<SettingsIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* 즐겨찾기 탭 */}
            {selectedTab === 0 && (
              <FavoritesListView
                favorites={favorites}
                onRemoveFavorite={async (id) => {
                  try {
                    // TODO: API 호출하여 즐겨찾기 제거
                    setFavorites(favorites.filter(f => f.id !== id));
                  } catch (error) {
                    console.error('즐겨찾기 제거 실패:', error);
                  }
                }}
                onEditMemo={async (id, memo) => {
                  try {
                    const response = await ApiService.updateFavoriteMemo(id, memo);
                    if (response.success) {
                      setFavorites(favorites.map(f =>
                        f.id === id ? { ...f, memo } : f
                      ));
                    }
                  } catch (error: any) {
                    alert(error.userMessage || '메모 수정에 실패했습니다.');
                  }
                }}
                onRefresh={loadUserData}
              />
            )}

            {/* 내 리뷰 탭 */}
            {selectedTab === 1 && (
              <ReviewsListView
                reviews={myReviews}
                onDeleteReview={async (id) => {
                  try {
                    await ApiService.deleteReview(id);
                    setMyReviews(myReviews.filter(r => r.id !== id));
                  } catch (error: any) {
                    alert(error.userMessage || '리뷰 삭제에 실패했습니다.');
                  }
                }}
                onEditReview={(id) => {
                  // TODO: 리뷰 수정 모달 열기
                  alert('리뷰 수정 기능은 준비 중입니다.');
                }}
              />
            )}

            {/* 설정 탭 */}
            {selectedTab === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* 메시지 표시 */}
                {settingsMessage && (
                  <Alert
                    severity={settingsMessage.type}
                    onClose={() => setSettingsMessage(null)}
                  >
                    {settingsMessage.text}
                  </Alert>
                )}

                {/* 프로필 수정 섹션 */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <PersonIcon color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        프로필 정보
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* 프로필 이미지 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            src={imagePreview}
                            sx={{ width: 100, height: 100 }}
                          >
                            <PersonIcon sx={{ fontSize: 50 }} />
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
                              bottom: -5,
                              right: -5,
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': { backgroundColor: 'primary.dark' },
                            }}
                            size="small"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                          >
                            {uploading ? <CircularProgress size={20} color="inherit" /> : <PhotoCamera fontSize="small" />}
                          </IconButton>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            프로필 사진
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            JPG, PNG 파일 (최대 5MB)
                          </Typography>
                        </Box>
                      </Box>

                      {/* 이름 */}
                      <TextField
                        label="이름"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        fullWidth
                        required
                      />

                      {/* 전화번호 */}
                      <TextField
                        label="전화번호"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        fullWidth
                        placeholder="010-1234-5678"
                      />

                      {/* 이메일 (읽기 전용) */}
                      <TextField
                        label="이메일"
                        value={user?.email}
                        fullWidth
                        disabled
                        helperText="이메일은 변경할 수 없습니다"
                      />

                      {/* 저장 버튼 */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          startIcon={profileSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                          onClick={handleSaveProfile}
                          disabled={profileSaving || !profileForm.name}
                        >
                          {profileSaving ? '저장 중...' : '저장'}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* 언어 설정 섹션 */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <LanguageIcon color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        언어 설정
                      </Typography>
                    </Box>

                    <FormControl fullWidth>
                      <InputLabel>언어</InputLabel>
                      <Select
                        value={preferences.preferred_language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        label="언어"
                        disabled={preferencesSaving}
                      >
                        <MenuItem value="ko">한국어</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="ja">日本語</MenuItem>
                        <MenuItem value="zh">中文</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>

                {/* 테마 설정 섹션 */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <PaletteIcon color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        테마 설정
                      </Typography>
                    </Box>

                    <FormControl fullWidth>
                      <InputLabel>테마</InputLabel>
                      <Select
                        value={preferences.theme}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        label="테마"
                        disabled={preferencesSaving}
                      >
                        <MenuItem value="light">라이트 모드</MenuItem>
                        <MenuItem value="dark">다크 모드</MenuItem>
                        <MenuItem value="auto">시스템 설정 따르기</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>

                {/* 알림 설정 섹션 */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <NotificationsIcon color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        알림 설정
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.notification_enabled}
                            onChange={(e) => handleNotificationChange('notification_enabled', e.target.checked)}
                            disabled={preferencesSaving}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1">푸시 알림</Typography>
                            <Typography variant="caption" color="text.secondary">
                              새로운 이벤트, 댓글 등에 대한 알림을 받습니다
                            </Typography>
                          </Box>
                        }
                      />

                      <Divider />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.email_notification}
                            onChange={(e) => handleNotificationChange('email_notification', e.target.checked)}
                            disabled={preferencesSaving}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1">이메일 알림</Typography>
                            <Typography variant="caption" color="text.secondary">
                              중요한 공지사항을 이메일로 받습니다
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* 계정 관리 섹션 */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      계정 관리
                    </Typography>

                    {deletionStatus?.is_deletion_scheduled ? (
                      <Alert
                        severity="warning"
                        icon={<WarningIcon />}
                        sx={{ mb: 3 }}
                      >
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          탈퇴 대기 중인 계정입니다
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {deletionStatus.deletion_deadline &&
                            `${new Date(deletionStatus.deletion_deadline).toLocaleDateString()}
                            (${Math.floor(deletionStatus.days_remaining || 0)}일 후) 완전히 삭제됩니다.`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                          30일 이내에 계정을 복구할 수 있습니다. 복구 후에는 정상적으로 서비스를 이용하실 수 있습니다.
                        </Typography>
                        {deletionStatus.can_recover && (
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<RestoreIcon />}
                            onClick={handleRecoverAccount}
                            disabled={deletionLoading}
                          >
                            계정 복구하기
                          </Button>
                        )}
                      </Alert>
                    ) : (
                      <Box>
                        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            회원 탈퇴 시 주의사항
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                            • 탈퇴 요청 후 30일간 유예기간이 제공됩니다.
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                            • 유예기간 동안 로그인이 불가하며, 계정 복구를 요청할 수 있습니다.
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                            • 30일이 지나면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                          </Typography>
                          <Typography variant="caption" component="div">
                            • 작성한 리뷰, 즐겨찾기 등 모든 활동 내역이 삭제됩니다.
                          </Typography>
                        </Alert>

                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteForeverIcon />}
                          onClick={() => setDeletionDialogOpen(true)}
                          fullWidth
                        >
                          회원 탈퇴
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </>
        )}
      </Container>

      {/* 회원 탈퇴 확인 다이얼로그 */}
      <Dialog
        open={deletionDialogOpen}
        onClose={() => !deletionLoading && setDeletionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" />
            <Typography variant="h6" fontWeight={700}>
              정말 탈퇴하시겠습니까?
            </Typography>
          </Box>
          <IconButton
            onClick={() => setDeletionDialogOpen(false)}
            disabled={deletionLoading}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              회원 탈퇴 시 주의사항
            </Typography>
            <Typography variant="caption" component="div">
              • 탈퇴 요청 후 30일간 유예기간이 제공됩니다<br />
              • 유예기간 동안 로그인이 불가하며, 계정 복구를 요청할 수 있습니다<br />
              • 30일이 지나면 모든 데이터가 영구적으로 삭제됩니다<br />
              • 작성한 리뷰, 즐겨찾기 등 모든 활동 내역이 삭제됩니다
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="탈퇴 사유 (선택사항)"
            placeholder="탈퇴하시는 이유를 알려주시면 서비스 개선에 도움이 됩니다."
            value={deletionReason}
            onChange={(e) => setDeletionReason(e.target.value)}
            disabled={deletionLoading}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeletionDialogOpen(false)} disabled={deletionLoading}>
            취소
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRequestDeletion}
            disabled={deletionLoading}
            startIcon={deletionLoading ? <CircularProgress size={20} /> : <DeleteForeverIcon />}
          >
            {deletionLoading ? '처리 중...' : '탈퇴하기'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default UserProfilePage;
