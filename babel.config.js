module.exports = function (api) {
  api.cache(true);

  return {
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "node": "current",
            "browsers": ["last 2 versions"],
            // "browsers": ["last 1 chrome version"]
          }
        }
      ]
    ],
    "plugins": [
      "react-hot-loader/babel",
      "@babel/plugin-transform-react-jsx",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-transform-runtime",
      "@babel/plugin-proposal-optional-chaining",
      [
        "import",
        {
          "libraryName": "antd",
          "libraryDirectory": "es",
          "style": true
        },
        "antd"
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
    "ignore": ["node_modules/**"]
  }
}
