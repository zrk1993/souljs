const bodyparser = require('koa-bodyparser');

module.exports = function _() {
  return bodyparser({
    enableTypes: ['json', 'form'],
    textLimit: '1mb',
    jsonLimit: '1mb',
  });
};
