import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouteInfo } from '@/main/router';

const TakePhoto = withRouter(React.lazy(() => import('./pages/TakePhoto')));

const routeList: IRouteInfo[] = [
  {
    path: '/:language/take-photo',
    exact: false,
    component: () => <TakePhoto />
  }
];

export default routeList;
