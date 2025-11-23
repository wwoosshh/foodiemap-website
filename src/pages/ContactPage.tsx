import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import { Email, Send } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

const ADMIN_EMAIL = 'nunconnect1@gmail.com';
const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_xlxnxfBn'; // 카카오톡 채널 URL (실제 URL로 변경 필요)

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = t.contactPage.requiredField;
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.contactPage.requiredField;
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t.contactPage.invalidEmail;
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t.contactPage.requiredField;
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.contactPage.requiredField;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 백엔드 API를 통해 이메일 발송
      const response = await ApiService.sendContactEmail({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (response.success) {
        setSnackbar({
          open: true,
          message: t.contactPage.successMessage,
          severity: 'success',
        });

        // 폼 초기화
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error(response.message || '문의 전송에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Contact Error:', error);
      setSnackbar({
        open: true,
        message: error.userMessage || t.contactPage.errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${ADMIN_EMAIL}`;
  };

  const handleKakaoClick = () => {
    window.open(KAKAO_CHANNEL_URL, '_blank');
  };

  return (
    <MainLayout>
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #0D0D0D 0%, #121212 100%)'
            : 'linear-gradient(180deg, #FFF5F0 0%, #FFFBF8 100%)',
          minHeight: '100vh',
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          {/* 헤더 */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h3"
              fontWeight={800}
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              {t.contactPage.title}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              {t.contactPage.subtitle}
            </Typography>
          </Box>

          {/* 빠른 문의 카드 */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
              {t.contactPage.quickContact}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                }}
                onClick={handleEmailClick}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" fontWeight={700}>
                      {t.contactPage.emailContact}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {t.contactPage.emailContactDescription}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="primary.main">
                    {ADMIN_EMAIL}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Email />}
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    {t.contactPage.sendEmail}
                  </Button>
                </CardContent>
              </Card>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  },
                }}
                onClick={handleKakaoClick}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#FEE500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <Typography sx={{ color: '#000', fontWeight: 700 }}>K</Typography>
                    </Box>
                    <Typography variant="h5" fontWeight={700}>
                      {t.contactPage.kakaoContact}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {t.contactPage.kakaoContactDescription}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      backgroundColor: '#FEE500',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#FFD700',
                      },
                    }}
                  >
                    {t.contactPage.openKakao}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* 사이트 내 문의 폼 */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : '#FFFFFF',
            }}
          >
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
              {t.contactPage.directContact}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {t.contactPage.directContactDescription}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 3,
                  }}
                >
                  <TextField
                    fullWidth
                    label={t.contactPage.name}
                    placeholder={t.contactPage.namePlaceholder}
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                  <TextField
                    fullWidth
                    type="email"
                    label={t.contactPage.email}
                    placeholder={t.contactPage.emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Box>
                <TextField
                  fullWidth
                  label={t.contactPage.subject}
                  placeholder={t.contactPage.subjectPlaceholder}
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  error={!!errors.subject}
                  helperText={errors.subject}
                  required
                />
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label={t.contactPage.message}
                  placeholder={t.contactPage.messagePlaceholder}
                  value={formData.message}
                  onChange={handleChange('message')}
                  error={!!errors.message}
                  helperText={errors.message}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<Send />}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                  }}
                >
                  {loading ? t.contactPage.sending : t.contactPage.submit}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default ContactPage;
