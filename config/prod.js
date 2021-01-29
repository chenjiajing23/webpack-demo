/*
 * @Description: 线上CDN路径（腾讯云服务器）
 * @Author: Chenjiajing
 * @Date: 2020-09-30 14:49:00
 * @LastEditors: Chenjiajing
 * @LastEditTime: 2021-01-29 16:41:38
 */

module.exports = {
  // 环境变量
  env: {
    NODE_ENV: '"production"'
  },
  productionSourceMap: false,
  // Gzip off by default as many popular static hosts such as
  // Surge or Netlify already gzip all static assets for you.
  // Before setting to `true`, make sure to:
  // npm install --save-dev compression-webpack-plugin
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],
  // 上线资源路径配置
  assetsPublicPath: 'http://localhost:8080/', // 'http://150.158.180.163:8080/'
  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report
};
