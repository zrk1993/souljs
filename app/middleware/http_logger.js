const { logger } = require('../../index');

module.exports = function useLogger() {
  return async (ctx, next) => {
    const start = Date.now();
    await next();
    logger.getLogger('http').log('debug', `${ctx.request.method} - ${ctx.response.status} - ${ctx.request.url} - ${Date.now() - start}ms`);
  };
};
