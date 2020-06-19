import { createAction } from 'redux-actions'
import * as types from './actionTypes'

// 通用 action
export const setCommon = createAction(types.setCommon, (payload: any) => payload)
