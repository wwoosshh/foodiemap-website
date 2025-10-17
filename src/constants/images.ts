// 기본 대체 이미지 상수
// SVG data URI를 사용하여 외부 서비스 의존성 제거

export const DEFAULT_RESTAURANT_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#FF6B6B"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
        맛집 이미지
      </text>
    </svg>
  `.trim());

export const DEFAULT_USER_AVATAR =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="100" fill="#E0E0E0"/>
      <circle cx="100" cy="80" r="35" fill="#FFFFFF"/>
      <ellipse cx="100" cy="160" rx="60" ry="50" fill="#FFFFFF"/>
    </svg>
  `.trim());

export const DEFAULT_EVENT_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#4ECDC4"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
        이벤트 이미지
      </text>
    </svg>
  `.trim());

export const DEFAULT_BANNER_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#4ECDC4;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
        배너 이미지
      </text>
    </svg>
  `.trim());

// 이미지 에러 핸들러 유틸리티 함수
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement>,
  fallbackImage: string = DEFAULT_RESTAURANT_IMAGE
) => {
  e.currentTarget.src = fallbackImage;
  e.currentTarget.onerror = null; // 무한 루프 방지
};
