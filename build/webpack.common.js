const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const utils = require('./utils');
const config = require('../config');

module.exports = {
  entry: {
    app: './src/main/index.tsx'
  },

  output: {
    filename: utils.assetsPath('js/[name].[hash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
    path: config.base.assetsRoot,
    publicPath: config.base.assetsPublicPath
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@': utils.resolve('src'),
      '@store': utils.resolve('src/store'),
      '@library': utils.resolve('src/library'),
      '@modules': utils.resolve('src/modules'),
      '@style': utils.resolve('src/style'),
      '@components': utils.resolve('src/components')
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'thread-loader' },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ],
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.tsx?$/,
        use: [
          // { loader: 'thread-loader' },
          {
            loader: 'babel-loader'
          },
          // 注意这个 loader babel 编译之前执行
          {
            loader: 'react-dev-inspector/plugins/webpack/inspector-loader',
            options: { exclude: [path.resolve(__dirname, '../dist')] }
          },
          {
            loader: 'ts-loader',
            options: { transpileOnly: true, happyPackMode: true }
          }
        ],
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('img/[name].[contenthash].[ext]')
            }
          }
        ],
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          { loader: 'thread-loader' },
          {
            loader: 'url-loader',
            options: {
              name: utils.assetsPath('media/[name].[contenthash].[ext]')
            }
          }
        ],
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          { loader: 'thread-loader' },
          {
            loader: 'url-loader',
            options: {
              name: utils.assetsPath('fonts/[name].[contenthash].[ext]')
            }
          }
        ],
        include: path.resolve(__dirname, '../src')
      }
    ]
  },

  plugins: [
    new DefinePlugin({
      'process.env.PWD': JSON.stringify(process.env.PWD)
    }),
    new ProgressBarPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: config.base.title,
      template: path.resolve(__dirname, '../src/templates/index.ejs'),
      favicon: path.resolve(__dirname, '../src/favicon/favicon.ico'),
      inject: true
    }),
    new WebpackBuildNotifierPlugin({
      title: config.base.title,
      logo: path.resolve(__dirname, '../src/favicon/favicon.ico'),
      suppressSuccess: true
    })
  ],

  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
