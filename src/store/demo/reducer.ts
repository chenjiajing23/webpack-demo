import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import * as types from './actionTypes';
import initialState from './store';
import { IDemoState } from './type';

export default handleActions(
  {
    [`${types.setCommon}`]: (state: IDemoState, action: AnyAction) => ({
      ...state,
      ...action.payload
    })
  },
  initialState
);
