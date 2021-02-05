import path from 'path';
import genericNames from 'generic-names';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { PROJECT_ROOT } from '../utils/constants';

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
      include: path.resolve(PROJECT_ROOT, './src'),
      use: [
        isProd ? { loader: MiniCssExtractPlugin.loader } : 'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: shouldUseSourceMap,
            modules: {
              // localIdentName: '[path]_[name]_[local]_[hash:base64:5]',
              getLocalIdent: (context: { resourcePath: string; }, _localIdentName: string, localName: string) => {
                return generateScopedName(localName, context.resourcePath);
              }
            }
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: shouldUseSourceMap
          }
        },
        {
          loader: 'less-loader',
          options: {
            sourceMap: shouldUseSourceMap,
            lessOptions: {
              javascriptEnabled: true,
            }
          }
        }
      ]
    },
    // 处理antd
    {
      test: /\.css$/,
      include: path.resolve(PROJECT_ROOT, './node_modules/antd'),
      use: [
        isProd ? { loader: MiniCssExtractPlugin.loader } : 'style-loader',
        {
          loader: "css-loader",
        }
      ],
    },
  ];

  return output;
};

export { styleLoaders }