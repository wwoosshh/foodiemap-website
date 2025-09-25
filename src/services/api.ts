import axios from 'axios';
import { ApiResponse, AuthData, Restaurant, PaginationData, Banner } from '../types';

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

  // 공개 배너 목록 조회 (로그인 불필요)
  static async getPublicBanners(): Promise<ApiResponse<{ banners: Banner[] }>> {
    try {
      const response = await api.get('/api/banners');
      return response.data;
    } catch (error) {
      // API 오류 시 더미 데이터 반환
      const dummyBanners: Banner[] = [
        {
          id: 'banner-1',
          title: '프리미엄 레스토랑 특별 할인',
          description: '5성급 요리사가 만드는 특별한 요리를 20% 할인된 가격으로 만나보세요.',
          image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          link_url: 'https://example.com/premium-discount',
          is_active: true,
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'banner-2',
          title: '신규 오픈 이탈리아 레스토랑',
          description: '정통 이탈리아 요리와 와인을 즐길 수 있는 새로운 공간이 문을 열었습니다.',
          image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          link_url: 'https://example.com/italian-opening',
          is_active: true,
          sort_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'banner-3',
          title: '럭셔리 다이닝 체험',
          description: '미슐랭 스타 셰프의 코스 요리와 함께하는 특별한 저녁 시간을 경험해보세요.',
          image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          link_url: 'https://example.com/luxury-dining',
          is_active: true,
          sort_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      return {
        success: true,
        message: '배너를 성공적으로 불러왔습니다.',
        data: { banners: dummyBanners }
      };
    }
  }

  // 건강 상태 확인
  static async healthCheck(): Promise<any> {
    const response = await api.get('/health');
    return response.data;
  }
}

export default api;