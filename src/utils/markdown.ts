/**
 * 마크다운 문법을 제거하고 순수 텍스트만 반환합니다.
 * @param markdown 마크다운 텍스트
 * @returns 순수 텍스트
 */
export const stripMarkdown = (markdown: string): string => {
  if (!markdown) return '';

  let text = markdown;

  // 코드 블록 제거 (```)
  text = text.replace(/```[\s\S]*?```/g, '');

  // 인라인 코드 제거 (`)
  text = text.replace(/`([^`]+)`/g, '$1');

  // 제목 (# ## ### 등)
  text = text.replace(/^#+\s+/gm, '');

  // 굵게 (**text** 또는 __text__)
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');

  // 기울임 (*text* 또는 _text_)
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');

  // 취소선 (~~text~~)
  text = text.replace(/~~(.*?)~~/g, '$1');

  // 링크 [text](url)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 이미지 ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // 인용구 (>)
  text = text.replace(/^>\s+/gm, '');

  // 수평선 (---, ***, ___)
  text = text.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '');

  // 리스트 (-, *, +, 1.)
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');

  // 테이블 구분자 (|)
  text = text.replace(/\|/g, ' ');

  // 여러 줄 공백을 하나로
  text = text.replace(/\n{2,}/g, ' ');

  // 앞뒤 공백 제거
  text = text.trim();

  return text;
};
