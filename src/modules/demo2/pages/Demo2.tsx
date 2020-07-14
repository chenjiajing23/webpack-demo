import React, { PropsWithChildren, useEffect } from 'react'
import { Button } from 'antd'
import { RouteComponentProps } from 'react-router-dom'

import '../style/deme-2.less'

interface IProps {
  [key: string]: any
}

const Demo2 = (props: PropsWithChildren<IProps & RouteComponentProps>) => {
  const {} = props

  useEffect(() => {
    console.log('demo-2:', window.router.location)
  }, [])

  const onNextPage = () => {
    window.router.push({
      pathname: '/demo',
      state: { name: window.router.location.pathname }
    })
  }

  return (
    <section styleName="deme-2">
      <Button type="primary" onClick={onNextPage}>
        回到DEMO-1
      </Button>
    </section>
  )
}

export default Demo2
