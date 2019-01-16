import * as Koa from 'koa';

import * as KoaRouter from 'koa-router';

export class ExecutionContex {
    create (): KoaRouter.IMiddleware  {
        return async (ctx: Koa.Context, next: Function) => {
            await next();
        };
    }
}