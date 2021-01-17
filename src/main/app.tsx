import React from 'react';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { hot } from 'react-hot-loader/root';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import enUS from 'antd/es/locale/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';

import './../style/reset.css';
import './../style/font.css';
import reducers from '../store/reducers';
import Local from './Local';

moment.locale(enUS.locale);
const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk, promise)));

const App = () => (
  <Provider store={store}>
    <Local />
  </Provider>
);

export default hot(App);
