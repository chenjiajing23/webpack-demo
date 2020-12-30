const os = require('os');
// const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const PurgecssPlugin = require('purgecss-webpack-plugin');

const utils = require('./utils');
const config = require('../config');

// const smp = new SpeedMeasurePlugin();
// const PATHS = {
//   src: path.join(__dirname, '../src')
// };

module.exports = merge(base, {
  mode: 'production',

  devtool: 'source-map',

  output: {
    publicPath: config.prod.assetsPublicPath
  },

  module: {
    rules: [
      ...utils.styleLoaders(true)
      // {
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   use: [
      //     { loader: 'thread-loader' },
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
      //   include: path.resolve(__dirname, '../src')
      // }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('production')
    // }),
    // new HardSourceWebpackPlugin(),
    // new HardSourceWebpackPlugin.ExcludeModulePlugin([
    //   { test: /mini-css-extract-plugin[\\/]dist[\\/]loader/ }
    // ]),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash:8].css'),
      chunkFilename: utils.assetsPath('css/[id].[contenthash:8].css')
    })
    // new PurgecssPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    //   whitelistPatternsChildren: [/^ant/, /^src-modules/, /^src-components/]
    // }),
    // new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
    //   openAnalyzer: false,
    //   analyzerPort: 8888
    // })
  ],

  optimization: {
    minimize: true,
    chunkIds: 'deterministic',
    moduleIds: 'deterministic',
    minimizer: [
      new TerserJSPlugin({
        parallel: os.cpus().length - 1,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          format: {
            comments: false
          }
        },
        extractComments: false
      }),
      new OptimizeCSSAssetsPlugin(),
      new CompressionWebpackPlugin({
        compressionOptions: {
          level: 9
        },
        minRatio: 0.8,
        algorithm: 'gzip'
      })
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(c)ss$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 250000
    // assetFilter: function (assetFilename) {
    //   return assetFilename.endsWith('.js');
    // }
  }
});
