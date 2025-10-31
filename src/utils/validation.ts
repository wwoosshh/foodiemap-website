/**
 * 입력 검증 유틸리티
 * 보안 강화를 위한 클라이언트 사이드 검증
 */

/**
 * 이메일 형식 검증
 * RFC 5322 표준에 기반한 간단한 검증
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * 비밀번호 강도 검증
 * - 최소 8자 이상
 * - 대문자 1개 이상
 * - 소문자 1개 이상
 * - 숫자 1개 이상
 * - 특수문자 1개 이상
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['비밀번호를 입력해주세요.'] };
  }

  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 최소 1개 포함해야 합니다.');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 최소 1개 포함해야 합니다.');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 최소 1개 포함해야 합니다.');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('특수문자를 최소 1개 포함해야 합니다.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 전화번호 형식 검증 (한국)
 * 형식: 010-1234-5678, 01012345678 등
 */
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return true; // 선택사항이므로 빈 값 허용

  const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  return phoneRegex.test(phone.trim().replace(/\s/g, ''));
};

/**
 * 이름 검증
 * - 최소 2자 이상
 * - 최대 50자 이하
 * - 특수문자 제한 (일부 허용)
 */
export const validateName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;

  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 50) return false;

  // 한글, 영문, 공백, 일부 특수문자만 허용
  const nameRegex = /^[가-힣a-zA-Z\s\-'.]+$/;
  return nameRegex.test(trimmedName);
};

/**
 * URL 검증
 * HTTPS만 허용 (보안 강화)
 */
export const validateSecureUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * XSS 방어: HTML 특수문자 이스케이프
 */
export const escapeHtml = (text: string): string => {
  if (!text || typeof text !== 'string') return '';

  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * SQL Injection 방어: 위험한 패턴 감지
 */
export const containsSqlInjectionPattern = (input: string): boolean => {
  if (!input || typeof input !== 'string') return false;

  const sqlPatterns = [
    /(\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bcreate\b|\balter\b)/i,
    /(union.*select|insert.*values|drop.*table)/i,
    /(-{2}|\/\*|\*\/|;)/
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
};
