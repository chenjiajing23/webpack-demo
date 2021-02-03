import os from 'os';
import path from 'path';
import { BannerPlugin, ids, DefinePlugin, NoEmitOnErrorsPlugin } from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
// import SizePlugin from 'size-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CompressionWebpackPlugin from 'compression-webpack-plugin';

import commonConfig from './webpack.common';
import { styleLoaders } from './styleLoaders';
import config from '../variables';
import { assetsPath } from '../utils/getPath';
import { COPYRIGHT, PROJECT_ROOT } from '../utils/constants';
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
      ...styleLoaders(true, false)
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      'process.env': config.prod.env,
    }),
    new BannerPlugin({
      raw: true,
      banner: COPYRIGHT, // 添加版权声明
    }),
    new ids.HashedModuleIdsPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        // 生产环境打包并不频繁，可以适当调高允许使用的内存，加快类型检查速度
        memoryLimit: 1024 * 2,
        configFile: path.resolve(PROJECT_ROOT, './tsconfig.json'),
      },
    }),
    new MiniCssExtractPlugin({
      filename: assetsPath('css/[name].[contenthash:8].css'),
      chunkFilename: assetsPath('css/[id].[contenthash:8].css')
    }),
    new NoEmitOnErrorsPlugin(),
  ],

  optimization: {
    minimize: true,
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
            // comments: false
          },
          mangle: {
            safari10: true,
          },
        },
        extractComments: false, // 是否提取注释到单独文件
      }),
      // webpack5 使用
      new CssMinimizerPlugin({
        sourceMap: shouldUseSourceMap
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
    maxAssetSize: 250000,
  },
});

// 是否开启gzip压缩
if (config.prod.productionGzip) {
  webpackConfig.plugins!.push(new CompressionWebpackPlugin({
    test: new RegExp(
      '\\.(' +
      config.prod.productionGzipExtensions.join('|') +
      ')$'
    ),
    compressionOptions: {
      level: 9,
      minRatio: 0.8,
      threshold: 10240,
    },
  }));
};

let prodConfig = webpackConfig;

// 使用 --analyze 参数构建时，会输出各个阶段的耗时和自动打开浏览器访问 bundle 分析页面
if (config.prod.bundleAnalyzerReport) {
  prodConfig.plugins!.push(
    // todo webpack5 不支持 https://github.com/euclid1990/write-assets-webpack-plugin/issues/4
    // new SizePlugin({ writeFile: false, color: 'green' }),
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
      analyzerPort: 8888
    }));
  // todo webpack5 还不支持 -> (https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/149)
  // const smp = new SpeedMeasurePlugin();
  // prodConfig = smp.wrap(webpackConfig);
};

export default prodConfig;
