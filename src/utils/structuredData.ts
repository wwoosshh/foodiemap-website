/**
 * 구조화된 데이터 (Schema.org JSON-LD) 생성 유틸리티
 * Google, Naver 등 검색엔진이 콘텐츠를 이해하도록 돕습니다
 */

/**
 * 맛집(Restaurant) Schema.org 구조화 데이터 생성
 * 검색 결과에 별점, 리뷰 수, 가격대 등이 표시됩니다
 */
export const generateRestaurantSchema = (restaurant: any) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": restaurant.name,
    "description": restaurant.description || `${restaurant.name} - 맛집큐브`,
    "image": restaurant.images || [],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": restaurant.road_address || restaurant.address,
      "addressLocality": restaurant.address?.split(' ')[1] || "",
      "addressRegion": restaurant.address?.split(' ')[0] || "",
      "addressCountry": "KR"
    },
    "servesCuisine": restaurant.categories?.name || "한식",
    "url": `https://mzcube.com/restaurant/${restaurant.id}`
  };

  // 위치 정보 (지도에 표시)
  if (restaurant.latitude && restaurant.longitude) {
    schema.geo = {
      "@type": "GeoCoordinates",
      "latitude": restaurant.latitude,
      "longitude": restaurant.longitude
    };
  }

  // 평점 및 리뷰 (별점 표시)
  if (restaurant.rating && restaurant.review_count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": restaurant.rating.toFixed(1),
      "reviewCount": restaurant.review_count,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  // 가격대
  if (restaurant.price_range) {
    const priceRangeMap: { [key: string]: string } = {
      'low': '₩',
      'medium': '₩₩',
      'high': '₩₩₩',
      'very_high': '₩₩₩₩'
    };
    schema.priceRange = priceRangeMap[restaurant.price_range] || '₩₩';
  }

  // 연락처
  if (restaurant.contacts?.phone) {
    schema.telephone = restaurant.contacts.phone;
  }

  // 영업시간
  if (restaurant.operations?.business_hours) {
    schema.openingHoursSpecification = parseBusinessHours(restaurant.operations.business_hours);
  }

  return schema;
};

/**
 * 리뷰 Schema.org 구조화 데이터 생성
 */
export const generateReviewSchema = (review: any, restaurant: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Restaurant",
      "name": restaurant.name,
      "image": restaurant.images?.[0],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KR"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Person",
      "name": review.is_anonymous ? "익명" : review.user?.nickname || "사용자"
    },
    "datePublished": review.created_at,
    "reviewBody": review.content,
    "publisher": {
      "@type": "Organization",
      "name": "맛집큐브"
    }
  };
};

/**
 * 홈페이지 Organization Schema
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "맛집큐브",
    "url": "https://mzcube.com",
    "logo": "https://mzcube.com/logo.png",
    "description": "부천, 인천, 서울 지역 맛집 정보와 리얼 리뷰를 제공하는 맛집 추천 플랫폼",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KR"
    },
    "sameAs": [
      // SNS 계정 추가 시 여기에 URL 추가
      // "https://www.instagram.com/맛집큐브",
      // "https://www.facebook.com/맛집큐브"
    ]
  };
};

/**
 * 웹사이트 Schema
 */
export const generateWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "맛집큐브",
    "url": "https://mzcube.com",
    "description": "부천, 인천, 서울 맛집 추천 플랫폼",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mzcube.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};

/**
 * BreadcrumbList Schema (빵 부스러기 경로)
 */
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

/**
 * JSON-LD 스크립트 태그 생성 및 추가
 */
export const insertStructuredData = (schema: any) => {
  // 기존 구조화된 데이터 제거
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // 새 스크립트 태그 생성 및 추가
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);

  return script;
};

/**
 * 여러 개의 구조화된 데이터 한 번에 삽입
 */
export const insertMultipleStructuredData = (schemas: any[]) => {
  // 기존 구조화된 데이터 모두 제거
  document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
    script.remove();
  });

  // 각 스키마를 개별 스크립트로 추가
  schemas.forEach(schema => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  });
};

/**
 * 영업시간 파싱 (JSONB → Schema.org 형식)
 */
const parseBusinessHours = (businessHours: any) => {
  if (!businessHours) return [];

  const dayMap: { [key: string]: string } = {
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday'
  };

  const specs: any[] = [];

  Object.entries(businessHours).forEach(([day, hours]: [string, any]) => {
    if (hours && hours.open && hours.close) {
      specs.push({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": dayMap[day.toLowerCase()],
        "opens": hours.open,
        "closes": hours.close
      });
    }
  });

  return specs;
};
