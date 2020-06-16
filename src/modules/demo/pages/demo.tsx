import React, { FC } from 'react'
import { Button } from 'antd'

import '../style/demo.less'
import demeImage from '../assets/good.png'

interface IProps {
  text: string
}


const Demo: FC<IProps> = (props: IProps) => (
  <div className="demo" style={{ background: 'red' }}>
    <Button type="primary">{props.text}</Button>
    <img src={demeImage} alt="" />
  </div>
);

export default Demo