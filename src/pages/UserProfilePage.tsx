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
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
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
  const { setThemeMode } = useThemeContext();
  const { setLanguage, t } = useLanguage();

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
        const theme = response.data.theme || 'light';
        const lang = response.data.preferred_language || 'ko';
        setPreferences({
          preferred_language: lang,
          theme,
          notification_enabled: response.data.notification_enabled !== false,
          email_notification: response.data.email_notification !== false,
        });
        // 테마를 실제로 적용 (ThemeContext에 반영)
        setThemeMode(theme as 'light' | 'dark' | 'auto');
        // 언어를 실제로 적용 (LanguageContext에 반영)
        setLanguage(lang as 'ko' | 'en' | 'ja' | 'zh');
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
      setSettingsMessage({ type: 'error', text: t.profile.imageSizeError });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setSettingsMessage({ type: 'error', text: t.profile.imageTypeError });
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
          setSettingsMessage({ type: 'success', text: t.profile.imageUploaded });
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.userMessage || t.profile.imageUploadFailed });
    } finally {
      setUploading(false);
    }
  };

  // 프로필 정보 저장
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setSettingsMessage(null);

    try {
      // 업데이트할 데이터 준비 (빈 문자열이나 undefined 제거)
      const updateData: any = {
        name: profileForm.name,
      };

      // phone이 유효한 경우에만 추가
      if (profileForm.phone && profileForm.phone.trim()) {
        updateData.phone = profileForm.phone.trim();
      }

      // avatar_url이 유효한 URL인 경우에만 추가
      if (profileForm.avatar_url && profileForm.avatar_url.trim()) {
        updateData.avatar_url = profileForm.avatar_url.trim();
      }

      const response = await ApiService.updateProfile(updateData);

      if (response.success) {
        await refreshUser();
        setSettingsMessage({ type: 'success', text: t.profile.profileUpdated });
      }
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.userMessage || t.profile.profileUpdateFailed });
    } finally {
      setProfileSaving(false);
    }
  };

  // 언어 설정 변경
  const handleLanguageChange = async (lang: string) => {
    setPreferencesSaving(true);
    setSettingsMessage(null);

    try {
      const response = await ApiService.changeLanguage(lang);
      if (response.success) {
        setPreferences({ ...preferences, preferred_language: lang });
        // 언어를 실제로 적용 (즉시 UI에 반영)
        setLanguage(lang as 'ko' | 'en' | 'ja' | 'zh');
        setSettingsMessage({ type: 'success', text: t.profile.languageChanged });
      }
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.userMessage || t.profile.languageChangeFailed });
    } finally {
      setPreferencesSaving(false);
    }
  };

  // 테마 설정 변경
  const handleThemeChange = async (theme: string) => {
    setPreferencesSaving(true);
    setSettingsMessage(null);

    try {
      const response = await ApiService.changeTheme(theme);
      if (response.success) {
        setPreferences({ ...preferences, theme });
        // 테마를 실제로 적용 (즉시 UI에 반영)
        setThemeMode(theme as 'light' | 'dark' | 'auto');
        setSettingsMessage({ type: 'success', text: t.profile.themeChanged });
      }
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.userMessage || t.profile.themeChangeFailed });
    } finally {
      setPreferencesSaving(false);
    }
  };

  // 알림 설정 변경
  const handleNotificationChange = async (field: string, value: boolean) => {
    setPreferencesSaving(true);
    setSettingsMessage(null);

    try {
      const response = await ApiService.changeNotificationSettings({
        notification_enabled: field === 'notification_enabled' ? value : preferences.notification_enabled,
        email_notification: field === 'email_notification' ? value : preferences.email_notification,
      });

      if (response.success) {
        setPreferences({ ...preferences, [field]: value });
        setSettingsMessage({ type: 'success', text: t.profile.notificationsChanged });
      }
    } catch (err: any) {
      setSettingsMessage({ type: 'error', text: err.userMessage || t.profile.notificationChangeFailed });
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
        alert(t.profile.deletionRequestComplete);
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
      alert(err.userMessage || t.profile.deletionRequestFailed);
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
        alert(t.profile.accountRecovered);
        await loadDeletionStatus();
        await refreshUser();
      }
    } catch (err: any) {
      alert(err.userMessage || t.profile.accountRecoveryFailed);
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                        {user.email}
                      </Typography>
                      {user.email_verified && (
                        <Chip label={t.profile.verified} size="small" color="success" sx={{ alignSelf: 'flex-start' }} />
                      )}
                    </Box>
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
                  {t.profile.settings}
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
                  {t.profile.recoverAccount}
                </Button>
              )
            }
            sx={{ mb: 3 }}
          >
            <Typography variant="body2" fontWeight={600}>
              {t.profile.deletionPending}
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
            <Tab label={`${t.profile.myFavorites} (${favorites.length})`} />
            <Tab label={`${t.profile.myReviews} (${myReviews.length})`} />
            <Tab label={t.profile.settings} icon={<SettingsIcon />} iconPosition="start" />
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
                    alert(error.userMessage || t.profile.memoUpdateFailed);
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
                    alert(error.userMessage || t.profile.reviewDeleteFailed);
                  }
                }}
                onEditReview={(id) => {
                  // TODO: 리뷰 수정 모달 열기
                  alert(t.profile.reviewEditComingSoon);
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
                        {t.profile.profileInfo}
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
                            {t.profile.profilePhoto}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t.profile.fileTypeInfo}
                          </Typography>
                        </Box>
                      </Box>

                      {/* 이름 */}
                      <TextField
                        label={t.profile.name}
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        fullWidth
                        required
                      />

                      {/* 전화번호 */}
                      <TextField
                        label={t.profile.phone}
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        fullWidth
                        placeholder={t.profile.phonePlaceholder}
                      />

                      {/* 이메일 (읽기 전용) */}
                      <TextField
                        label={t.profile.email}
                        value={user?.email}
                        fullWidth
                        disabled
                        helperText={t.profile.emailReadOnly}
                      />

                      {/* 저장 버튼 */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          startIcon={profileSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                          onClick={handleSaveProfile}
                          disabled={profileSaving || !profileForm.name}
                        >
                          {profileSaving ? t.profile.saving : t.common.save}
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
                        {t.profile.languageSettings}
                      </Typography>
                    </Box>

                    <FormControl fullWidth>
                      <InputLabel>{t.profile.language}</InputLabel>
                      <Select
                        value={preferences.preferred_language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        label={t.profile.language}
                        disabled={preferencesSaving}
                      >
                        <MenuItem value="ko">{t.profile.korean}</MenuItem>
                        <MenuItem value="en">{t.profile.english}</MenuItem>
                        <MenuItem value="ja">{t.profile.japanese}</MenuItem>
                        <MenuItem value="zh">{t.profile.chinese}</MenuItem>
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
                        {t.profile.themeSettings}
                      </Typography>
                    </Box>

                    <FormControl fullWidth>
                      <InputLabel>{t.profile.theme}</InputLabel>
                      <Select
                        value={preferences.theme}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        label={t.profile.theme}
                        disabled={preferencesSaving}
                      >
                        <MenuItem value="light">{t.profile.lightMode}</MenuItem>
                        <MenuItem value="dark">{t.profile.darkMode}</MenuItem>
                        <MenuItem value="auto">{t.profile.autoMode}</MenuItem>
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
                        {t.profile.notificationSettings}
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
                            <Typography variant="body1">{t.profile.pushNotifications}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t.profile.pushNotificationDesc}
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
                            <Typography variant="body1">{t.profile.emailNotifications}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t.profile.emailNotificationDesc}
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
                      {t.profile.accountManagement}
                    </Typography>

                    {deletionStatus?.is_deletion_scheduled ? (
                      <Alert
                        severity="warning"
                        icon={<WarningIcon />}
                        sx={{ mb: 3 }}
                      >
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          {t.profile.deletionPending}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {deletionStatus.deletion_deadline &&
                            `${new Date(deletionStatus.deletion_deadline).toLocaleDateString()}
                            (${Math.floor(deletionStatus.days_remaining || 0)}일 후) 완전히 삭제됩니다.`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                          {t.profile.recoveryPeriodInfo}
                        </Typography>
                        {deletionStatus.can_recover && (
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<RestoreIcon />}
                            onClick={handleRecoverAccount}
                            disabled={deletionLoading}
                          >
                            {t.profile.recoverAccountButton}
                          </Button>
                        )}
                      </Alert>
                    ) : (
                      <Box>
                        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            {t.profile.deletionWarningTitle}
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                            • {t.profile.deletionWarning1}
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                            • {t.profile.deletionWarning2}
                          </Typography>
                          <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                            • {t.profile.deletionWarning3}
                          </Typography>
                          <Typography variant="caption" component="div">
                            • {t.profile.deletionWarning4}
                          </Typography>
                        </Alert>

                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteForeverIcon />}
                          onClick={() => setDeletionDialogOpen(true)}
                          fullWidth
                        >
                          {t.profile.deleteAccount}
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
              {t.profile.deletionDialogTitle}
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
              {t.profile.deletionWarningTitle}
            </Typography>
            <Typography variant="caption" component="div">
              • {t.profile.deletionWarning1}<br />
              • {t.profile.deletionWarning2}<br />
              • {t.profile.deletionWarning3}<br />
              • {t.profile.deletionWarning4}
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={4}
            label={t.profile.deletionReason}
            placeholder={t.profile.deletionReasonPlaceholder}
            value={deletionReason}
            onChange={(e) => setDeletionReason(e.target.value)}
            disabled={deletionLoading}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeletionDialogOpen(false)} disabled={deletionLoading}>
            {t.common.cancel}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRequestDeletion}
            disabled={deletionLoading}
            startIcon={deletionLoading ? <CircularProgress size={20} /> : <DeleteForeverIcon />}
          >
            {deletionLoading ? t.profile.processing : t.profile.withdraw}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default UserProfilePage;
