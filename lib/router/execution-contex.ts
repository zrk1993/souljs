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
    ContextClassArgs: Array<any> = [],
  ) {
    this.appInstance = appInstance;
    this.ContextClass = ContextClass;
    this.responseHandler = responseHandler;
    this.contextInstance = new ContextClass(...ContextClassArgs);
  }

  create(propertyKey: string): KoaRouter.IMiddleware {
    const renderViewPath = Reflect.getMetadata(METADATA_ROUTER_RENDER_VIEW, this.ContextClass.prototype, propertyKey);

    return async (ctx: Koa.Context, next: Function) => {
      const params: Array<any> = this.getRouterHandlerParams(ctx, next, propertyKey) || [];

      try {
        const response = await this.contextInstance[propertyKey].call(this.contextInstance, ...params);

        if (renderViewPath) {
          await this.responseHandler.responseHtml(ctx, response, renderViewPath);
        } else {
          this.responseHandler.responseJson(ctx, response);
        }
      } catch (error) {
        console.error('请求处理异常Error: %O', error);
        this.responseHandler.internalServerErrorException(ctx, error);
      }
    };
  }

  private getRouterHandlerParams(ctx: Koa.Context, next: Function, propertyKey: string): Array<any> {
    const results: Array<any> = [];
    const routerParams: Array<any> =
      Reflect.getMetadata(METADATA_ROUTER_PARAMS, this.ContextClass.prototype, propertyKey) || [];

    routerParams.forEach((param: { index: number; type: ParamDecoratorType; data: any }) => {
      results[param.index] = this.convertParamDecorator(param, ctx, next);
    });

    return results;
  }

  private convertParamDecorator(
    param: { index: number; type: ParamDecoratorType; data: any },
    ctx: Koa.Context,
    next: Function,
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
      case ParamDecoratorType.Session:
        return ctx.session;
      case ParamDecoratorType.Headers:
        return ctx.request.headers;
      case ParamDecoratorType.Cookies:
        return ctx.cookies;
      case ParamDecoratorType.ApplicationInstance:
        return this.appInstance;
      case ParamDecoratorType.KoaInstance:
        return this.appInstance.getKoaInstance();
      default:
        return undefined;
    }
  }
}
