import { ILangState } from './type';

const initialState: ILangState = {
  local: 'zh_CN',
  langList: [
    { key: 'zh_CN', name: '中文' },
    { key: 'en', name: 'English' },
    { key: 'ja_JP', name: '日文' },
    { key: 'zh_HK', name: '繁体中文（中国香港）' }
  ] // 可选的语言列表
};

export default initialState;
