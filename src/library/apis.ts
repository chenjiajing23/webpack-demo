import Apis, { IApiMap } from 'good-apis';
import { message } from 'antd';

import env from '../config/env';
import serverMap from '../config/apis';
import { getTokenKey, getToken, parseQuery, setCookie, unsetCookie } from './utils';

// 整理 apiMap
const apiMap: IApiMap = {};
try {
  const modules = require.context(`../modules`, true, /.*\/apis\.tsx?$/);
  const components = require.context(`../components`, true, /.*\/apis\.tsx?$/);

  modules.keys().forEach(key => {
    const config = modules(key).default || modules(key);
    Object.assign(apiMap, config);
  });

  components.keys().forEach((key: string) => {
    const config = components(key).default;
    Object.assign(apiMap, config);
  });
} catch (err) {
  console.error(err?.message);
}

// 整理 serverMap
for (const key of Object.keys(serverMap)) {
  let baseURL = serverMap[key].baseMap[env.ENV];

  if (env.ENV === 'dev') {
    baseURL = `${baseURL}${window.CI_DEV_BRANCH}`;
  }

  // host
  const dHost = parseQuery('host');
  if (dHost) {
    baseURL = dHost;
  }

  serverMap[key].baseURL = baseURL;
}

// 请求拦截器
Apis.onUseReq(
  config => {
    let token = getToken();

    // token
    const dToken = parseQuery('token');
    if (dToken) {
      token = dToken;
      setCookie({ key: getTokenKey(), value: dToken });
    }

    // clear
    const dClear = parseQuery('clear');
    if (dClear) {
      token = '';
      unsetCookie({ key: getTokenKey() });
    }

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (err: any) => Promise.reject(err)
);

// 响应拦截器
Apis.onUseRes(
  res => {
    if (res.data) {
      return res.data;
    } else {
      return Promise.reject(res.data.msg || '响应异常');
    }
  },
  err => {
    if (err.response) {
      switch (err.response.status) {
        case 401:
          // unsetCookie({ key: getTokenKey() });
          break;
        case 403:
          break;
        default:
      }
      return Promise.reject(err.response);
    }
    void message.error(err.message || '响应异常');
    return Promise.reject(err);
  }
);

const apis = new Apis(serverMap, apiMap);

export default apis;
