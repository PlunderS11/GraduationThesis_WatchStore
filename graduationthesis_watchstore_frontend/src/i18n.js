import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n.use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'vi',
        // lng: 'vi',
        debug: false,
        // whitelist: availableLanguages,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
