/// <reference path="apis.d.ts" />
import { History } from 'history';

declare global {
  interface Window extends CICD {
    router: History<unknown>;
    apis: IAPIs;
  }
}

export {};
