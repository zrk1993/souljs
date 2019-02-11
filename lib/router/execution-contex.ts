import 'reflect-metadata';
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { ResponseHandler } from './response-handler';
import { Application } from '../application';
import { METADATA_ROUTER_PARAMS, METADATA_ROUTER_RENDER_VIEW } from '../constants';
import { ParamDecoratorType } from '../enums';

export class ExecutionContex {
  private readonly appInstance: Application;
  private readonly contextInstance: any;
  private readonly ContextClass: any;
  private readonly responseHandler: ResponseHandler;

  constructor(
    appInstance: Application,
    responseHandler: ResponseHandler,
    ContextClass: any,
    ContextClassArgs: any[] = [],
  ) {
    this.appInstance = appInstance;
    this.ContextClass = ContextClass;
    this.responseHandler = responseHandler;
    this.contextInstance = new ContextClass(...ContextClassArgs);
  }

  create(propertyKey: string): KoaRouter.IMiddleware {
    const renderViewPath = Reflect.getMetadata(METADATA_ROUTER_RENDER_VIEW, this.ContextClass.prototype, propertyKey);

    return async (ctx: Koa.Context, next: () => void) => {
      const params: any[] = this.getRouterHandlerParams(ctx, next, propertyKey) || [];

      const response = await this.contextInstance[propertyKey].call(this.contextInstance, ...params);

      if (response === undefined) {
        return;
      }

      if (renderViewPath) {
        await this.responseHandler.responseHtml(ctx, response, renderViewPath);
      } else {
        this.responseHandler.responseJson(ctx, response);
      }
    };
  }

  private getRouterHandlerParams(ctx: Koa.Context, next: () => void, propertyKey: string): any[] {
    const results: any[] = [];
    const routerParams: any[] =
      Reflect.getMetadata(METADATA_ROUTER_PARAMS, this.ContextClass.prototype, propertyKey) || [];

    routerParams.forEach((param: { index: number; type: ParamDecoratorType; data: any }) => {
      results[param.index] = this.convertParamDecorator(param, ctx, next);
    });

    return results;
  }

  private convertParamDecorator(
    param: { index: number; type: ParamDecoratorType; data: any },
    ctx: Koa.Context | any,
    next: () => void,
  ): any {
    switch (param.type) {
      case ParamDecoratorType.Request:
        return ctx.request;
      case ParamDecoratorType.Response:
        return ctx.response;
      case ParamDecoratorType.Ctx:
        return ctx;
      case ParamDecoratorType.Next:
        return next;
      case ParamDecoratorType.Query:
        return param.data && ctx.request.query ? ctx.request.query[param.data] : ctx.request.query;
      case ParamDecoratorType.Body:
        return param.data && ctx.request.body ? ctx.request.body[param.data] : ctx.request.body;
      case ParamDecoratorType.ApplicationInstance:
        return this.appInstance;
      case ParamDecoratorType.KoaInstance:
        return this.appInstance.getKoaInstance();
      default:
        return undefined;
    }
  }
}
