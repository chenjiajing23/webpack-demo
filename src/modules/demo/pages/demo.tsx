import React, { FC } from 'react'
import { Button } from 'antd'

import '../style/demo.less'
import demeImage from '../assets/good.png'

interface IProps {
  text: string
}


const Demo: FC<IProps> = (props: IProps) => (
  <div styleName="demo" style={{ background: 'gray' }}>
    <Button type="primary">{props.text}</Button>
    <img src={demeImage} alt="" />
    <div styleName="cover" />
  </div>
);

export default Demo