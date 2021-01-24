// 从URL获取语言字符串
export function getCurrentUrlLang() {
  let lang = null;
  let arr = null;
  const regex = /\/(.+?)\//g;
  const { hash, pathname } = window.location;
  if (hash) {
    arr = hash.match(regex);
  } else if (pathname) {
    arr = pathname.match(regex);
  }
  if (arr && arr.length >= 1) {
    lang = arr[0].replaceAll(/\//g, '');
  }
  return lang;
}
