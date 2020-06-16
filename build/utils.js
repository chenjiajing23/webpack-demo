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
  var output = [
    {
      test: /\.css$/,
      include: /node_modules/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            // 如果打包后，background属性中的图片显示不出来，请检查publicPath的配置是否有误
            publicPath: '../',
            hmr: isProd ? false : true
          },
        },
        { loader: 'css-loader' }
      ]
    },
    {
      test: /\.(le|c)ss$/,
      exclude: /node_modules/,
      use: [
        { loader: 'style-loader' },
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../',
            hmr: isProd ? false : true
          },
        },
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          }
        },
        { loader: 'postcss-loader' },
        { loader: 'less-loader' }
      ]
    }
  ]

  return output
}
