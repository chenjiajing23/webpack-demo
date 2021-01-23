import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import demo from './demo/reducer';
import lang from './lang/reducer';

const reducers = combineReducers({
  demo,
  lang
});

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk, promise)));

export default store;
