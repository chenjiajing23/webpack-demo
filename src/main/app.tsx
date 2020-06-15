import React from "react";

import './../style/reset.less'
import Demo from '@/modules/demo/pages/demo'

interface IProps {
  [key: string]: any
}

interface IState {
  [key: string]: any
}

export default class App extends React.Component<IProps, IState> {
  render() {
    return (
      <section>
        <Demo text={'我是你大爷'} />
      </section>
    )
  }
}