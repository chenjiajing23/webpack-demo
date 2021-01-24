import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import zh_CN from 'antd/es/locale/zh_CN'; // 中文
import en_US from 'antd/es/locale/en_US'; // 英文
import zh_HK from 'antd/es/locale/zh_HK'; // 繁体中文（中国香港）
import ja_JP from 'antd/es/locale/ja_JP'; // 日语
import moment from 'moment';
import 'moment/locale/zh-cn'; // 中文
import 'moment/locale/ja'; // 日文
import 'moment/locale/zh-hk'; // 繁体中文（中国香港）

import RouterComponent from './router';
import { IStoreState } from '@/store/type';
import { ILangState } from '@/store/lang/type';

const Local = () => {
  const { i18n } = useTranslation();
  const [local, setLocal] = useState(zh_CN);
  const lang = useSelector<IStoreState, ILangState>(state => state.lang);

  // 切换语言
  useEffect(() => {
    switch (lang.local) {
      case 'en':
        setLocal(en_US);
        moment.locale(en_US.locale);
        void i18n.changeLanguage('en');
        break;
      case 'zh_CN':
        setLocal(zh_CN);
        void i18n.changeLanguage('zh_CN');
        break;
      case 'ja_JP':
        setLocal(ja_JP);
        moment.locale(ja_JP.locale);
        void i18n.changeLanguage('ja_JP');
        break;
      case 'zh_HK':
        setLocal(zh_HK);
        moment.locale(zh_HK.locale);
        void i18n.changeLanguage('zh_HK');
        break;
      default:
        setLocal(en_US);
        moment.locale(en_US.locale);
        void i18n.changeLanguage('en');
        break;
    }
    document.documentElement.lang = lang.local;
  }, [i18n, lang.local]);

  return (
    <ConfigProvider locale={local}>
      <RouterComponent />
    </ConfigProvider>
  );
};

export default Local;
