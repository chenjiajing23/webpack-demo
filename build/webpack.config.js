const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const utils = require('./utils');
const config = require('../config');
const isDev = process.env.NODE_ENV === 'development';

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

// index.html 压缩选项
const htmlMinifyOptions = {
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  useShortDoctype: true,
};

const commonConfig = {
  mode: 'none',
  entry: {
    app: path.resolve(__dirname, '../src/main/index.tsx'),
  },

  output: {
    filename: utils.assetsPath(
      isDev ? 'js/[name].[chunkhash:8].js' : 'js/[name].[contenthash:8].js'
    ),
    chunkFilename: utils.assetsPath(
      isDev ? 'js/[id].[chunkhash:8].js' : 'js/[id].[contenthash:8].js'
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
        test: /\.(bmp|png|jpe?g|gif|svg)(\?.*)?$/,
        // test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        // webpack4处理方式（勿删）
        // use: [
        //   {
        //     loader: 'url-loader',
        //     options: {
        //       limit: 10000,
        //       name: utils.assetsPath('img/[name].[contenthash:8].[ext]')
        //     }
        //   }
        // ],
        // webpack5新处理方式： https://webpack.docschina.org/guides/asset-modules/
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb，则使用base64
          }
        },
        generator: {
          filename: utils.assetsPath('img/[name][hash:8][ext][query]')
        },
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        // use: [
        //   { loader: 'thread-loader' },
        //   {
        //     loader: 'url-loader',
        //     options: {
        //       name: utils.assetsPath('media/[name].[contenthash].[ext]')
        //     }
        //   }
        // ],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb，则使用base64
          }
        },
        generator: {
          filename: utils.assetsPath('media/[name][contenthash:8][ext][query]')
        },
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        // use: [
        //   { loader: 'thread-loader' },
        //   {
        //     loader: 'url-loader',
        //     options: {
        //       name: utils.assetsPath('fonts/[name].[contenthash].[ext]')
        //     }
        //   }
        // ],
        type: 'asset/resource',
        generator: {
          filename: utils.assetsPath('fonts/[name][contenthash:8][ext][query]')
        },
        include: path.resolve(__dirname, '../src')
      }
    ]
  },

  plugins: [
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      // HtmlWebpackPlugin 会调用 HtmlMinifier 对 HTMl 文件进行压缩 只在生产环境压缩
      minify: isDev ? false : htmlMinifyOptions,
      title: config.base.title,
      template: path.resolve(__dirname, '../public/index.html'),
      templateParameters: (...args) => {
        const [compilation, assets, assetTags, options] = args;
        const rawPublicPath = commonConfig.output.publicPath;
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options,
          },
          // 在 index.html 模板中注入模板参数 PUBLIC_PATH
          // 移除最后的反斜杠为了让拼接路径更自然，例如：<%= `${PUBLIC_PATH}/favicon.ico` %>
          PUBLIC_PATH: rawPublicPath.endsWith('/')
            ? rawPublicPath.slice(0, -1)
            : rawPublicPath,
        };
      },
    }),
    new WebpackBuildNotifierPlugin({
      title: config.base.title,
      suppressSuccess: true
    }),
    /**
     * @desc 内置插件，也可以使用 `moment-locales-webpack-plugin` -> https://www.npmjs.com/package/moment-locales-webpack-plugin
     * @url https://www.webpackjs.com/plugins/context-replacement-plugin/
     * @more @{moment} // https://github.com/moment/moment/tree/develop/dist/locale
     */
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|ja|zh-hk/),
    new ESLintPlugin({
      extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      formatter: require.resolve('react-dev-utils/eslintFormatter'),
      eslintPath: require.resolve('eslint'),
      context: path.resolve(__dirname, '../src'),
      cache: true,
      quiet: false, // 只输出error，忽略warn
      cwd: path.resolve('..'),
      fix: true, // 自动修复
      resolvePluginsRelativeTo: __dirname,
      baseConfig: {
        extends: [require.resolve('eslint-config-react-app/base')],
        rules: {
          ...(!hasJsxRuntime && {
            'react/react-in-jsx-scope': 'error'
          })
        }
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, '../public'),
          from: '*',
          to: path.resolve(__dirname, '../dist'),
          toType: 'dir',
          globOptions: {
            ignore: ['index.html'],
          },
        },
      ],
    }),
  ],

  optimization: {
    chunkIds: "deterministic",
    moduleIds: "deterministic",
    splitChunks: {
      chunks: 'all',
      minSize: {
        javascript: 30000,
        style: 50000,
      },
      minRemainingSize: 0,
      maxSize: {
        javascript: 50000,
        style: 50000,
      },
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: Infinity, // 30
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        default: false,
        // defaultVendors: {
        //   test: /[\\/]node_modules[\\/]/,
        //   priority: -10,
        //   chunks: 'all'
        // },
        // default: {
        //   minChunks: 2,
        //   priority: -20,
        //   reuseExistingChunk: true
        // },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          // enforce: true,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `npm.${packageName.replace('@', '')}`;
          }
        }
      }
    }
  }
};

module.exports = commonConfig;
