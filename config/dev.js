module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  port: 8080,
  host: '0.0.0.0',
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
