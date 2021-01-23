import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';

import '@/config/i18n';
import apis from '../library/apis';

window.apis = apis;
window.router = createHashHistory();

import App from './app';

ReactDOM.render(<App />, document.getElementById('app'));
