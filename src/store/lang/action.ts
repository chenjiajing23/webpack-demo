import { AnyAction, Dispatch } from 'redux';
import { createAction } from 'redux-actions';

import * as types from './actionTypes';
import { ILangState, ILangType } from './type';

// 通用 action
export const setCommonLang = createAction(
  types.setCommonLang,
  (payload: Partial<ILangState>) => payload
);

/**
 * @description 切换语言
 * @param {'en'|'zh-cn'} payload
 */
export const onSwitchLang = (local: ILangType) => (dispatch: Dispatch<AnyAction>) => {
  dispatch(setCommonLang({ local }));
};
