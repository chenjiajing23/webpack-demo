import React from 'react'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import zhCN from 'antd/es/locale/zh_CN'

import './../style/reset.css'
import Demo from '@/modules/demo/pages/demo'
import reducers from '../store/reducers'

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk, promise)))

interface IProps {
  [key: string]: any
}

interface IState {
  [key: string]: any
}

export default class App extends React.Component<IProps, IState> {
  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <section style={{ width: '100vw', height: '100vh' }}>
            <Demo text="我是你大爷" />
          </section>
        </Provider>
      </ConfigProvider>
    )
  }
}
