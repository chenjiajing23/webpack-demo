const os = require('os');
const path = require('path');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 })

const utils = require('./utils')

module.exports = {
  entry: {
    app: './src/main/index.tsx'
  },

  output: {
    filename: utils.assetsPath('js/[name].[hash]p.js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash]p.js'),
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
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
        use: ['happypack/loader?id=babel'],
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: 'happypack/loader?id=tsx',
        include: path.resolve(__dirname, "../src"),
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },

  plugins: [
    new HappyPack({
      id: 'tsx',
      threadPool: happyThreadPool,
      loaders: [
        { loader: 'babel-loader' },
        {
          loader: 'ts-loader',
          options: { transpileOnly: true, happyPackMode: true }
        }
      ]
    }),
    new HappyPack({
      id: 'babel',
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: 'babel-loader?cacheDirectory'
        }
      ]
    }),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'production',
      template: path.resolve(__dirname, '../src/templates/index.ejs'),
      favicon: path.resolve(__dirname, '../src/favicon/favicon.ico'),
      inject: true
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "async",
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