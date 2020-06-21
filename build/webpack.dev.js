const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
const common = require('./webpack.common.js')

const utils = require('./utils')

module.exports = merge(common, {
  mode: 'development',

  entry: {
    app: ['react-hot-loader/patch', './src/main/index.tsx']
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

  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    port: 8080,
    hot: true,
    host: '0.0.0.0',
    quiet: false,
    overlay: {
      errors: true
    },
    compress: true,
    noInfo: true,
    historyApiFallback: true
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     pathRewrite: { '^/api': '' },
    //     secure: false,
    //     changeOrigin: true
    //   }
    // }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerPort: 'auto'
    })
  ]
})
