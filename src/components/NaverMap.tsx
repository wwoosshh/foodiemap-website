import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

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

  useEffect(() => {
    // 네이버 지도 API가 로드되지 않았으면 대기
    if (!window.naver || !window.naver.maps) {
      console.error('네이버 지도 API가 로드되지 않았습니다.');
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
  }, [latitude, longitude, restaurantName, address]);

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
