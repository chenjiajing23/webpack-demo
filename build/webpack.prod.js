const path = require('path')
const os = require('os')
const glob = require('glob')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, '../src')
}

const utils = require('./utils')

module.exports = merge(common, {
  mode: 'production',

  devtool: 'source-map',

  output: {
    publicPath: ''
  },

  module: {
    rules: [
      ...utils.styleLoaders(true)
      // {
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   use: [
      //     {
      //       loader: 'image-webpack-loader',
      //       options: {
      //         mozjpeg: {
      //           progressive: true,
      //           quality: 65
      //         },
      //         optipng: {
      //           enabled: false
      //         },
      //         pngquant: {
      //           quality: [0.65, 0.9],
      //           speed: 4
      //         },
      //         gifsicle: {
      //           interlaced: false
      //         },
      //         webp: {
      //           quality: 75
      //         }
      //       }
      //     }
      //   ],
      //   include: path.resolve(__dirname, '../src'),
      //   exclude: /node_modules/
      // }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // new HardSourceWebpackPlugin(),
    // new HardSourceWebpackPlugin.ExcludeModulePlugin([
    //   { test: /mini-css-extract-plugin[\\/]dist[\\/]loader/ }
    // ]),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[hash]p.css'),
      chunkFilename: utils.assetsPath('css/[id].[chunkhash]p.css')
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      whitelistPatternsChildren: [/^ant/, /^src-modules/, /^src-components/]
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        parallel: os.cpus().length - 1,
        cache: true,
        sourceMap: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin(),
      new CompressionWebpackPlugin({
        compressionOptions: {
          level: 9
        },
        algorithm: 'gzip'
      })
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(le|c)ss$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
})
