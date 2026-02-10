import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, useTranslation } from './translations';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get from localStorage or default to 'en'
    const saved = localStorage.getItem('britium-language');
    return saved as Language || 'en';
  });
  const {
    t
  } = useTranslation(language);
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'my' : 'en';
    setLanguage(newLang);
  };
  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem('britium-language', language);

    // Update document language attribute
    document.documentElement.lang = language;

    // Add Myanmar font class when Myanmar is selected
    if (language === 'my') {
      document.documentElement.classList.add('font-myanmar');
    } else {
      document.documentElement.classList.remove('font-myanmar');
    }
  }, [language]);
  return <LanguageContext.Provider value={{
    language,
    setLanguage,
    toggleLanguage,
    t
  }}>
      {children}
    </LanguageContext.Provider>;
};
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};

// Enhanced Language Toggle Component
export const LanguageToggle: React.FC<{
  className?: string;
}> = ({
  className = ''
}) => {
  const {
    language,
    toggleLanguage
  } = useLanguageContext();
  return <button onClick={toggleLanguage} className={`language-toggle group ${className}`} title={language === 'en' ? 'Switch to Myanmar' : 'Switch to English'}>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <span className="text-lg transition-transform duration-300 group-hover:scale-110">
            {language === 'en' ? '🇲🇲' : '🇺🇸'}
          </span>
          <div className="absolute -inset-1 bg-gold-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <span className="font-medium transition-colors duration-300 text-[rgb(0,0,0)]">
          {language === 'en' ? 'Myanmar' : 'English'}
        </span>
        <div className="w-1 h-1 bg-gold-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>;
};

// Compact Language Toggle for Mobile
export const CompactLanguageToggle: React.FC<{
  className?: string;
}> = ({
  className = ''
}) => {
  const {
    language,
    toggleLanguage
  } = useLanguageContext();
  return <button onClick={toggleLanguage} className={`relative p-2 rounded-lg bg-navy-800/80 border border-gold-400/30 text-gold-400 hover:text-gold-300 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20 ${className}`} title={language === 'en' ? 'Myanmar' : 'English'}>
      <span className="text-sm font-medium">
        {language === 'en' ? 'MY' : 'EN'}
      </span>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gold-500/10 to-gold-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>;
};