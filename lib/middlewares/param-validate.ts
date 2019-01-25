import * as joi from 'joi';
import * as Koa from 'koa';

/**
 * Return middleware that handle exceptions in Koa.
 * Dispose to the first middleware.
 *
 * @return {function} Koa middleware.
 */

const joiOptions = {
  allowUnknown: true, // 允许出现未声明的字段
  stripUnknown: true, // 移除未声明的字段
};
export function ParamValidate(schema: joi.AnySchema, option: any): Koa.Middleware {
  return async (ctx, next) => {
    const data = option.type === 'query' ? ctx.request.query : ctx.request.body;
    const result = joi.validate(data, schema, joiOptions);
    if (result.error === null) {
      ctx.reqData = result.value;
      if (option.type === 'query') {
        ctx.request.query = result.value;
      } else {
        ctx.request.body = result.value;
      }
      await next();
    } else {
      throw result.error;
    }
  };
}
