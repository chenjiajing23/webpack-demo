/// <reference path="./apis-keys.d.ts" />

// 请求注册
interface IAPIsRegisterParam {
  [key: string]: {
    server?: 'baseServer';
    url: string;
    method:
      | 'get'
      | 'GET'
      | 'delete'
      | 'DELETE'
      | 'head'
      | 'HEAD'
      | 'options'
      | 'OPTIONS'
      | 'post'
      | 'POST'
      | 'put'
      | 'PUT'
      | 'patch'
      | 'PATCH'
      | 'purge'
      | 'PURGE'
      | 'link'
      | 'LINK'
      | 'unlink'
      | 'UNLINK';
  };
}

// 请求调用
interface IAPIsTransferParam {
  url?: string;
  baseURL?: string;
  headers?: any;
  params?: any;
  data?: any;
  rest?: { [key: string]: number | string };

  paramsSerializer?: (params: any) => string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  /** 更多TS拓展查看 [AxiosRequestConfig] (https://github.com/axios/axios/blob/master/index.d.ts#L44) */
}

// 请求响应
interface IResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 请求返回数据
type APICall = <T extends any>(params?: IAPIsTransferParam) => Promise<IResponse<T>>;

// 定义请求方法
type ValuesOf<T extends any[]> = T[number];
type APIKeys = ValuesOf<typeof keys>;

type IAPIs = {
  [key in APIKeys]: APICall;
};
