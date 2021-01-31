import path from 'path';
import genericNames from 'generic-names';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * 自定义css-loader的hash值（解决css-modules的hash不一致问题）
 * https://github.com/gajus/babel-plugin-react-css-modules/issues/279
 */
const generate = genericNames('[path]_[name]_[local]_[hash:base64:5]', { context: process.cwd() });
const generateScopedName = (localName: string, filePath: string) => {
  const relativePath = path.relative(process.cwd(), filePath);
  return generate(localName, relativePath);
};

// style files regexes
const cssRegex = /\.css$/;
const lessRegex = /\.less$/;

const styleLoaders = function (isProd: boolean, shouldUseSourceMap = false) {
  const output = [
    {
      test: cssRegex,
      use: [
        isProd ? { loader: MiniCssExtractPlugin.loader } : 'style-loader',
        {
          loader: "css-loader",
          options: {
            sourceMap: shouldUseSourceMap,
            modules: {
              getLocalIdent: (context: { resourcePath: string; }, _localIdentName: string, localName: string) => {
                return generateScopedName(localName, context.resourcePath);
              }
            },
            importLoaders: 1
          }
        },
        { loader: "postcss-loader" },
      ],
    },
    {
      test: lessRegex,
      use: [
        isProd ? { loader: MiniCssExtractPlugin.loader } : 'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: shouldUseSourceMap,
            modules: {
              // 默认 localIdentName: '[path]_[name]_[local]_[hash:base64:5]',
              getLocalIdent: (context: { resourcePath: string; }, _localIdentName: string, localName: string) => {
                return generateScopedName(localName, context.resourcePath);
              }
            },
            importLoaders: 2
          }
        },
        {
          loader: 'postcss-loader', options: {
            sourceMap: shouldUseSourceMap
          }
        },
        {
          loader: 'less-loader',
          options: {
            sourceMap: shouldUseSourceMap,
            lessOptions: {
              modifyVars: {
                'primary-color': '#13C2C2',
                'link-color': '#13C2C2'
              },
              javascriptEnabled: true,
            }
          }
        }
      ]
    },
  ];

  return output;
};

export { styleLoaders }