/*
 * @Description: 工具函数
 * @Author: Chenjiajing
 * @Date: 2020-09-10 15:57:23
 * @LastEditors: Chenjiajing
 * @LastEditTime: 2020-10-04 00:04:23
 */

/**
 * @description 获取特定的cookie
 * @param  {string} key 需要获取的cookie名字
 * @example
 * import { getCookie } from 'library/utils';
 * const token=getCookie('token')
 */
export function getCookie(key: string): string | null {
  return (
    decodeURIComponent(
      document.cookie.replace(
        new RegExp(
          `(?:(?:^|.*;)\\s*${encodeURIComponent(key).replace(
            /[-.+*]/g,
            '\\$&'
          )}\\s*\\=\\s*([^;]*).*$)|^.*$`
        ),
        '$1'
      )
    ) || null
  );
}

/**
 * @description 判断某个cookie是否存在
 * @param  {string} key 需要判断的cookie名字
 * @example
 * import { hasCookie } from 'library/utils';
 * const flag=getCookie('token')
 */
export function hasCookie(key: string): boolean {
  return new RegExp(
    `(?:^|;\\s*)${encodeURIComponent(key).replace(/[-.+*]/g, '\\$&')}\\s*\\=`
  ).test(document.cookie);
}

// 设置cookie需要的参数
export interface ISetCookieOptions {
  key: string;
  value: string;
  end?: number | string | Date; // 过期时间
  path?: string;
  domain?: string;
  secure?: boolean;
}

/**
 * @description 设置特定的cookie
 * @param  {string} key 需要设置的cookie名字
 * @example
 * import { hasCookie } from 'library/utils';
 * hasCookie('token')
 */

export function setCookie(options: ISetCookieOptions): boolean {
  const { key, value, end, path, domain, secure } = options;
  if (!key || /^(?:expires|max\\-age|path|domain|secure)$/i.test(key)) {
    return false;
  }

  let sExpires = '';
  if (end) {
    switch (end.constructor) {
      case Number:
        sExpires = `; max-age=${end}`;
        break;
      case String:
        sExpires = `; expires=${end}`;
        break;
      case Date:
        sExpires = `; expires=${(end as Date).toUTCString()}`;
        break;
      default:
    }
  }
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${sExpires}${
    domain ? `; domain=${domain}` : ''
  }${path ? `; path=${path}` : ''}${secure ? '; secure' : ''}`;
  return true;
}

/**
 * @description 清除特定的cookie
 * @param  {string} key 需要清除的cookie名字
 * @example
 * import { unsetCookie } from 'library/utils';
 * unsetCookie('token')
 */
export function unsetCookie(options: {
  key: string;
  path?: string;
  domain?: string;
}): boolean {
  const { key, path, domain } = options;
  if (!key || !hasCookie(key)) {
    return false;
  }
  document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${
    domain ? `; domain=${domain}` : ''
  }${path ? `; path=${path}` : ''}`;
  return true;
}

// 获取token 的key
export function getTokenKey(): string {
  const env = process.env.NODE_ENV;
  let key = 'token';
  if (env === 'production') {
    key = `${env}-service-management-token`;
  }
  return key;
}

// 获取token的值
export function getToken(): string {
  const key = getTokenKey();

  return getCookie(key) || '';
}

// 快捷通过地址栏读取token，host等变量
export function parseQuery(key: string): string {
  const queryStr = window.location.search.replace('?', '');
  const queryMap: any = {};

  for (const param of queryStr.split('&')) {
    const [key, value] = param.split('=');
    queryMap[key] = value;
  }

  return queryMap[key];
}

// 深拷贝对象或数组
export function clone<T = any>(obj: T) {
  return JSON.parse(JSON.stringify(obj)) as T;
}

// 节流
export function throttle(this: any, fn: (...rest: any) => any, wait = 300) {
  let timeout: NodeJS.Timeout | null = null;

  return (...rest: any) => {
    if (timeout) {
      return;
    }
    timeout = setTimeout(() => {
      fn.apply(this, rest);
      timeout = null;
    }, wait);
  };
}

// 防抖
export function debounce(this: any, fn: (...rest: any) => any, wait = 300) {
  let timeout: NodeJS.Timeout | null = null;

  return (...rest: any) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
    } else {
      fn.apply(this, rest);
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
    }
  };
}
