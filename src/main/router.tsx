import React, { useEffect, useCallback, PropsWithChildren } from 'react';
import {
  HashRouter,
  Redirect,
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';

import store from '../store';
import PageLoading from '@/components/page-loading';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import { ILangState, ILangType } from '@/store/lang/type';
import { getCurrentUrlLang } from '@/library/format';
import { useSelector } from 'react-redux';
import { IStoreState } from '@/store/type';
import { onSwitchLang } from '@/store/lang/action';

export interface IRouteInfo {
  exact?: boolean;
  path: string;
  redirect?: string;
  component?: () => JSX.Element;
}

let routes: IRouteInfo[] = [];

try {
  const context = require.context(`../modules`, true, /.*\/routes\.tsx?$/);
  context.keys().forEach((key: string) => {
    const route = context(key).default;
    routes = routes.concat(route);
  });
} catch (err) {
  console.warn(err.message);
}

// 初始化当前语言（优先从本地获取）
const InitLang = store.getState().lang; // 获取初始化的redux，不是响应式的（因为不在组件中）
let currentLang = InitLang.local;
const LocalLang = localStorage.getItem('language') as ILangType | null;
const isExitLang = InitLang.langList.some(v => v.key === LocalLang);

if (isExitLang && LocalLang) {
  currentLang = LocalLang;

  // 更新到redux
  store.dispatch<any>(onSwitchLang(LocalLang));
} else {
  // 保存语言到本地
  localStorage.setItem('language', currentLang);
}

// 重定向
routes.push({
  path: '/',
  redirect: `/${currentLang}/demo`
});

console.log('>>> routes: ', JSON.stringify(routes));

const SwitchRouterComponent = (props: PropsWithChildren<RouteComponentProps>) => {
  const lang = useSelector<IStoreState, ILangState>(state => state.lang);
  // 监听路由变化
  const onHandleRoute = useCallback(() => {
    const urlLang = getCurrentUrlLang();

    if (urlLang && lang.local !== urlLang) {
      console.log(
        urlLang,
        'URL上面的语言和内存语言不一致，需要重新加载语言资源',
        lang.local
      );
      localStorage.setItem('language', urlLang);
      window.location.reload();
    }
    console.log('>>> Router Change: ');
    console.table(props.location);
  }, [lang.local, props.location]);

  useEffect(() => {
    onHandleRoute();
  }, [onHandleRoute]);

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
  );
};

const WithRouterComponent = withRouter(SwitchRouterComponent);

const RouterComponent = () => (
  <HashRouter>
    <WithRouterComponent />
  </HashRouter>
);

export default RouterComponent;
