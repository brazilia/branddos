// 3. Create: components/LanguageSelector.js
"use client";

import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { languages } from '@/lib/i18n/translations';

export default function LanguageSelector({ variant = 'sidebar' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, changeLanguage } = useLanguage();
  
  const currentLang = languages.find(lang => lang.code === currentLanguage);
  
  // Mobile header variant - simple toggle between languages
  if (variant === 'mobile') {
    return (
      <button
        onClick={() => changeLanguage(currentLanguage === 'en' ? 'kk' : 'en')}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs">{currentLang?.nativeName}</span>
      </button>
    );
  }
  
  // Sidebar variant - compact at bottom of sidebar
  if (variant === 'sidebar') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 text-stone-600 hover:bg-stone-100 group"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5" />
            <span>{currentLang?.nativeName}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl shadow-lg border border-stone-200 z-20">
              <div className="py-2">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-medium transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4" />
                      <span>{lang.nativeName}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  
  // Default variant for other uses
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang?.nativeName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    currentLanguage === lang.code
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}