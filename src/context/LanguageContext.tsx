import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations, Language, TranslationKeys } from '../locales';
import { ApiService } from '../services/api';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
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

  // 현재 언어의 번역 객체 반환 (메모이제이션으로 성능 최적화)
  const t = useMemo(() => translations[language], [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
