// const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');
const base = require('./webpack.config.js');

const utils = require('./utils');
// const config = require('../config');

module.exports = merge(base, {
  mode: 'development',

  entry: {
    app: ['webpack-hot-middleware/client?path=__hmr', './src/main/index.tsx']
  },

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },

  devtool: 'cheap-module-eval-source-map',

  module: {
    rules: [...utils.styleLoaders(false)]
  },

  // devServer: {
  //   hot: true,
  //   contentBase: path.resolve(__dirname, '../dist'),
  //   port: config.dev.port,
  //   host: config.dev.host,
  //   // public: 'local.test.baidu.com:8080', // 需要带上端口
  //   // writeToDisk: true, // 文件形式输出 dev-server 代码
  //   compress: true, // 一切服务都启用gzip 压缩
  //   disableHostCheck: true, // true：不进行host检查
  //   quiet: false,
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
  //   noInfo: false,
  //   historyApiFallback: true
  //   // 接口代理（这段配置更推荐：写到package.json，再引入到这里）
  //   // proxy: {
  //   //   "/api-dev": {
  //   //     "target": "http://api.test.xxx.com",
  //   //     "secure": false,
  //   //     "changeOrigin": true,
  //   //     "pathRewrite": { // 将url上的某段重写（例如此处是将 api-dev 替换成了空）
  //   //       "^/api-dev": ""
  //   //     }
  //   //   }
  //   // },
  // },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerPort: 8888
    })
  ]
});
