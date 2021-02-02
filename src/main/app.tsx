import React from 'react';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { Inspector } from 'react-dev-inspector';

import './../style/reset.css';
import './../style/font.css';
import store from '../store';
import Local from './local';
// props docs see below 调试组件，由页面组件可直接打开vscode中对应的组件
// 详情查看 -> https://github.com/zthxxx/react-dev-inspector
const InspectorWrapper =
  process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;

const App = (props: JSX.IntrinsicAttributes) => (
  <InspectorWrapper keys={['control', 'shift', 'command', 'c']}>
    <Provider store={store}>
      <Local {...props} />
    </Provider>
  </InspectorWrapper>
);

export default hot(App);
