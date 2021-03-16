import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouteInfo } from '@/main/router';

const CanvasTest = withRouter(React.lazy(() => import('./pages/CanvasTest')));

const routeList: IRouteInfo[] = [
  {
    path: '/:language/CanvasTest',
    exact: false,
    component: () => <CanvasTest />
  }
];

export default routeList;
