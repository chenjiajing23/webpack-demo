const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
  mode: 'development',

  devtool: 'cheap-module-eval-source-map',

  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '.',
              hmr: true,
            },
          },
          'css-loader',
          'less-loader'
        ],
      },
    ]
  },

  devServer: {
    contentBase: '../dist',
    port: 8080,
    hot: true,
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    })
  ]
});