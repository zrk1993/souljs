const { log4js } = require('../../index');

exports.useLogger = function useLogger() {
  return async (ctx, next) => {
    await next();
    log4js.getLogger('http').log('debug', `${ctx.request.method} - ${ctx.response.status} - ${ctx.request.url}`);
  };
};
