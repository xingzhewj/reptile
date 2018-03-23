require('babel-polyfill');
const babelRegister = require('babel-register');
const fs = require('fs');
const babelConfig = fs.readFileSync('./.babelrc');
babelRegister(JSON.parse(babelConfig));
require('./server/server');
