/**
 * 한글 초성 검색 유틸리티
 * - 초성 검색 지원 (예: "ㄱㄴ" -> "강남", "김밥" 등)
 * - 자음+모음 조합 검색 지원
 * - 일반 텍스트 검색과 함께 사용
 */

// 한글 초성 목록
const CHOSUNG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// 한글 중성 목록
const JUNGSUNG_LIST = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

// 한글 종성 목록 (빈 문자열 포함)
const JONGSUNG_LIST = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// 한글 유니코드 시작값 (가)
const HANGUL_START = 0xAC00;
// 한글 유니코드 끝값 (힣)
const HANGUL_END = 0xD7A3;

// 자음 유니코드 시작값 (ㄱ)
const JAMO_START = 0x3131;
// 자음 유니코드 끝값 (ㅎ)
const JAMO_END = 0x3163;

/**
 * 문자가 한글 완성형인지 확인
 */
export const isHangul = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return code >= HANGUL_START && code <= HANGUL_END;
};

/**
 * 문자가 한글 자모(초성/중성/종성)인지 확인
 */
export const isHangulJamo = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return code >= JAMO_START && code <= JAMO_END;
};

/**
 * 문자가 한글 초성인지 확인
 */
export const isChosung = (char: string): boolean => {
  return CHOSUNG_LIST.includes(char);
};

/**
 * 한글 완성형 문자에서 초성 추출
 */
export const getChosung = (char: string): string => {
  if (!isHangul(char)) return char;

  const code = char.charCodeAt(0) - HANGUL_START;
  const chosungIndex = Math.floor(code / (21 * 28));
  return CHOSUNG_LIST[chosungIndex];
};

/**
 * 한글 완성형 문자 분해 (초성, 중성, 종성)
 */
export const decomposeHangul = (char: string): { cho: string; jung: string; jong: string } | null => {
  if (!isHangul(char)) return null;

  const code = char.charCodeAt(0) - HANGUL_START;
  const chosungIndex = Math.floor(code / (21 * 28));
  const jungsungIndex = Math.floor((code % (21 * 28)) / 28);
  const jongsungIndex = code % 28;

  return {
    cho: CHOSUNG_LIST[chosungIndex],
    jung: JUNGSUNG_LIST[jungsungIndex],
    jong: JONGSUNG_LIST[jongsungIndex]
  };
};

/**
 * 문자열에서 초성만 추출
 */
export const extractChosung = (text: string): string => {
  return text
    .split('')
    .map(char => {
      if (isHangul(char)) {
        return getChosung(char);
      }
      return char;
    })
    .join('');
};

/**
 * 초성 검색 패턴 매칭
 * 검색어가 초성으로만 이루어진 경우, 대상 문자열의 초성과 비교
 */
export const matchChosung = (text: string, query: string): boolean => {
  if (!query) return true;

  const textChosung = extractChosung(text.toLowerCase());
  const queryLower = query.toLowerCase();

  // 검색어가 모두 초성인 경우
  const isAllChosung = query.split('').every(char => isChosung(char) || char === ' ');

  if (isAllChosung) {
    return textChosung.includes(queryLower);
  }

  // 일반 텍스트 검색
  return text.toLowerCase().includes(queryLower);
};

/**
 * 스마트 한글 검색 - 초성, 부분 일치, 시작 문자 모두 지원
 * @param text 검색 대상 텍스트
 * @param query 검색어
 * @returns 매칭 점수 (0: 불일치, 높을수록 더 좋은 매칭)
 */
export const smartKoreanMatch = (text: string, query: string): number => {
  if (!query || !text) return 0;

  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // 1. 정확히 일치 (최고 점수)
  if (textLower === queryLower) return 100;

  // 2. 시작 부분 일치 (높은 점수)
  if (textLower.startsWith(queryLower)) return 90;

  // 3. 단어 시작 부분 일치
  const words = textLower.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(queryLower)) return 85;
  }

  // 4. 부분 문자열 일치
  if (textLower.includes(queryLower)) return 70;

  // 5. 초성 검색
  const textChosung = extractChosung(textLower);

  // 검색어가 모두 초성인 경우
  const isQueryAllChosung = query.split('').every(char => isChosung(char) || char === ' ');

  if (isQueryAllChosung) {
    // 초성 시작 일치
    if (textChosung.startsWith(queryLower)) return 80;
    // 초성 포함
    if (textChosung.includes(queryLower)) return 60;
  }

  // 6. 입력 중인 한글 처리 (예: "강ㄴ" -> "강남")
  if (matchPartialHangul(text, query)) return 65;

  return 0;
};

/**
 * 부분 한글 매칭 (입력 중인 상태 지원)
 * 예: "강ㄴ"은 "강남"과 매칭
 */
export const matchPartialHangul = (text: string, query: string): boolean => {
  if (!query || !text) return false;

  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // 마지막 문자가 초성인 경우 (입력 중)
  const lastChar = queryLower.slice(-1);
  const beforeLast = queryLower.slice(0, -1);

  if (isChosung(lastChar) && beforeLast) {
    // 앞부분이 일치하고, 마지막 초성이 다음 글자의 초성과 일치하는지 확인
    const matchIndex = textLower.indexOf(beforeLast);
    if (matchIndex !== -1) {
      const nextCharIndex = matchIndex + beforeLast.length;
      if (nextCharIndex < text.length) {
        const nextChar = text[nextCharIndex];
        if (isHangul(nextChar) && getChosung(nextChar) === lastChar) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * 검색 결과 정렬 (매칭 점수 기반)
 */
export const sortByRelevance = <T>(
  items: T[],
  query: string,
  getSearchText: (item: T) => string
): T[] => {
  if (!query) return items;

  return [...items]
    .map(item => ({
      item,
      score: smartKoreanMatch(getSearchText(item), query)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
};

/**
 * 검색어 하이라이트 (매칭된 부분 표시)
 */
export const highlightMatch = (text: string, query: string): { text: string; isMatch: boolean }[] => {
  if (!query || !text) return [{ text, isMatch: false }];

  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // 일반 텍스트 매칭
  const matchIndex = textLower.indexOf(queryLower);
  if (matchIndex !== -1) {
    const before = text.slice(0, matchIndex);
    const match = text.slice(matchIndex, matchIndex + query.length);
    const after = text.slice(matchIndex + query.length);

    const result: { text: string; isMatch: boolean }[] = [];
    if (before) result.push({ text: before, isMatch: false });
    result.push({ text: match, isMatch: true });
    if (after) result.push({ text: after, isMatch: false });
    return result;
  }

  // 초성 매칭인 경우 전체 표시
  return [{ text, isMatch: false }];
};

/**
 * 디바운스 함수
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
