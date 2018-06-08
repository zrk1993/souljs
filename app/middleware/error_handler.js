/**
 * Return middleware that handle exceptions in Koa.
 * Dispose to the first middleware.
 *
 * @return {function} Koa middleware.
 */
module.exports = function _() {
  return async (ctx, next) => {
    try {
      console.log(1);
      const a = await next();
      a.catch(() => {
        debugger;
      });
      console.log(2);
      debugger;
    } catch (err) {
      debugger;
      ctx.app.emit('error', err, ctx);
    }
    console.log(3);
  };
};
