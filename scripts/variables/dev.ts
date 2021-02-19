import address from 'address';

export default {
  env: {
    NODE_ENV: '"development"',
    PWD: JSON.stringify(process.env.PWD),
  },
  host: '0.0.0.0' || 'localhost',
  networkHost: address.ip(),
  port: 8080,
  autoOpenBrowser: false, // 自动打开浏览器
  isInspectorComponent: true, // 组件定位
  assetsPublicPath: '/',
};
