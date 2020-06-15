import React from 'react'

import '../style/demo.less'

interface IProps {
  text: string
}

const Demo = (props: IProps) => {
  return <div className="demo">Demo{props.text}</div>
}

export default Demo