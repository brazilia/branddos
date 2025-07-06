// 2. Create: lib/i18n/context.js
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Detect browser language and set initial language
  useEffect(() => {
    const detectLanguage = () => {
      // Check if there's a saved language preference first
      const savedLanguage = localStorage.getItem('preferred-language');
      if (savedLanguage && translations[savedLanguage]) {
        return savedLanguage;
      }
      
      // Detect browser language
      const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
      
      // Check if browser language matches any of our supported languages
      if (browserLanguage.startsWith('kk') || browserLanguage.startsWith('kz')) {
        return 'kk'; // Kazakh
      }
      
      // Default to English for all other languages
      return 'en';
    };
    
    const detectedLanguage = detectLanguage();
    setCurrentLanguage(detectedLanguage);
  }, []);
  
  // Save language preference whenever it changes
  useEffect(() => {
    if (currentLanguage) {
      localStorage.setItem('preferred-language', currentLanguage);
      // Update document language
      if (typeof document !== 'undefined') {
        document.documentElement.lang = currentLanguage;
      }
    }
  }, [currentLanguage]);
  
  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);
    }
  };
  
  // Get nested translation with dot notation
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = translations[currentLanguage];
    
    for (const k of keys) {
      translation = translation?.[k];
    }
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    // Replace placeholders
    if (typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation;
  };
  
  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isKazakh: currentLanguage === 'kk',
    isEnglish: currentLanguage === 'en'
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};