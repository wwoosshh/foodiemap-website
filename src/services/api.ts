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
    category_id?: number;
  } = {}): Promise<ApiResponse<PaginationData<Restaurant>>> {
    const response = await api.get('/api/restaurants', { params });
    return response.data;
  }

  // 공개 배너 목록 조회 (로그인 불필요)
  static async getPublicBanners(): Promise<ApiResponse<{ banners: Banner[] }>> {
    const response = await api.get('/api/banners');
    return response.data;
  }

  // 공개 카테고리 목록 조회 (로그인 불필요)
  static async getPublicCategories(): Promise<ApiResponse<{ categories: any[] }>> {
    const response = await api.get('/api/categories');
    return response.data;
  }

  // 건강 상태 확인
  static async healthCheck(): Promise<any> {
    const response = await api.get('/health');
    return response.data;
  }

  // === 댓글 API ===

  // 맛집 댓글 목록 조회
  static async getRestaurantComments(restaurantId: string, params: {
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<{
    comments: any[];
    total: number;
    limit: number;
    offset: number;
  }>> {
    const response = await api.get(`/api/comments/${restaurantId}`, { params });
    return response.data;
  }

  // 댓글 작성
  static async createComment(data: {
    restaurant_id: string;
    content: string;
    parent_id?: string;
  }): Promise<ApiResponse<any>> {
    const response = await api.post('/api/comments', data);
    return response.data;
  }

  // 댓글 좋아요 토글
  static async toggleCommentLike(commentId: string): Promise<ApiResponse<{
    comment_id: string;
    is_liked: boolean;
    likes_count: number;
  }>> {
    const response = await api.post(`/api/comments/${commentId}/like`);
    return response.data;
  }

  // 댓글 삭제
  static async deleteComment(commentId: string): Promise<ApiResponse<{ comment_id: string }>> {
    const response = await api.delete(`/api/comments/${commentId}`);
    return response.data;
  }

  // === 리뷰 API ===

  // 맛집 리뷰 목록 조회
  static async getRestaurantReviews(restaurantId: string, params: {
    limit?: number;
    offset?: number;
    sort?: 'newest' | 'oldest' | 'rating_desc' | 'rating_asc' | 'helpful';
  } = {}): Promise<ApiResponse<{
    reviews: any[];
    total: number;
    limit: number;
    offset: number;
  }>> {
    const response = await api.get(`/api/reviews/${restaurantId}`, { params });
    return response.data;
  }

  // 맛집 리뷰 통계 조회
  static async getRestaurantReviewStats(restaurantId: string): Promise<ApiResponse<{
    average_rating: number;
    total_reviews: number;
    rating_distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  }>> {
    const response = await api.get(`/api/reviews/${restaurantId}/stats`);
    return response.data;
  }

  // 리뷰 작성
  static async createReview(data: {
    restaurant_id: string;
    rating: number;
    title: string;
    content: string;
    images?: string[];
    tags?: string[];
  }): Promise<ApiResponse<any>> {
    const response = await api.post('/api/reviews', data);
    return response.data;
  }

  // 리뷰 수정
  static async updateReview(reviewId: string, data: {
    rating: number;
    title: string;
    content: string;
    images?: string[];
    tags?: string[];
  }): Promise<ApiResponse<any>> {
    const response = await api.put(`/api/reviews/${reviewId}`, data);
    return response.data;
  }

  // 리뷰 도움이 돼요 토글
  static async toggleReviewHelpful(reviewId: string): Promise<ApiResponse<{
    review_id: string;
    is_helpful: boolean;
    helpful_count: number;
  }>> {
    const response = await api.post(`/api/reviews/${reviewId}/helpful`);
    return response.data;
  }

  // 리뷰 삭제
  static async deleteReview(reviewId: string): Promise<ApiResponse<{ review_id: string }>> {
    const response = await api.delete(`/api/reviews/${reviewId}`);
    return response.data;
  }
}

export default api;