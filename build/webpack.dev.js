const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const utils = require('./utils');

module.exports = merge(common, {
  mode: 'development',

  devtool: 'cheap-module-eval-source-map',

  module: {
    rules: [
      ...utils.styleLoaders(false)
    ]
  },

  devServer: {
    contentBase: '../dist',
    port: 8080,
    hot: true,
  },

  plugins: []
});