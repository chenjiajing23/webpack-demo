const path = require('path');
const chalk = require('chalk');
const express = require('express');
const fs = require('fs');

const app = express();
const config = require('../config');

let html = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), {
  encoding: 'utf8'
});

try {
  const varScript = 'window.title=999999';
  html = html.replace('<head>', `<head><script>${varScript}</script>`);
} catch (error) {
  console.error(error);
}

app.use((req, res, next) => {
  console.log('req.url:' + req.url);
  next();
});

app.all('/ping', function (req, res) {
  return res.status(200).send('OK');
});

app.all('/', function (req, res) {
  res.send(html);
});

app.use(express.static(path.join(__dirname, '../../dist')));

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
// });

app.use(function (req, res) {
  res.redirect('/');
});

app.use(function (req, res, next) {
  res.status(404).send('404');
});

const port = config.port;
app.listen(port, () => {
  console.log(chalk.green(`server start at http://localhost:${config.port}`));
});
