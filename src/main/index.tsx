import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { message } from 'antd';

import '@/config/i18n';
import apis from '../library/apis';

message.config({
  maxCount: 1,
  duration: 1.5
});

window.apis = (apis as unknown) as IAPIs;
window.router = createBrowserHistory();

import App from './app';

ReactDOM.render(<App />, document.getElementById('app'));
