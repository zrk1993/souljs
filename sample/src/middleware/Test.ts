import * as Koa from 'koa';

export function Test(): Koa.Middleware {
  return async function test(ctx: Koa.Context, next: Function) {
    console.log('test');
    await next();
  };
}
