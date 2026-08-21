import { useState, useCallback } from 'react';
import { LangContext } from './translation';

/* Wrap your app with this provider once */
export function LangProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('language') || 'tr'
  );

  const setLanguage = useCallback((newLang) => {
    localStorage.setItem('language', newLang);
    setLangState(newLang);
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLanguage }}>
      {children}
    </LangContext.Provider>
  );
}
