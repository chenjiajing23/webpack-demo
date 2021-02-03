import path from 'path';
import { DefinePlugin, HotModuleReplacementPlugin } from 'webpack';
import { merge } from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';

import commonConfig from './webpack.common';
import { styleLoaders } from './styleLoaders';
import config from '../variables';
import { PROJECT_ROOT } from '../utils/constants';

const devConfig = merge(commonConfig, {
  mode: 'development',

  // 如果觉得还可以容忍更慢的非 eval 类型的 sourceMap，可以搭配 error-overlay-webpack-plugin（已集成） 使用
  devtool: 'cheap-module-source-map',

  infrastructureLogging: {
    // 'none'| 'warn' | 'error' | 'info' | 'log' | 'verbose'
    level: 'none',
  },

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },

  module: {
    rules: [...styleLoaders(false, true)]
  },

  plugins: [
    new DefinePlugin({
      'process.env': config.dev.env,
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 1024,
        configFile: path.resolve(PROJECT_ROOT, './tsconfig.json')
      }
    }),
    new HotModuleReplacementPlugin(),
    new ErrorOverlayPlugin(),
  ]
});

export default devConfig;