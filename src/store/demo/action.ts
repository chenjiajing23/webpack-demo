import { clone } from '@/library/utils';
import { AnyAction, Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { IStoreState } from '../type';
import * as types from './actionTypes';
import { IDemoState } from './type';

// 通用 action
export const setCommon = createAction(
  types.setCommon,
  (payload: Partial<IDemoState>) => payload
);

/**
 * @description 增加
 * @param {number} payload
 */
export const incrementCount = (payload = 1) => (
  dispatch: Dispatch<AnyAction>,
  getState: () => IStoreState
) => {
  const state = getState();
  const demo = clone(state.demo);

  dispatch(setCommon({ count: demo.count + payload }));
};

/**
 * @description 增加
 * @param {number} payload
 */
export const decrementCount = (payload = -1) => (
  dispatch: Dispatch<AnyAction>,
  getState: () => IStoreState
) => {
  const state = getState();
  const demo = clone(state.demo);

  dispatch(setCommon({ count: demo.count + payload }));
};
