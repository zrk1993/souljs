import * as Koa from 'koa';

export function Auth(): Koa.Middleware {
  return async (ctx: Koa.Context, next: Function)=> {
    console.log('auth');
    await next();
  };
}
