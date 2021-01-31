module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  port: 8080,
  autoOpenBrowser: true,
  assetsPublicPath: '/',
  // 代理，更多(https://github.com/chimurai/http-proxy-middleware)
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
