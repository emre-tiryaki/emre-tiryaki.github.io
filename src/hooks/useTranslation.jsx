import { createContext, useContext, useState, useCallback } from 'react';
import tr from '../i18n/tr.json';
import en from '../i18n/en.json';

const translations = { tr, en };

const LangContext = createContext(null);

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

/* All components call this — they all share the SAME lang state */
export function useTranslation() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useTranslation must be used inside <LangProvider>');

  const { lang, setLanguage } = ctx;

  // UI string lookup: t('about.summary')
  const t = useCallback(
    (keyPath) => {
      const result = keyPath
        .split('.')
        .reduce((obj, key) => obj?.[key], translations[lang]);
      return result ?? keyPath;
    },
    [lang]
  );

  // Dynamic data field translation: tData(item.title) → item.title[lang] or raw string
  const tData = useCallback(
    (field) => {
      if (field === null || field === undefined) return '';
      if (typeof field === 'object') return field[lang] ?? field['tr'] ?? '';
      return field;
    },
    [lang]
  );

  return { t, tData, lang, setLanguage };
}
