/*
 * @Description: 服务器 多host地址
 * @Author: Chenjiajing
 * @Date: 2020-10-03 23:36:40
 * @LastEditors: Chenjiajing
 * @LastEditTime: 2020-10-18 20:25:15
 */
const serverMap: IServerMap = {
  baseServer: {
    baseMap: {
      prod: 'http://prod.apis.com',
      stage: 'https://state.apis.com',
      test: 'https://test.apis.com',
      dev: 'https://dev.apis.com',
      local: 'http://localhost:8080'
    },
    default: true
  }
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
