import path from 'path';
import genericNames from 'generic-names';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import config from '../env';

const resolve = function (dir: string) {
  return path.join(__dirname, '..', dir);
};

const assetsPath = function (_path: string) {
  const assetsSubDirectory = config.base.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
};

/**
 * 自定义css-loader的hash值（解决css-modules的hash不一致问题）
 * https://github.com/gajus/babel-plugin-react-css-modules/issues/279
 */
const generate = genericNames('[path]_[name]_[local]_[hash:base64:5]', { context: process.cwd() });
const generateScopedName = (localName: string, filePath: string) => {
  const relativePath = path.relative(process.cwd(), filePath);
  return generate(localName, relativePath);
};

const styleLoaders = function (isProd: boolean, shouldUseSourceMap = false) {
  const output = [
    {
      test: /\.(css|less)$/,
      include: path.resolve(__dirname, '../src'),
      use: [
        isProd
          ? {
            loader: MiniCssExtractPlugin.loader
          }
          : 'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: shouldUseSourceMap,
            modules: {
              // localIdentName: '[path]_[name]_[local]_[hash:base64:5]',
              getLocalIdent: (context: { resourcePath: string; }, _localIdentName: any, localName: string) => {
                return generateScopedName(localName, context.resourcePath);
              }
            }
          }
        },
        {
          loader: 'postcss-loader', options: {
            sourceMap: shouldUseSourceMap
          }
        },
        {
          loader: 'less-loader', options: {
            sourceMap: true,
          }
        }
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

export default { resolve, assetsPath, styleLoaders }