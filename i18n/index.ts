import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { storage } from '@/lib/storage';

import en from './locales/en.json';
import fr from './locales/fr.json';
import am from './locales/am.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  am: { translation: am },
};

const initI18n = async () => {
  let savedLanguage = await storage.getItem('language');
  
  if (!savedLanguage) {
    savedLanguage = Localization.locale.split('-')[0];
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;