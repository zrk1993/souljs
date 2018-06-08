/**
 * Return middleware that handle exceptions in Koa.
 * Dispose to the first middleware.
 *
 * @return {function} Koa middleware.
 */
module.exports = async (ctx, next) => {
  try {
    console.log(1);
    await next();
    console.log(2);
    debugger;
  } catch (err) {
    debugger;
    ctx.app.emit('error', err, ctx);
  }
  console.log(3);
};
