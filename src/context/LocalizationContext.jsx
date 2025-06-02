import React, { createContext, useState, useContext } from 'react';
import strings from '../lib/localization';
  
const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const changeLanguage = (lang) => {
    strings.setLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LocalizationContext.Provider value={{ strings, language, changeLanguage }}>
      {children}
    </LocalizationContext.Provider>
  );
};

// Optional hook for easy access
export const useLocalization = () => useContext(LocalizationContext);
