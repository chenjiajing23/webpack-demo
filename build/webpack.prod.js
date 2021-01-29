const os = require('os');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require("postcss-safe-parser");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const PurgecssPlugin = require('purgecss-webpack-plugin');

const base = require('./webpack.config.js');
const utils = require('./utils');
const config = require('../config');
const shouldUseSourceMap = config.prod.productionSourceMap;

// const smp = new SpeedMeasurePlugin();
// const PATHS = {
//   src: path.join(__dirname, '../src')
// };

const webpackConfig = merge(base, {
  mode: 'production',
  devtool: shouldUseSourceMap ? "source-map" : false,
  output: {
    publicPath: config.prod.assetsPublicPath
  },
  module: {
    rules: [
      ...utils.styleLoaders(true, false)
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
    new webpack.DefinePlugin({
      'process.env': config.prod.env,
    }),
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
      new OptimizeCSSAssetsPlugin(
        {
          cssProcessorOptions: {
            safe: true,
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true
              }
              : false
          },
          cssProcessorPluginOptions: {
            preset: ["default", { minifyFontValues: { removeQuotes: false } }]
          }
        }
      ),
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

// 分析打包文件
if (config.prod.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    openAnalyzer: true,
    analyzerPort: 8888
  }))
};

module.exports = webpackConfig
