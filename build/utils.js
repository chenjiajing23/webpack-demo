const path = require('path')

exports.assetsPath = function (pathname) {
  const assetsSubDirectory = ''
  return path.posix.join(assetsSubDirectory, pathname)
}
