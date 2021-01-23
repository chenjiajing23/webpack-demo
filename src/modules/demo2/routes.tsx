import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouteInfo } from '@/main/router';

const Demo2 = withRouter(React.lazy(() => import('./pages/Demo2')));

const routeList: IRouteInfo[] = [
  {
    path: '/:language/demo-2',
    exact: false,
    component: () => <Demo2 />
  }
];

export default routeList;
