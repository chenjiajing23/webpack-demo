const chalk = require('chalk')
const webpack = require('webpack')
const webpackConfig = require('./webpack.prod')

webpack(webpackConfig, function (err, stats) {
  if (err) throw err

  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n'
  )

  console.log(chalk.default.green('  Build complete.\n'))
  console.log(
    chalk.default.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
        "  Opening index.html over file:// won't work.\n"
    )
  )
})
