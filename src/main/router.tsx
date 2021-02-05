import React, { useEffect, PropsWithChildren } from 'react';
import {
  Router,
  Redirect,
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';

import PageLoading from '@/components/page-loading';
import { ILangState, ILangType } from '@/store/lang/type';
import { getCurrentUrlLang } from '@/library/format';
import { useDispatch, useSelector } from 'react-redux';
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
// 重定向
// routes.push({
//   path: '/',
//   redirect: `/zh_CN/demo`
// });

console.log('>>> routes: ', JSON.stringify(routes));

const SwitchRouterComponent = (props: PropsWithChildren<RouteComponentProps>) => {
  const dispatch = useDispatch();
  const lang = useSelector<IStoreState, ILangState>(state => state.lang);

  // 监听路由变化
  useEffect(() => {
    const urlLang = getCurrentUrlLang();
    const LocalLang = localStorage.getItem('language') as ILangType | null;

    if (urlLang && LocalLang && LocalLang !== urlLang) {
      console.log(
        urlLang,
        'URL上面的语言和本地语言不一致，需要重新加载语言资源',
        lang.local
      );
      localStorage.setItem('language', urlLang);
      window.location.reload();
    }
    console.log('>>> Router Change: ', props.location);
  }, [lang.local, props.location]);

  // 初始化语言
  useEffect(() => {
    // 初始化当前语言（优先从本地获取）
    let currentLang = lang.local;
    const LocalLang = localStorage.getItem('language') as ILangType | null;
    const getLangByUrl = getCurrentUrlLang() as ILangType | null;
    const isExitLang = lang.langList.some(v => v.key === LocalLang);
    const isExitLang2 = lang.langList.some(v => v.key === getLangByUrl);

    if (isExitLang && LocalLang) {
      currentLang = LocalLang;
    }
    if (isExitLang2 && getLangByUrl) {
      currentLang = getLangByUrl;
    }
    dispatch<any>(onSwitchLang(currentLang));
    localStorage.setItem('language', currentLang);
  }, [dispatch, lang.langList, lang.local]);

  return (
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
              render={route.component}
            />
          )
        )}
        <Redirect exact={false} from={'/'} to={`/${lang.local}/demo`} />
      </Switch>
    </React.Suspense>
  );
};

const WithRouterComponent = withRouter(SwitchRouterComponent);

const RouterComponent = () => (
  <Router history={window.router}>
    <WithRouterComponent />
  </Router>
);

export default RouterComponent;
