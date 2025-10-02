import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

// 네이버 지도 타입 선언
declare global {
  interface Window {
    naver: any;
  }
}

interface NaverMapProps {
  latitude: number;
  longitude: number;
  restaurantName: string;
  address: string;
}

const NaverMap: React.FC<NaverMapProps> = ({
  latitude,
  longitude,
  restaurantName,
  address
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 네이버 지도 API 스크립트 동적 로드
  useEffect(() => {
    // 이미 로드되어 있으면 스킵
    if (window.naver && window.naver.maps) {
      setLoading(false);
      return;
    }

    // 클라이언트 ID 가져오기 (환경 변수 또는 기본값)
    const clientId = process.env.REACT_APP_NAVER_MAP_CLIENT_ID;

    if (!clientId) {
      setError('네이버 지도 API 클라이언트 ID가 설정되지 않았습니다.');
      setLoading(false);
      return;
    }

    // 스크립트 태그 생성 및 로드
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.async = true;
    script.onload = () => {
      setLoading(false);
    };
    script.onerror = () => {
      setError('네이버 지도 API 로드에 실패했습니다.');
      setLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거 (선택사항)
      // document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // 로딩 중이거나 에러가 있으면 스킵
    if (loading || error) return;

    // 네이버 지도 API가 로드되지 않았으면 대기
    if (!window.naver || !window.naver.maps) {
      setError('네이버 지도 API를 사용할 수 없습니다.');
      return;
    }

    if (!mapRef.current) return;

    // 지도 중심 좌표
    const location = new window.naver.maps.LatLng(latitude, longitude);

    // 지도 옵션
    const mapOptions = {
      center: location,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
      mapTypeControl: true,
    };

    // 지도 생성
    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // 마커 생성
    const marker = new window.naver.maps.Marker({
      position: location,
      map: map,
      title: restaurantName,
    });

    // 정보 창 생성
    const infoWindow = new window.naver.maps.InfoWindow({
      content: `
        <div style="padding: 15px; min-width: 200px; line-height: 1.5;">
          <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">${restaurantName}</h4>
          <p style="margin: 0; font-size: 13px; color: #666;">${address}</p>
        </div>
      `,
    });

    // 마커 클릭 시 정보 창 열기
    window.naver.maps.Event.addListener(marker, 'click', () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    });

    // 초기에 정보 창 열기
    infoWindow.open(map, marker);

    // 컴포넌트 언마운트 시 지도 제거
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, [latitude, longitude, restaurantName, address, loading, error]);

  // 로딩 중
  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            지도를 불러오는 중...
          </Typography>
        </Box>
      </Box>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff8f8'
        }}
      >
        <Box sx={{ textAlign: 'center', px: 3 }}>
          <Typography variant="h6" color="error" sx={{ mb: 1 }}>
            지도를 불러올 수 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: '500px',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #e0e0e0'
      }}
    />
  );
};

export default NaverMap;
