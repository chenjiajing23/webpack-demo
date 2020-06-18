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
      test: /\.css$/,
      include: /node_modules/,
      use: [
        isProd ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../',
            hmr: isProd ? false : true
          },
        } : 'style-loader',
        { loader: "thread-loader" },
        { loader: 'css-loader' }
      ]
    },
    {
      test: /\.(css|less)$/,
      exclude: /node_modules/,
      use: [
        isProd ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../',
            hmr: isProd ? false : true
          },
        } : 'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            },
          }
        },
        { loader: 'postcss-loader' },
        { loader: 'less-loader' }
      ]
    },
  ]

  return output
}
