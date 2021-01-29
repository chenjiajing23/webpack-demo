process.env.NODE_ENV = 'development';

const opn = require('opn');
const address = require('address')
const path = require('path');
const chalk = require('chalk');
const express = require('express');
const webpack = require('webpack');
const getPort = require('get-port');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');
const history = require('connect-history-api-fallback');


const config = require('../config');
const port = config.dev.port;
const webpackConfig = require('./webpack.dev');

const main = () => {
  getPort({
    port: getPort.makeRange(port, port + 100)
  }).then(newPort => {
    const app = express();
    const compiler = webpack(webpackConfig);

    const webpackDevMiddleware = devMiddleware(compiler, {
      // logLevel: 'silent',
      publicPath: webpackConfig.output.publicPath
    });

    const webpackHotMiddleware = hotMiddleware(compiler, {
      log: false,
      heartbeat: 2000,
      path: '/__hmr'
    });

    // handle fallback for HTML5 history API（https://github.com/bripkens/connect-history-api-fallback#readme）
    app.use(history());

    app.use(webpackDevMiddleware);
    app.use(webpackHotMiddleware);

    // proxy
    Object.keys(config.dev.proxyTable).forEach(context => {
      let options = config.dev.proxyTable[context];
      if (typeof options === 'string') {
        options = {
          target: options,
          proxyTimeout: 30 * 1000
        };
      }
      app.use(context, createProxyMiddleware(options.filter || context, options));
    });

    app.use('/ping', function (_req, res) {
      res.sendStatus(200);
    });

    const uri = `http://${config.dev.host}:${newPort}`;
    // 使用address模块，自动获取本机IP
    const autoUrl = `http://${address.ip()}:${newPort}`;

    const staticPath = path.posix.join(config.dev.assetsPublicPath, config.base.assetsSubDirectory); // /static
    app.use(staticPath, express.static('./static'));

    console.log('> Starting dev server...');
    webpackDevMiddleware.waitUntilValid(() => {
      console.log(chalk.green(`\n> Listening at： ${uri}`));
      console.log(chalk.yellowBright('or'));
      console.log(chalk.green(`> Listening at： ${autoUrl} \n`));
      opn(uri);
    });
    app.listen(newPort);
  });
};

main();
