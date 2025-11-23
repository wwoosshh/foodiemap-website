/**
 * SEO 최적화 유틸리티
 * 페이지별 메타 태그, Open Graph, Twitter Card 관리
 */

export interface MetaTagData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'restaurant';
  author?: string;
}

/**
 * 메타 태그 업데이트
 * @param data 메타 태그 데이터
 */
export const updateMetaTags = (data: MetaTagData) => {
  // Title
  document.title = data.title;

  // Meta Description
  updateMetaTag('name', 'description', data.description);

  // Keywords
  if (data.keywords) {
    updateMetaTag('name', 'keywords', data.keywords);
  }

  // Author
  if (data.author) {
    updateMetaTag('name', 'author', data.author);
  }

  // Open Graph (Facebook, LinkedIn, KakaoTalk)
  updateMetaTag('property', 'og:title', data.title);
  updateMetaTag('property', 'og:description', data.description);
  updateMetaTag('property', 'og:type', data.type || 'website');
  updateMetaTag('property', 'og:site_name', 'FoodieMap');
  updateMetaTag('property', 'og:locale', 'ko_KR');

  if (data.url) {
    updateMetaTag('property', 'og:url', data.url);
  }

  if (data.image) {
    updateMetaTag('property', 'og:image', data.image);
    updateMetaTag('property', 'og:image:width', '1200');
    updateMetaTag('property', 'og:image:height', '630');
    updateMetaTag('property', 'og:image:alt', data.title);
  }

  // Twitter Card
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', data.title);
  updateMetaTag('name', 'twitter:description', data.description);

  if (data.image) {
    updateMetaTag('name', 'twitter:image', data.image);
  }

  // Mobile
  updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1, maximum-scale=5');
  updateMetaTag('name', 'format-detection', 'telephone=no');

  // Naver
  updateMetaTag('name', 'naver-site-verification', '');  // Naver Search Advisor에서 발급받은 코드 입력
};

/**
 * 메타 태그 요소 업데이트 또는 생성
 */
const updateMetaTag = (attr: string, key: string, content: string) => {
  let element = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

/**
 * 기본 메타 태그 (모든 페이지 공통)
 */
export const DEFAULT_META = {
  title: 'FoodieMap - 대한민국 맛집 지도 | 믿을 수 있는 맛집 추천',
  description: '전국 맛집 정보와 리얼 리뷰를 한눈에! 평점, 사진, 위치 정보로 내 주변 최고의 맛집을 찾아보세요. 서울, 부산, 대구, 인천 등 전국 맛집 추천.',
  keywords: '맛집, 맛집 추천, 음식점, 레스토랑, 맛집 지도, 맛집 리뷰, 서울 맛집, 부산 맛집, 대구 맛집, 인천 맛집, 음식점 추천, 맛집 검색',
  image: 'https://mzcube.com/og-image.jpg',
  url: 'https://mzcube.com',
  type: 'website' as const,
  author: 'FoodieMap Team'
};

/**
 * 맛집 상세 페이지용 메타 태그 생성
 */
export const generateRestaurantMeta = (restaurant: any): MetaTagData => {
  const categoryName = restaurant.categories?.name || '맛집';
  const address = restaurant.address || restaurant.road_address || '';
  const region = address.split(' ')[0] || '대한민국';

  return {
    title: `${restaurant.name} - ${categoryName} | FoodieMap`,
    description: `${restaurant.description || restaurant.name} | ${address} | ⭐ ${restaurant.rating}/5 (리뷰 ${restaurant.review_count}개) | ${categoryName} 맛집 추천`,
    keywords: `${restaurant.name}, ${categoryName}, ${region} 맛집, 맛집 추천, ${restaurant.name} 후기, ${restaurant.name} 리뷰`,
    image: restaurant.images?.[0] || DEFAULT_META.image,
    url: `https://mzcube.com/restaurant/${restaurant.id}`,
    type: 'restaurant' as const
  };
};

/**
 * 카테고리 페이지용 메타 태그 생성
 */
export const generateCategoryMeta = (categoryName: string, region?: string): MetaTagData => {
  const locationText = region ? `${region} ` : '전국 ';

  return {
    title: `${locationText}${categoryName} 맛집 추천 | FoodieMap`,
    description: `${locationText}최고의 ${categoryName} 맛집을 찾아보세요. 실제 이용자 리뷰와 평점을 기반으로 한 믿을 수 있는 ${categoryName} 맛집 추천 정보를 제공합니다.`,
    keywords: `${categoryName}, ${categoryName} 맛집, ${locationText}${categoryName}, ${categoryName} 추천, ${categoryName} 리뷰`,
    url: `https://mzcube.com/category/${categoryName}`,
    type: 'website' as const
  };
};

/**
 * 검색 결과 페이지용 메타 태그 생성
 */
export const generateSearchMeta = (keyword: string): MetaTagData => {
  return {
    title: `'${keyword}' 검색 결과 | FoodieMap`,
    description: `'${keyword}' 관련 맛집 검색 결과입니다. 리뷰, 평점, 위치 정보를 확인하고 나에게 딱 맞는 맛집을 찾아보세요.`,
    keywords: `${keyword}, ${keyword} 맛집, ${keyword} 검색, 맛집 찾기`,
    url: `https://mzcube.com/search?q=${encodeURIComponent(keyword)}`,
    type: 'website' as const
  };
};
