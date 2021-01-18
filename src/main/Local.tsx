import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale(enUS.locale);

import RouterComponent from './router';
import { IStoreState } from '@/store/type';
import { ILangState } from '@/store/lang/type';

const Local = () => {
  const { i18n } = useTranslation();
  const [local, setLocal] = useState(enUS);
  const lang = useSelector<IStoreState, ILangState>(state => state.lang);

  // 切换语言（中英文）
  useEffect(() => {
    if (lang.local === 'en') {
      i18n.changeLanguage && i18n.changeLanguage('en');
      setLocal(enUS);
    } else {
      setLocal(zhCN);
      i18n.changeLanguage && i18n.changeLanguage('zh');
    }
    moment.locale(lang.local);
  }, [i18n, lang.local]);

  return (
    <ConfigProvider locale={local}>
      <RouterComponent />
    </ConfigProvider>
  );
};

export default Local;
