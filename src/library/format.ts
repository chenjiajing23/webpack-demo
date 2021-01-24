// 从URL获取语言字符串
export function getCurrentUrlLang() {
  let lang = null;
  const regex = /\/(.+?)\//g;
  const arr = window.location.href.match(regex);
  if (arr && arr.length >= 2) {
    lang = arr[1].replaceAll(/\//g, '');
  }
  return lang;
}
