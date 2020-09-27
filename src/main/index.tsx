import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import apis from '../library/apis';

window.router = createHashHistory();
window.apis = apis;

import App from './app';

ReactDOM.render(<App />, document.getElementById('app'));
