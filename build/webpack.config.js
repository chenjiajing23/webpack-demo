const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const utils = require('./utils');
const config = require('../config');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    app: './src/main/index.tsx'
  },

  output: {
    filename: utils.assetsPath(
      isDev ? 'js/[name].[hash].js' : 'js/[name].[contenthash]-p.js'
    ),
    chunkFilename: utils.assetsPath(
      isDev ? 'js/[id].[hash].js' : 'js/[id].[contenthash]-p.js'
    ),
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
          { loader: 'thread-loader' },
          {
            loader: 'babel-loader'
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
    chunkIds: 'named',
    moduleIds: 'named',
    // runtimeChunk: { name: 'manifest' }, // 提取runtime代码命名为manifest
    // namedModules: true, // 让模块id根据路径设置，避免每增加新模块，所有id都改变，造成缓存失效的情况
    // namedChunks: true, // 避免增加entrypoint，其他文件都缓存失效
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minRemainingSize: 0,
      maxSize: 50000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'all'
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
