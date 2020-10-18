module.exports = {
  port: 8080,
  host: 'http://localhost',
  assetsPublicPath: '/',
  // 代理，更多请参考 => https://github.com/chimurai/http-proxy-middleware
  proxyTable: {
    '/api': {
      target: 'http://localhost:1234',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      }
    }
  }
};
