import { ILangState } from './lang/type';
import { IDemoState } from './demo/type';

// 全局 Redux 数据声明
export interface IStoreState {
  demo: IDemoState;
  lang: ILangState;
}
