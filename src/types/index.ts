// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  email_verified: boolean;
  auth_provider?: string;
  created_at: string;
}


// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  category_id: string; // UUID로 변경
  rating: number;
  review_count: number;
  view_count?: number;
  favorite_count?: number;
  images: string[];
  created_at: string;
  categories?: {
    id: string; // UUID로 변경
    name: string;
    icon?: string;
  };
}

// Category types
export interface Category {
  id: string; // UUID로 변경
  name: string;
  icon?: string;
  color?: string;
}

// Review types
export interface Review {
  id: string;
  user_id: string;
  restaurant_id: string;
  rating: number;
  comment?: string;
  images: string[];
  created_at: string;
  user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginationData<T> {
  items?: T[];
  users?: T[];
  restaurants?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth types
export interface AuthData {
  user?: User;
  token: string;
}

// Banner types
export interface Banner {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

