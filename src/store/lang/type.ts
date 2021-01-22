// 可选的语言列表
export type ILangType = 'en' | 'zh_CN' | 'zh_HK' | 'ja_JP';

// 语言详情列表
export interface ILangDetailInfo {
  key: ILangType;
  name: string;
}

// 所有数据
export interface ILangState {
  local: ILangType;
  langList: ILangDetailInfo[];
}
