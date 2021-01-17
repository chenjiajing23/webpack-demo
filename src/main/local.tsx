import React, { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale(enUS.locale);

import RouterComponent from './router';
import { useSelector } from 'react-redux';
import { IStoreState } from '@/store/type';
import { ILangState } from '@/store/lang/type';

const Local = () => {
  const [local, setLocal] = useState(enUS);
  const lang = useSelector<IStoreState, ILangState>(state => state.lang);

  // 切换语言（中英文）
  useEffect(() => {
    if (lang.local === 'en') {
      setLocal(enUS);
    } else {
      setLocal(zhCN);
    }
    moment.locale(lang.local);
  }, [lang.local]);

  return (
    <ConfigProvider locale={local}>
      <RouterComponent />
    </ConfigProvider>
  );
};

export default Local;
