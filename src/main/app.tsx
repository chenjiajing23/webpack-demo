import React from 'react';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';

import './../style/reset.css';
import './../style/font.css';
import store from '../store';
import Local from './local';

const App = (props: JSX.IntrinsicAttributes) => (
  <Provider store={store}>
    <Local {...props} />
  </Provider>
);

export default hot(App);
