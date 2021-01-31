import os from 'os';
import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import safePostCssParser from "postcss-safe-parser";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import SizePlugin from 'size-plugin';

import commonConfig from './webpack.common';
import utils from './utils';
import config from '../env';
// 生成map
const shouldUseSourceMap = config.prod.productionSourceMap;

const webpackConfig = merge(commonConfig, {
  mode: 'production',
  devtool: shouldUseSourceMap ? "source-map" : false,
  output: {
    publicPath: config.prod.assetsPublicPath
  },
  module: {
    rules: [
      ...utils.styleLoaders(true, false)
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.prod.env,
    }),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        // 生产环境打包并不频繁，可以适当调高允许使用的内存，加快类型检查速度
        memoryLimit: 1024 * 2,
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      },
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash:8].css'),
      chunkFilename: utils.assetsPath('css/[id].[contenthash:8].css')
    })
  ],

  optimization: {
    minimize: true,
    chunkIds: 'deterministic',
    moduleIds: 'deterministic',
    minimizer: [
      new TerserPlugin({
        parallel: os.cpus().length - 1,
        terserOptions: {
          compress: {
            ecma: 5,
            comparisons: false,
            drop_console: true,
            drop_debugger: true,
            inline: 2
          },
          format: {
            comments: false
          },
          mangle: {
            safari10: true,
          },
        },
        extractComments: false, // 是否提取注释到单独文件
      }),
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
          parser: safePostCssParser,
          map: shouldUseSourceMap ? { inline: false, annotation: true } : false
        },
        cssProcessorPluginOptions: {
          preset: ["default", { minifyFontValues: { removeQuotes: false } }]
        }
      }),
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
  },
});

// gzip
if (config.prod.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');
  webpackConfig.plugins!.push(new CompressionWebpackPlugin({
    cache: true,
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    compressionOptions: {
      level: 9
    },
    test: new RegExp(
      '\\.(' +
      config.prod.productionGzipExtensions.join('|') +
      ')$'
    ),
    minRatio: 0.8,
    threshold: 10240,
  }));
};

let prodConfig = webpackConfig;

// 使用 --analyze 参数构建时，会输出各个阶段的耗时和自动打开浏览器访问 bundle 分析页面
if (config.prod.bundleAnalyzerReport) {
  prodConfig.plugins!.push(new SizePlugin({ writeFile: false }),
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
      analyzerPort: 8888
    }));
  const smp = new SpeedMeasurePlugin();
  prodConfig = smp.wrap(webpackConfig);
};

export default prodConfig;
