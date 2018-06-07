const log4js = require('log4js');

module.exports = function createLogger() {
  log4js.configure({
    appenders: { out: { type: 'stdout', layout: { type: 'messagePassThrough' } } },
    categories: { default: { appenders: ['out'], level: 'info' } },
  });

  return log4js;
};
