import { ko } from './ko';
import { en } from './en';
import { ja } from './ja';
import { zh } from './zh';

export const translations = {
  ko,
  en,
  ja,
  zh,
};

export type Language = keyof typeof translations;
export type { TranslationKeys } from './ko';
