import { useState, useCallback } from 'react';
import tr from '../i18n/tr.json';
import en from '../i18n/en.json';

const translations = { tr, en };

export function useTranslation() {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('language') || 'tr'
  );

  const setLanguage = useCallback((newLang) => {
    localStorage.setItem('language', newLang);
    setLangState(newLang);
  }, []);

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
