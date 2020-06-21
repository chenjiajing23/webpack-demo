import React from 'react'
import { withRouter } from 'react-router-dom'

const Demo = withRouter(React.lazy(() => import('./pages/demo')))

export default [
  {
    path: '/demo',
    exact: false,
    component: () => <Demo />
  }
]
