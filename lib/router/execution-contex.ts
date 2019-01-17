import "reflect-metadata";
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { Application } from '../application';
import { METADATA_ROUTER_PARAMS } from '../constants';
import { ParamDecoratorType } from '../enums';

export class ExecutionContex {

    private readonly appInstance: Application;
    private readonly koaInstance: Koa;
    private readonly routerInstance: any;
    private readonly RouterClass: any;

    constructor(appInstance: Application, koaInstance: Koa, RouterClass: any) {
        this.appInstance = appInstance;
        this.koaInstance = koaInstance;
        this.RouterClass = RouterClass;
        this.routerInstance = new RouterClass();
    }

    create (propertyKey: string): KoaRouter.IMiddleware  {
        return async (ctx: Koa.Context, next: Function) => {
            const params: Array<any> = this.getRouterHandlerParams(ctx, next, propertyKey);
            const response =  await this.routerInstance[propertyKey].call(this.routerInstance, ...params);
            this.handResponse(response, ctx);
        };
    }

    private handResponse(result: any, ctx: Koa.Context) {
        ctx.body = result;
    }

    private getRouterHandlerParams(ctx: Koa.Context, next: Function, propertyKey: string): Array<any> {
        const results: Array<any> = [];
        const routerParams: Array<any> = Reflect.getMetadata(METADATA_ROUTER_PARAMS, this.RouterClass.prototype, propertyKey);
        
        routerParams.forEach((param: { index: number, type: ParamDecoratorType, data: any }) => {
            results[param.index] = this.convertParamDecorator(param, ctx, next);
        });
        
        return results;
    }

    private convertParamDecorator(routerParams: { index: number, type: ParamDecoratorType, data: any }, ctx: Koa.Context, next: Function): any {
        switch(routerParams.type) {
            case ParamDecoratorType.Request: return ctx.request;
            case ParamDecoratorType.Response: return ctx.response;
            case ParamDecoratorType.Ctx: return ctx;
            case ParamDecoratorType.Next: return next;
            case ParamDecoratorType.Query: return ctx.query;
            case ParamDecoratorType.Param: return ctx.params;
            case ParamDecoratorType.Body: return ctx.request;
            case ParamDecoratorType.Session: return ctx.request;
            case ParamDecoratorType.Headers: return ctx.request.headers;
            case ParamDecoratorType.ApplicationInstance: return this.appInstance;
            case ParamDecoratorType.KoaInstance: return this.koaInstance;
            default: return undefined;
        }
    }
}