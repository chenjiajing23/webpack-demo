import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enUs from '@/locale/en-us';
import zhCn from '@/locale/zh-cn';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enUs
      },
      zh: {
        translation: zhCn
      }
    },
    lng: 'zh',
    fallbackLng: 'zh', // 选择默认语言，选择内容为上述配置中的key，即en/zh
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
