import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  // 스크롤이 최상단일 때는 항상 표시하도록
  alwaysShowAtTop?: boolean;
}

/**
 * 스크롤 방향을 감지하는 훅
 * @param options - threshold: 스크롤 감지 임계값, alwaysShowAtTop: 최상단에서 항상 표시 여부
 * @returns isVisible: 네비게이션 표시 여부, scrollDirection: 스크롤 방향
 */
export const useScrollDirection = (options: UseScrollDirectionOptions = {}) => {
  const { threshold = 10, alwaysShowAtTop = true } = options;
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // 최상단에 있을 때는 항상 표시
      if (alwaysShowAtTop && scrollY < threshold) {
        setIsVisible(true);
        setScrollDirection(null);
        setLastScrollY(scrollY);
        ticking = false;
        return;
      }

      // threshold 이상 스크롤했을 때만 방향 감지
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      if (scrollY > lastScrollY) {
        // 아래로 스크롤 - 숨김
        setScrollDirection('down');
        setIsVisible(false);
      } else if (scrollY < lastScrollY) {
        // 위로 스크롤 - 표시
        setScrollDirection('up');
        setIsVisible(true);
      }

      setLastScrollY(scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [lastScrollY, threshold, alwaysShowAtTop]);

  return { isVisible, scrollDirection };
};
