
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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

  plugins: [
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[hash]p.css'),
      chunkFilename: utils.assetsPath('css/[id].[chunkhash]p.css')
    }),
  ]
});