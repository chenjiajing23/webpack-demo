import path from 'path';
import { argv } from 'yargs';

import env from '../variables';

const __DEV__ = process.env.NODE_ENV !== 'production';
const ENABLE_ANALYZE = !!argv.analyze;
const ENABLE_OPEN = argv.open || env.dev.autoOpenBrowser as true | string; // 是否自动打开浏览器

const HOST = env.dev.host;
const DEFAULT_PORT = env.dev.port;
const COPYRIGHT = `/** @preserve Powered by react-template-pc (https://github.com/chenjiajing23/react-template-pc/pull/3/files) */`;

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const PROJECT_NAME = path.parse(PROJECT_ROOT).name;
const HMR_PATH = '/__webpack_hmr';

export {
  __DEV__,
  ENABLE_ANALYZE,
  ENABLE_OPEN,
  HOST,
  DEFAULT_PORT,
  COPYRIGHT,
  PROJECT_NAME,
  PROJECT_ROOT,
  HMR_PATH,
};
