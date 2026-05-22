import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ملفات الترجمة
import arTranslation from './locales/ar.json';
import enTranslation from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',
    debug: false,
    resources: {
      ar: { translation: arTranslation },
      en: { translation: enTranslation }
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
