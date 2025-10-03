import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { initKakao, loginWithKakao } from '../utils/kakao';
import { loginWithNaver } from '../utils/naver';
import { ApiService } from '../services/api';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { login, register, isLoading, setUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);

  // 카카오 SDK 초기화
  useEffect(() => {
    initKakao().catch((err) => {
      console.error('카카오 SDK 초기화 실패:', err);
    });
  }, []);

  // 로그인 폼 상태
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // 회원가입 폼 상태
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        onClose();
        // 로그인 성공 시 폼 초기화
        setLoginData({ email: '', password: '' });
      } else {
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    } catch (error: any) {
      setError(error.message || '로그인에 실패했습니다.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!registerData.email || !registerData.password || !registerData.name) {
      setError('이메일, 비밀번호, 이름은 필수 입력 항목입니다.');
      return;
    }

    if (registerData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
      const success = await register({
        email: registerData.email,
        password: registerData.password,
        name: registerData.name,
        phone: registerData.phone || undefined,
      });

      if (success) {
        onClose();
        // 회원가입 성공 시 폼 초기화
        setRegisterData({ email: '', password: '', name: '', phone: '' });
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error: any) {
      setError(error.message || '회원가입에 실패했습니다.');
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google 로그인 오류:', error);
        setError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('Google 로그인 예외:', err);
      setError('Google 로그인 중 오류가 발생했습니다.');
    }
  };

  // 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    try {
      setSocialLoading(true);
      setError('');

      // 카카오 SDK 준비 확인
      await initKakao();

      const userData = await loginWithKakao();
      console.log('카카오 사용자 정보:', userData);

      // 백엔드로 사용자 정보 전송
      const response = await ApiService.socialLogin(userData);

      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem('user_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        setUser(user || null);
        onClose();
      }
    } catch (error: any) {
      console.error('카카오 로그인 오류:', error);
      setError(error.userMessage || '카카오 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSocialLoading(false);
    }
  };

  // 네이버 로그인 핸들러
  const handleNaverLogin = async () => {
    try {
      setSocialLoading(true);
      setError('');

      const userData = await loginWithNaver();
      console.log('네이버 사용자 정보:', userData);

      // 백엔드로 사용자 정보 전송
      const response = await ApiService.socialLogin(userData);

      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem('user_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        setUser(user || null);
        onClose();
      }
    } catch (error: any) {
      console.error('네이버 로그인 오류:', error);
      setError(error.userMessage || '네이버 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 400,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="div" fontWeight={600}>
          Cube
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
            }}
          >
            <Tab label="로그인" />
            <Tab label="회원가입" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* 로그인 탭 */}
        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleLogin} sx={{ px: 3 }}>
            {/* Google 로그인 버튼 */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoogleLogin}
              disabled={isLoading || socialLoading}
              sx={{
                mt: 1,
                mb: 1,
                py: 1.5,
                borderColor: '#dadce0',
                color: '#3c4043',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#d2d3d4',
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              <Box
                component="svg"
                sx={{ width: 18, height: 18, mr: 2 }}
                viewBox="0 0 24 24"
              >
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </Box>
              Google로 계속하기
            </Button>

            {/* 카카오 로그인 버튼 */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleKakaoLogin}
              disabled={isLoading || socialLoading}
              sx={{
                mb: 1,
                py: 1.5,
                backgroundColor: '#FEE500',
                color: '#000000',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#FDD835'
                }
              }}
            >
              카카오로 계속하기
            </Button>

            {/* 네이버 로그인 버튼 */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleNaverLogin}
              disabled={isLoading || socialLoading}
              sx={{
                mb: 2,
                py: 1.5,
                backgroundColor: '#03C75A',
                color: '#ffffff',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#02B350'
                }
              }}
            >
              네이버로 계속하기
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                또는
              </Typography>
            </Divider>

            <TextField
              fullWidth
              label="이메일"
              type="email"
              variant="outlined"
              margin="normal"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>
        </TabPanel>

        {/* 회원가입 탭 */}
        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handleRegister} sx={{ px: 3 }}>
            {/* Google 회원가입 버튼 */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoogleLogin}
              disabled={isLoading || socialLoading}
              sx={{
                mt: 1,
                mb: 1,
                py: 1.5,
                borderColor: '#dadce0',
                color: '#3c4043',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#d2d3d4',
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              <Box
                component="svg"
                sx={{ width: 18, height: 18, mr: 2 }}
                viewBox="0 0 24 24"
              >
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </Box>
              Google로 계속하기
            </Button>

            {/* 카카오 회원가입 버튼 */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleKakaoLogin}
              disabled={isLoading || socialLoading}
              sx={{
                mb: 1,
                py: 1.5,
                backgroundColor: '#FEE500',
                color: '#000000',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#FDD835'
                }
              }}
            >
              카카오로 계속하기
            </Button>

            {/* 네이버 회원가입 버튼 */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleNaverLogin}
              disabled={isLoading || socialLoading}
              sx={{
                mb: 2,
                py: 1.5,
                backgroundColor: '#03C75A',
                color: '#ffffff',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#02B350'
                }
              }}
            >
              네이버로 계속하기
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                또는
              </Typography>
            </Divider>

            <TextField
              fullWidth
              label="이름"
              variant="outlined"
              margin="normal"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="이메일"
              type="email"
              variant="outlined"
              margin="normal"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="전화번호 (선택)"
              variant="outlined"
              margin="normal"
              value={registerData.phone}
              onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
              disabled={isLoading}
              placeholder="010-1234-5678"
            />
            <TextField
              fullWidth
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              disabled={isLoading}
              helperText="6자 이상 입력해주세요"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>
          </Box>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;