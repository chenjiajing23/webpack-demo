const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const base = require('./webpack.config.js');
const utils = require('./utils');
const config = require('../config');

module.exports = merge(base, {
  mode: 'development',

  entry: {
    // app: ['webpack-hot-middleware/client?path=__hmr', './src/main/index.tsx'],
    app: [path.resolve(__dirname, '../src/main/index.tsx')], // dev-server
  },
  infrastructureLogging: {
    level: 'error'
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

  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, '../dist'),
    port: config.dev.port,
    host: config.dev.host,
    // public: 'local.test.baidu.com:8080', // 需要带上端口
    // writeToDisk: true, // 文件形式输出代码
    compress: true, // 一切服务都启用gzip 压缩
    disableHostCheck: true, // true：不进行host检查
    quiet: false,
    // 设置控制台的提示信息
    stats: {
      chunks: false,
      children: false,
      modules: false,
      entrypoints: false, // 是否输出入口信息
      warnings: false,
      performance: false // 是否输出webpack建议（如文件体积大小）
    },
    watchOptions: {
      ignored: /node_modules/ // 略过node_modules目录
    },
    overlay: {
      errors: true
    },
    noInfo: false,
    historyApiFallback: true,
    // 接口代理
    proxy: {
      "/api": {
        target: 'http://localhost:1234',
        // secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
});
