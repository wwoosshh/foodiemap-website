import axios from 'axios';
import { ApiResponse, AuthData, Restaurant, PaginationData } from '../types';

// API Base URL - Render 배포 주소
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://foodiemap-backend.onrender.com';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - JWT 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    // CORS 에러 처리
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - possible CORS issue');
    }

    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      localStorage.removeItem('user_token');
    }
    return Promise.reject(error);
  }
);

// API 서비스 클래스
export class ApiService {

  // 일반 사용자 회원가입
  static async userRegister(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<ApiResponse<AuthData>> {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  }

  // 일반 사용자 로그인
  static async userLogin(email: string, password: string): Promise<ApiResponse<AuthData>> {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  }

  // 공개 맛집 목록 조회 (로그인 불필요)
  static async getPublicRestaurants(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  } = {}): Promise<ApiResponse<PaginationData<Restaurant>>> {
    const response = await api.get('/api/restaurants', { params });
    return response.data;
  }

  // 건강 상태 확인
  static async healthCheck(): Promise<any> {
    const response = await api.get('/health');
    return response.data;
  }
}

export default api;