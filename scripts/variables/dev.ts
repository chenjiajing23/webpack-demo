export default {
  env: {
    NODE_ENV: '"development"',
    PWD: JSON.stringify(process.env.PWD),
  },
  host: 'localhost',
  port: 8080,
  autoOpenBrowser: true, // 自动打开浏览器
  isInspectorComponent: true, // 组件定位
  assetsPublicPath: '/',
};
