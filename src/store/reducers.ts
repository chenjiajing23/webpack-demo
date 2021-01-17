import { combineReducers } from 'redux';

import demo from './demo/reducer';
import lang from './lang/reducer';

const reducers = combineReducers({
  demo,
  lang
});

export default reducers;
