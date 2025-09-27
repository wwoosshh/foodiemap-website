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

// 사용자 친화적인 에러 메시지 매핑
const getErrorMessage = (error: any): string => {
  const response = error.response;
  const data = response?.data;

  // 백엔드에서 전달한 구체적인 메시지가 있는 경우
  if (data?.message) {
    // 특정 검증 오류들을 사용자 친화적으로 변환
    const message = data.message;

    if (message.includes('자신의 리뷰에는 도움이 돼요를 누를 수 없습니다')) {
      return '본인이 작성한 리뷰에는 도움이 돼요를 누를 수 없습니다.';
    }
    if (message.includes('이미 이 맛집에 대한 리뷰를 작성하셨습니다')) {
      return '이미 이 맛집에 리뷰를 작성하셨습니다. 기존 리뷰를 수정하거나 삭제 후 다시 작성해주세요.';
    }
    if (message.includes('내용은 10-2000자여야 합니다')) {
      return '리뷰 내용은 10자 이상 2000자 이하로 작성해주세요.';
    }
    if (message.includes('제목은 1-100자여야 합니다')) {
      return '리뷰 제목은 1자 이상 100자 이하로 작성해주세요.';
    }
    if (message.includes('댓글 내용은 1-1000자여야 합니다')) {
      return '댓글은 1자 이상 1000자 이하로 작성해주세요.';
    }
    if (message.includes('평점은 1-5 사이의 정수여야 합니다')) {
      return '평점은 1점부터 5점까지 선택해주세요.';
    }

    // 기본적으로 백엔드 메시지를 그대로 사용
    return message;
  }

  // HTTP 상태 코드별 기본 메시지
  switch (response?.status) {
    case 400:
      return '입력하신 정보를 다시 확인해주세요.';
    case 401:
      return '로그인이 필요한 서비스입니다.';
    case 403:
      return '이 작업을 수행할 권한이 없습니다.';
    case 404:
      return '요청하신 정보를 찾을 수 없습니다.';
    case 409:
      return '이미 처리된 요청입니다. 페이지를 새로고침해주세요.';
    case 500:
      return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
};

// Response interceptor - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    // CORS 에러 처리
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - possible CORS issue');
      error.userMessage = '네트워크 연결을 확인해주세요.';
    } else {
      // 사용자 친화적인 에러 메시지 추가
      error.userMessage = getErrorMessage(error);
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

  // === 맛집 상세 정보 API ===

  // 맛집 상세 정보 조회 (조회수 증가 포함)
  static async getRestaurantDetails(restaurantId: string): Promise<ApiResponse<{ restaurant: any }>> {
    const response = await api.get(`/api/restaurants/${restaurantId}/details`);
    return response.data;
  }

  // === 즐겨찾기 API ===

  // 즐겨찾기 추가
  static async addToFavorites(restaurantId: string): Promise<ApiResponse<any>> {
    const response = await api.post(`/api/restaurants/${restaurantId}/favorite`);
    return response.data;
  }

  // 즐겨찾기 제거
  static async removeFromFavorites(restaurantId: string): Promise<ApiResponse<any>> {
    const response = await api.delete(`/api/restaurants/${restaurantId}/favorite`);
    return response.data;
  }

  // 즐겨찾기 상태 확인
  static async getFavoriteStatus(restaurantId: string): Promise<ApiResponse<{ is_favorited: boolean }>> {
    const response = await api.get(`/api/restaurants/${restaurantId}/favorite/status`);
    return response.data;
  }

  // 사용자 즐겨찾기 목록 조회
  static async getUserFavorites(): Promise<ApiResponse<{ favorites: any[] }>> {
    const response = await api.get('/api/restaurants/favorites/my');
    return response.data;
  }
}

export default api;