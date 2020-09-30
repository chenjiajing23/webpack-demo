const path = require('path');
const genericNames = require('generic-names');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('../config');

exports.resolve = function (dir) {
  return path.join(__dirname, '..', dir);
};

exports.assetsPath = function (_path) {
  const assetsSubDirectory = config.base.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
};

/**
 * @description 自定义css-loader的hash值（解决css-modules的hash不一致问题）
 * @license https://github.com/gajus/babel-plugin-react-css-modules/issues/279
 */
const generate = genericNames('[path]_[name]_[local]_[hash:base64:5]', {
  context: process.cwd()
});
const generateScopedName = (localName, filePath) => {
  const relativePath = path.relative(process.cwd(), filePath);
  return generate(localName, relativePath);
};

exports.styleLoaders = function (isProd) {
  const output = [
    {
      test: /\.(css|less)$/,
      include: path.resolve(__dirname, '../src'),
      use: [
        isProd
          ? {
              loader: MiniCssExtractPlugin.loader
              // options: {
              //   publicPath: '../',
              //   hmr: isProd ? false : true
              // }
            }
          : 'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: !isProd,
            modules: {
              // localIdentName: '[path]_[name]_[local]_[hash:base64:5]',
              getLocalIdent: (context, _localIdentName, localName) => {
                return generateScopedName(localName, context.resourcePath);
              }
            }
          }
        },
        { loader: 'postcss-loader' },
        { loader: 'less-loader' }
      ]
    },
    {
      test: /\.(less)$/,
      include: path.resolve(__dirname, '../node_modules/antd'),
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
        { loader: 'css-loader' },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              modifyVars: {
                'primary-color': '#13C2C2',
                'link-color': '#13C2C2'
              },
              javascriptEnabled: true
            }
          }
        }
      ]
    }
  ];

  return output;
};
