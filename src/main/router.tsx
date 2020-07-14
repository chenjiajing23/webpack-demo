import React, { useEffect, useCallback, PropsWithChildren } from 'react'
import { HashRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom'

import PageLoading from '@/components/page-loading'
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary'

export interface IRouteInfo {
  exact?: boolean
  path: string
  redirect?: string
  component?: () => JSX.Element
}

let routes: IRouteInfo[] = []

try {
  const context = require.context(`../modules`, true, /.*\/routes\.tsx?$/)
  context.keys().forEach((key: string) => {
    const route = context(key).default
    routes = routes.concat(route)
  })
} catch (err) {
  console.warn(err.message)
}

routes.push({
  path: '/',
  redirect: '/demo'
})

console.log('>>> routes: ', JSON.stringify(routes))

const SwitchRouterComponent = (props: PropsWithChildren<{ [key: string]: any }>) => {
  // 统一重定向到特定路由
  const onHandleRoute = useCallback(() => {
    console.log('>>> Router Change: ', props.location)
  }, [props.location])

  useEffect(() => {
    onHandleRoute()
  }, [onHandleRoute])

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<PageLoading />}>
        <Switch>
          {routes.map(route =>
            route.redirect ? (
              <Redirect
                exact={route.exact}
                key={route.redirect}
                from={route.path}
                to={route.redirect}
              />
            ) : (
              <Route
                key={route.path}
                path={route.path}
                exact={route.exact}
                component={route.component}
              />
            )
          )}
          {/* <Redirect from="/" to="/" /> */}
        </Switch>
      </React.Suspense>
    </ErrorBoundary>
  )
}

const WithRouterComponent = withRouter(SwitchRouterComponent)

const RouterComponent = () => (
  <HashRouter>
    <WithRouterComponent />
  </HashRouter>
)

export default RouterComponent
