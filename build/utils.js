const path = require('path')

exports.resolve = function (dir) {
  return path.join(__dirname, '..', dir)
}

exports.assetsPath = function (pathname) {
  const assetsSubDirectory = ''
  return path.posix.join(assetsSubDirectory, pathname)
}
