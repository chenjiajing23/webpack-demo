import Apis from 'good-apis';
import { History } from 'history';

declare global {
  interface Window extends CICD {
    router: History<unknown>;
    apis: Apis;
  }
}

export {};
