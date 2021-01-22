import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locale/en';
import zh_CN from '@/locale/zh_CN';
import zh_HK from '@/locale/zh_HK';
import ja_JP from '@/locale/ja_JP';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      zh_CN: {
        translation: zh_CN
      },
      zh_HK: {
        translation: zh_HK
      },
      ja_JP: {
        translation: ja_JP
      }
    },
    lng: localStorage.lang || 'en',
    fallbackLng: 'en', // 选择默认语言，选择内容为上述配置中的key，即en/zh
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
