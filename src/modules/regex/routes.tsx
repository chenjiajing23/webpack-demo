import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouteInfo } from '@/main/router';

const Regex = withRouter(React.lazy(() => import('./pages/Regex')));

const routeList: IRouteInfo[] = [
  {
    path: '/:language/regex',
    exact: false,
    component: () => <Regex />
  }
];

export default routeList;
