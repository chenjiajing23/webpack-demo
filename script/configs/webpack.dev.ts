import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './webpack.common';
import utils from './utils';
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
    rules: [...utils.styleLoaders(false, true)]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 1024,
        configFile: path.resolve(PROJECT_ROOT, './src/tsconfig.json')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]
});

export default devConfig;






// devServer: {
//   // "start": "webpack serve --config ./build/webpack.dev.js --progress",
//   hot: true,
//   colors: true,
//   contentBase: path.resolve(__dirname, '../dist'),
//   port: config.dev.port,
//   host: config.dev.host,
//   // public: 'local.test.baidu.com:8080', // 需要带上端口
//   // writeToDisk: true, // 文件形式输出代码
//   compress: true, // 一切服务都启用gzip 压缩
//   disableHostCheck: true, // true：不进行host检查
//   quiet: true, // necessary for FriendlyErrorsPlugin
//   // 设置控制台的提示信息
//   // stats: {
//   //   chunks: false,
//   //   children: false,
//   //   modules: false,
//   //   entrypoints: false, // 是否输出入口信息
//   //   warnings: false,
//   //   performance: false // 是否输出webpack建议（如文件体积大小）
//   // },
//   watchOptions: {
//     ignored: /node_modules/ // 略过node_modules目录
//   },
//   overlay: {
//     errors: true
//   },
//   noInfo: true,
//   historyApiFallback: {
//     rewrites: [
//       { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
//     ],
//   },
//   // 接口代理
//   proxy: config.dev.proxyTable,
// },