import React, { FC, useState } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import classnames from 'classnames'

import '../style/demo.less'
import { setCommon } from '@/store/demo/action'
import { IWrapDemoState, IDemoState } from '@/store/demo/type'
import demeImage from '../assets/good.png'

interface IProps {
  count: number
  setCommon: (payload: Partial<IDemoState>) => void
}

const Demo: FC<IProps> = (props: IProps) => {
  const { count, setCommon } = props
  const [isShow, setShow] = useState(false)

  const increment = () => {
    setCommon({ count: count + 1 })
    setShow(!isShow)
  }

  const decrement = () => {
    setCommon({
      count: count - 1
    })
    setShow(!isShow)
  }
  if (count === 5) {
    throw new Error('测试错误边界！')
  }

  return (
    <div styleName="demo" className={classnames({ chenjiajing: isShow })}>
      <div styleName="content">
        <h1>{count}</h1>
        <Button type="primary" onClick={increment}>
          +
        </Button>
        &nbsp; &nbsp; &nbsp;
        <Button type="primary" onClick={decrement}>
          -
        </Button>
      </div>
      <img src={demeImage} alt="" />
      <div styleName="cover" />
      <hr />
      <h3>TEST-WEBHOOKS</h3>
    </div>
  )
}

const mapStateToProps = (state: IWrapDemoState) => ({
  count: state.demo.count
})

const mapDispatchToProps = (dispatch: any) => ({
  setCommon: (payload: Partial<IDemoState>) => dispatch(setCommon(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Demo)
