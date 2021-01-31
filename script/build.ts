import config from './env';
import webpack from 'webpack';
import chalk from 'chalk';
// 定义环境变量
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.prod.env.NODE_ENV);
}
import prodConfig from './configs/webpack.prod';
import { ENABLE_ANALYZE } from './utils/constants';

const compiler = webpack(prodConfig);

compiler.run((error, stats) => {
  if (error) {
    console.error(error);
    return;
  };

  if (stats) {
    // process.stdout.write(
    //   stats.toString({
    //     colors: true,
    //     modules: false,
    //     children: false,
    //     chunks: false,
    //     chunkModules: false
    //   }) + '\n\n'
    // );
    const analyzeStatsOpts = {
      preset: 'normal',
      colors: true,
    };
    console.log(stats.toString(ENABLE_ANALYZE ? analyzeStatsOpts : 'minimal'));
  }

  console.log(chalk.green('  Build complete.\n'));
  console.log(
    chalk.green(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      "  Opening index.html over file:// won't work.\n"
    )
  );
});
