import { createAction } from 'redux-actions';
import * as types from './actionTypes';
import { IDemoState } from './type';

// 通用 action
export const setCommon = createAction(
  types.setCommon,
  (payload: Partial<IDemoState>) => payload
);
