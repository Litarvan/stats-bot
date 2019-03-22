// eslint-disable-next-line no-global-assign
require = require('esm')(module, {
  mode: 'all',
  cjs: true
});

module.exports = require('./src/bot.js');
