import React from "react";
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

import './../style/reset.css'
import Demo from '@/modules/demo/pages/demo'

interface IProps {
  [key: string]: any
}

interface IState {
  [key: string]: any
}

export default class App extends React.Component<IProps, IState> {
  onClick = (value: string) => {
    console.log(99999, value)
  }

  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <section style={{ width: '100vw', height: '100vh' }} onClick={this.onClick.bind(this, '9999')}>
          <Demo text="我是你大爷" />
        </section>
      </ConfigProvider>
    )
  }
}