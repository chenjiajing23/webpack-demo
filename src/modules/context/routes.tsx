import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouteInfo } from '@/main/router';

const Context = withRouter(React.lazy(() => import('./pages/Context')));

const routeList: IRouteInfo[] = [
  {
    path: '/context',
    exact: false,
    component: () => <Context />
  }
];

export default routeList;
