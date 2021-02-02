module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      '@babel/preset-typescript',
      [
        "@babel/preset-env",
        {
          useBuiltIns: 'usage', // 只导入需要的 polyfill
          corejs: 3, // 指定 corjs 版本
          modules: false, // 禁用模块化方案转换
          targets: {
            node: "current",
            // "browsers": ["last 2 versions"],
            browsers: ["last 1 chrome version"]
          }
        }
      ]
    ],
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-transform-runtime",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-syntax-top-level-await",
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      [
        "import",
        {
          "libraryName": "antd",
          "libraryDirectory": "es",
          "style": "css", // `style: true` 会加载 less 文件
        }
      ],
      [
        "babel-plugin-react-css-modules",
        {
          "generateScopedName": "[path]_[name]_[local]_[hash:base64:5]",
          "exclude": "node_modules",
          "attributeNames": { "styleName": "className" },
          "handleMissingStyleName": "warn",
          "webpackHotModuleReloading": true,
          "filetypes": {
            ".less": {
              "syntax": "postcss-less"
            }
          }
        }
      ]
    ],
    env: {
      development: {
        presets: [['@babel/preset-react', { development: true }]],
        plugins: ['react-hot-loader/babel'],
      },
      production: {
        presets: ['@babel/preset-react'],
        plugins: [
          'babel-plugin-dev-expression',
          '@babel/plugin-transform-react-constant-elements',
          '@babel/plugin-transform-react-inline-elements',
        ],
      },
    },
    ignore: ["node_modules/**"]
  }
}
