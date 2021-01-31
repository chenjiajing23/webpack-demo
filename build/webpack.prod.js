const os = require('os');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require("postcss-safe-parser");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const base = require('./webpack.config.js');
const utils = require('./utils');
const config = require('../config');
const shouldUseSourceMap = config.prod.productionSourceMap;

const webpackConfig = merge(base, {
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
  webpackConfig.plugins.push(new CompressionWebpackPlugin({
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
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
  const SizePlugin = require('size-plugin');

  prodConfig.plugins.push(new SizePlugin({ writeFile: false }),
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
      analyzerPort: 8888
    }));
  // const smp = new SpeedMeasurePlugin();
  // prodConfig = smp.wrap(webpackConfig);
};

module.exports = prodConfig
