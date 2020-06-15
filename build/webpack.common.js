const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('./utils')

module.exports = {
  entry: {
    app: './src/index.ts'
  },

  output: {
    filename: utils.assetsPath('js/[name].[hash]p.js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash]p.js'),
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: path.resolve(__dirname, "../src"),
        exclude: /node_modules/,
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  plugins: [
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