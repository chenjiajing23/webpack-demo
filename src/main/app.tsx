import React from 'react';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import zhCN from 'antd/es/locale/zh_CN';
import { hot } from 'react-hot-loader/root';
import { Inspector } from 'react-dev-inspector';

import './../style/reset.css';
import reducers from '../store/reducers';
import RouterComponent from './router';

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk, promise)));
const InspectorWrapper =
  process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;

const App = () => (
  <InspectorWrapper keys={['control', 'shift', 'command', 'c']}>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <RouterComponent />
      </Provider>
    </ConfigProvider>
  </InspectorWrapper>
);

export default hot(App);
