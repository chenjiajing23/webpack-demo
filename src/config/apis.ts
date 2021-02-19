/*
 * @Description: 服务器 多host地址
 * @Author: Chenjiajing
 * @Date: 2020-10-03 23:36:40
 * @LastEditors: Chenjiajing
 * @LastEditTime: 2021-02-19 22:22:14
 */
const serverMap: IServerMap = {
  baseServer: {
    baseMap: {
      prod: 'http://prod.apis.com',
      stage: 'https://state.apis.com',
      test: 'https://test.apis.com',
      dev: 'https://dev.apis.com',
      local: `http://${window.location.host}` || 'http://localhost:8080' // 本地开发后端地址
    },
    default: true
  }
  // 更多
  // baseServer2: {
  //   baseMap: {
  //     prod: 'http://prod.apis.com',
  //     stage: 'https://state.apis.com',
  //     test: 'https://test.apis.com',
  //     dev: 'https://dev.apis.com',
  //     local: 'http://localhost:8080'
  //   },
  //   default: true
  // }
};

export default serverMap;

interface IBaseMap {
  prod: string;
  stage: string;
  test: string;
  dev: string;
  local: string;
}

interface IConfig {
  default?: boolean;
  baseURL?: string;
  baseMap: IBaseMap;
}

interface IServerMap {
  [key: string]: IConfig;
}
