import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations, Language, TranslationKeys } from '../locales';
import { ApiService } from '../services/api';

type TranslationFunction = ((key: string, variables?: Record<string, any>) => string) & TranslationKeys;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationFunction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ko');

  // 초기 로드 시 사용자 언어 설정 불러오기
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          // 비로그인 시 로컬스토리지에서 가져오기
          const savedLang = localStorage.getItem('language_preference');
          if (savedLang && (savedLang === 'ko' || savedLang === 'en' || savedLang === 'ja' || savedLang === 'zh')) {
            setLanguageState(savedLang as Language);
          }
          return;
        }

        // 로그인 시 API에서 가져오기
        const response = await ApiService.getUserPreferences();
        if (response.success && response.data) {
          const lang = response.data.preferred_language || 'ko';
          setLanguageState(lang as Language);
        }
      } catch (error) {
        console.error('언어 설정 로드 실패:', error);
      }
    };

    loadLanguagePreference();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // 로컬스토리지에도 저장 (비로그인 사용자용 & 빠른 로딩)
    localStorage.setItem('language_preference', lang);
  };

  // 번역 함수: 키 경로를 통해 번역 문자열을 가져오고 변수를 치환
  // 동시에 객체 접근도 지원 (t.nav.home 형식)
  const t: TranslationFunction = useMemo(() => {
    const translateFn = (key: string, variables?: Record<string, any>) => {
      // 키 경로를 점(.)으로 분리하여 중첩된 객체에 접근
      const keys = key.split('.');
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // 키를 찾을 수 없으면 키 자체 반환
          return key;
        }
      }

      // 최종 값이 문자열이 아니면 키 반환
      if (typeof value !== 'string') {
        return key;
      }

      // 변수가 제공된 경우, {{변수명}} 형식을 치환
      if (variables) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
          return variables[varName] !== undefined ? String(variables[varName]) : match;
        });
      }

      return value;
    };

    // 함수 객체에 번역 객체의 속성을 추가하여 객체 접근도 지원
    return Object.assign(translateFn, translations[language]) as TranslationFunction;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
