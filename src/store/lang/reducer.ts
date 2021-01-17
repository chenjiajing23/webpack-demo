import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import * as types from './actionTypes';
import initialState from './store';
import { ILangState } from './type';

export default handleActions(
  {
    [`${types.setCommonLang}`]: (state: ILangState, action: AnyAction) => ({
      ...state,
      ...action.payload
    })
  },
  initialState
);
