import React from 'react'
import { withRouter } from 'react-router-dom'
import { IRouteInfo } from '@/main/router'

const Demo = withRouter(React.lazy(() => import('./pages/Demo')))

const routeList: IRouteInfo[] = [
  {
    path: '/demo',
    exact: false,
    component: () => <Demo />
  }
]

export default routeList
