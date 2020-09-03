const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.resolve = function (dir) {
  return path.join(__dirname, '..', dir)
}

exports.assetsPath = function (pathname) {
  const assetsSubDirectory = ''
  return path.posix.join(assetsSubDirectory, pathname)
}

exports.styleLoaders = function (isProd) {
  const output = [
    {
      test: /\.(css|less)$/,
      include: path.resolve(__dirname, '../src'),
      use: [
        isProd
          ? {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../',
                hmr: isProd ? false : true
              }
            }
          : 'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
            }
          }
        },
        { loader: 'postcss-loader' },
        { loader: 'less-loader' }
      ]
    },
    {
      test: /\.(css|less)$/,
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
  ]

  return output
}
