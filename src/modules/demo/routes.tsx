import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouteInfo } from '@/main/router';

const Demo1 = withRouter(React.lazy(() => import('./pages/Demo-1')));

const routeList: IRouteInfo[] = [
  {
    path: '/:language/demo',
    exact: false,
    component: () => <Demo1 />
  }
];

export default routeList;
