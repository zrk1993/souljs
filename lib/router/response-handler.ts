import * as Koa from 'koa';
import { Application } from '../application';

export class ResponseHandler {
  private readonly appInstance: Application;

  constructor(appInstance: Application) {
    this.appInstance = appInstance;
  }

  responseJson(ctx: Koa.Context, response: any) {
    ctx.body = response;
  }

  async responseHtml(ctx: Koa.Context, response: any, view: string) {
    await ctx.render(view, response);
  }

  notFoundException(ctx: Koa.Context, error: any) {
    // ctx.request.accept
  }

  badRequestException(ctx: Koa.Context, error: any) {}

  forbiddenException(ctx: Koa.Context, error: any) {}

  internalServerErrorException(ctx: Koa.Context, error: any) {
    ctx.status = 500;
    if (error instanceof Error) {
      ctx.body = error.message;
    } else {
      ctx.body = error;
    }
  }
}
