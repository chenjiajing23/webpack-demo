import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';

import '@/config/i18n';
import apis from '../library/apis';

window.apis = apis;
window.router = createBrowserHistory();

import App from './app';

ReactDOM.render(<App />, document.getElementById('app'));
