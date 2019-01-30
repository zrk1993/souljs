import * as Koa from 'koa';

export function Auth(): Koa.Middleware {
  return async function auth(ctx: Koa.Context, next: () => void) {
    await next();
  };
}
