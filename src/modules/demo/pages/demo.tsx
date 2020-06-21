import React, { FC, useState } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import classnames from 'classnames'

import '../style/demo.less'
import { setCommon } from '@/store/demo/action'
import { IDemoState } from '@/store/demo/type'
import demeImage from '../assets/good.png'

interface IProps {
  count: number
  setCommon: (payload: any) => void
}

const Demo: FC<IProps> = (props: IProps) => {
  const { count, setCommon } = props
  const [isShow, setShow] = useState(false)

  const increment = () => {
    setCommon({
      count: count + 1
    })
    setShow(!isShow)
  }

  const decrement = () => {
    setCommon({
      count: count - 1
    })
    setShow(!isShow)
  }

  return (
    <div styleName="demo" className={classnames({ chenjiajing: isShow })}>
      <h1>{count}</h1>
      <Button type="primary" onClick={increment}>
        +
      </Button>
      &nbsp; &nbsp; &nbsp;
      <Button type="primary" onClick={decrement}>
        -
      </Button>
      <img src={demeImage} alt="" />
      <div styleName="cover" />
    </div>
  )
}

const mapStateToProps = (state: IDemoState) => ({
  count: state.demo.count
})

const mapDispatchToProps = (dispatch: any) => ({
  setCommon: (payload: any) => dispatch(setCommon(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Demo)
