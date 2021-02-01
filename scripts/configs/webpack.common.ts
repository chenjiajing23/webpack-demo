import { resolve } from 'path';
import WebpackBar from 'webpackbar';
import webpack, { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import WebpackBuildNotifierPlugin from 'webpack-build-notifier';

import config from '../env';
import { assetsPath } from '../utils/getPath';
import { HMR_PATH, PROJECT_NAME, PROJECT_ROOT, __DEV__ } from '../utils/constants';

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

const commonConfig: Configuration = {
  mode: 'none',

  entry: ['react-hot-loader/patch', resolve(PROJECT_ROOT, './src/main/index.tsx')],

  output: {
    filename: assetsPath(
      __DEV__ ? 'js/bundle.js' : 'js/[name].[contenthash:8].js'
    ),  //必须是绝对路径
    chunkFilename: assetsPath(
      __DEV__ ? 'js/[name].chunk.js' : 'js/[name].[contenthash:8].chunk.js'
    ),
    path: resolve(PROJECT_ROOT, `./${config.base.assetsRoot}`),
    publicPath: config.base.assetsPublicPath, //通常是CDN地址
    hashSalt: PROJECT_NAME,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@': resolve(PROJECT_ROOT, './src'),
      '@store': resolve(PROJECT_ROOT, './src/store'),
      '@library': resolve(PROJECT_ROOT, './src/library'),
      '@modules': resolve(PROJECT_ROOT, './src/modules'),
      '@style': resolve(PROJECT_ROOT, './src/style'),
      '@components': resolve(PROJECT_ROOT, './src/components')
    }
  },

  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        use: [
          { loader: 'thread-loader' },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(bmp|png|jpe?g|gif|svg)(\?.*)?$/,
        // webpack5新处理方式： https://webpack.docschina.org/guides/asset-modules/
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb，则使用base64
          }
        },
        generator: {
          filename: assetsPath('img/[name][hash:8][ext][query]')
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb，则使用base64
          }
        },
        generator: {
          filename: assetsPath('media/[name][contenthash:8][ext][query]')
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: assetsPath('fonts/[name][contenthash:8][ext][query]')
        },
        exclude: /node_modules/,
      }
    ]
  },

  plugins: [
    new WebpackBar({ name: 'react-template-pc' }),
    new FriendlyErrorsPlugin(),
    new WebpackBuildNotifierPlugin({
      title: config.base.title,
      suppressSuccess: true, // 设置只在第一次编译成功时输出成功的通知, rebuild 成功的时候不通知
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',  //打包后的文件名
      minify: __DEV__ ? false : htmlMinifyOptions, // HtmlWebpackPlugin 会调用 HtmlMinifier 对 HTMl 文件进行压缩 只在生产环境压缩
      title: config.base.title,
      inject: true,
      template: resolve(PROJECT_ROOT, './public/index.html'),
      templateParameters: (...args) => {
        const [compilation, assets, assetTags, options] = args;
        const rawPublicPath = commonConfig.output!.publicPath! as string;
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
      context: resolve(PROJECT_ROOT, './src'),
      cache: true,
      quiet: false, // 只输出error，忽略warn
      cwd: resolve('..'),
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
          context: resolve(PROJECT_ROOT, './public'),
          from: '*',
          to: resolve(PROJECT_ROOT, `./${config.base.assetsRoot}`),
          toType: 'dir',
          globOptions: {
            ignore: ['index.html'],
          },
        },
      ],
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      // minSize: {
      //   javascript: 30000,
      //   style: 50000,
      // },
      minRemainingSize: 0,
      // maxSize: {
      //   javascript: 50000,
      //   style: 50000,
      // },
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: Infinity, // 30
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
        },
        // 按包拆分
        // vendors: {
        //   test: /[\\/]node_modules[\\/]/,
        //   priority: 10,
        //   // enforce: true,
        //   name(module: { context: { match: (arg0: RegExp) => any[]; }; }) {
        //     const packageName = module.context.match(
        //       /[\\/]node_modules[\\/](.*?)([\\/]|$)/
        //     )[1];
        //     return `npm.${packageName.replace('@', '')}`;
        //   }
        // }
      }
    }
  }
};

if (__DEV__) {
  // 开发环境下注入热更新补丁
  // reload=true 设置 webpack 无法热更新时刷新整个页面，overlay=true 设置编译出错时在网页中显示出错信息遮罩
  (commonConfig.entry as string[]).unshift(
    `webpack-hot-middleware/client?path=${HMR_PATH}&reload=true&overlay=true`,
  );
}

export default commonConfig;
