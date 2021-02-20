import chalk from 'chalk';
import logSymbols from 'log-symbols';
import express from 'express';
import webpack from 'webpack';
import boxen from 'boxen';
import clearConsole from 'react-dev-utils/clearConsole';

import getPort from './utils/getPort';
import setupMiddlewares from './middlewares';
import devConfig from './configs/webpack.dev';
import WebpackOpenBrowser from './plugins/open-browser-plugin';
import { HOST, DEFAULT_PORT, ENABLE_OPEN, NETWORK_HOST } from './utils/constants';

const isInteractive = process.stdout.isTTY;

async function start() {
  const PORT = await getPort(HOST, DEFAULT_PORT);
  const localAddress = `http://localhost:${PORT}`;
  const serverAddress = `http://${HOST}:${PORT}`;
  const networkAddress = `http://${NETWORK_HOST}:${PORT}`;

  // ENABLE_OPEN 参数值可能是 true 或者是一个指定的 URL
  if (ENABLE_OPEN) {
    let openAddress = ENABLE_OPEN;
    if (ENABLE_OPEN === true) {
      openAddress = serverAddress;
      let publicPath = devConfig.output?.publicPath as string | undefined;
      // 未设置和空串都视为根路径
      publicPath = publicPath || '/';
      if (publicPath !== '/') {
        // 要注意处理没有带 '/' 前缀和后缀的情况
        openAddress = `${serverAddress}${publicPath.startsWith('/') ? '' : '/'}${publicPath}${publicPath.endsWith('/') ? '' : '/'}index.html`;
      }
    }
    devConfig.plugins!.push(new WebpackOpenBrowser({ url: openAddress as string }));
  }

  // 加载 webpack 配置，获取 compiler
  const webpackCompiler = webpack(devConfig);
  const app = setupMiddlewares(express(), webpackCompiler);

  app.devServer.waitUntilValid(_stats => {

    let message = chalk.green('Serving!');

    if (localAddress) {
      // logSymbols.success 在 windows 平台渲染为 √ ，支持的平台会显示 ✔
      message += `\n\n${chalk.bold(`- Local:`)}            ${localAddress} ${logSymbols.success}`;
    }

    if (networkAddress) {
      message += `\n${chalk.bold('- On Your Network:')}  ${networkAddress} ${logSymbols.success}`;
    }

    console.log(boxen(message, {
      padding: 1,
      borderColor: 'green',
      margin: 1
    }));
  });

  const httpServer = app.appServer.listen(PORT, HOST, () => {
    if (isInteractive) {
      clearConsole();
    }
  });

  // 我们监听了 node 信号，所以使用 cross-env-shell 而不是 cross-env
  // 参考：https://github.com/kentcdodds/cross-env#cross-env-vs-cross-env-shell
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      // 先关闭 devServer
      httpServer.close();
      // 在 ctrl + c 的时候随机输出 'See you again' 和 'Goodbye'
      console.log(
        chalk.greenBright.bold(`\n${Math.random() > 0.5 ? 'See you again' : 'Goodbye'}!`),
      );
      // 退出 node 进程
      process.exit();
    });
  });

  // CI
  if (process.env.CI !== 'true') {
    // Gracefully exit when stdin ends
    process.stdin.on('end', () => {
      httpServer.close();
      process.exit();
    });
  }
}

// 判断这个模块是不是被直接运行的
if (require.main === module) {
  start();
}
