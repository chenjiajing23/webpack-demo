import React, { PropsWithChildren, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import classnames from 'classnames'

import '../style/demo.less'
import { getUserInfo } from '../apis'
import demeImage from '../assets/good.png'
import { setCommon } from '@/store/demo/action'
import { IWrapDemoState, IDemoState } from '@/store/demo/type'
import { RouteComponentProps } from 'react-router-dom'

interface IProps {
  count: number
  setCommon: (payload: Partial<IDemoState>) => void
}

const Demo1 = (props: PropsWithChildren<IProps & RouteComponentProps>) => {
  const { count, setCommon } = props
  const [isShow, setShow] = useState(false)

  useEffect(() => {
    void getUserInfo().then(res => {
      console.log(res)
    })
  }, [])

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

  const onNextPage = () => {
    window.router.push({
      pathname: '/demo-2',
      state: { name: window.router.location.pathname }
    })
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
      <Button type="primary" onClick={onNextPage}>
        到DEMO-2
      </Button>
    </div>
  )
}

const mapStateToProps = (state: IWrapDemoState) => ({
  count: state.demo.count
})

const mapDispatchToProps = (dispatch: any) => ({
  setCommon: (payload: Partial<IDemoState>) => dispatch(setCommon(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Demo1)
