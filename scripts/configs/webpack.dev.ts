import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './webpack.common';
import { styleLoaders } from './styleLoaders';
import config from '../env';
import { PROJECT_ROOT } from '../utils/constants';

const devConfig = merge(commonConfig, {
  mode: 'development',

  infrastructureLogging: {
    // 'none'| 'warn' | 'error' | 'info' | 'log' | 'verbose'
    level: 'error',
  },

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },

  devtool: 'eval-cheap-module-source-map',

  module: {
    rules: [...styleLoaders(false, true)]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 1024,
        configFile: path.resolve(PROJECT_ROOT, './tsconfig.json')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
  ]
});

export default devConfig;