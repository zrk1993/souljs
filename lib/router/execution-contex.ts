import "reflect-metadata";
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { Application } from '../application';
import { METADATA_ROUTER_PARAMS } from '../constants';
import { ParamDecoratorType } from '../enums';

export class ExecutionContex {

    private readonly appInstance: Application;
    private readonly contextInstance: any;
    private readonly ContextClass: any;

    constructor(appInstance: Application, ContextClass: any, ContextClassArgs: Array<any> = []) {
        this.appInstance = appInstance;
        this.ContextClass = ContextClass;
        this.contextInstance = new ContextClass(...ContextClassArgs);
    }

    create (propertyKey: string, handResponse?: (response: any | Error, ctx: Koa.Context) => void): KoaRouter.IMiddleware  {
        
        const fn =  async (ctx: Koa.Context, next: Function) => {
            const params: Array<any> = this.getRouterHandlerParams(ctx, next, propertyKey) || [];

            try {
                const response =  await this.contextInstance[propertyKey].call(this.contextInstance, ...params);

                if (typeof handResponse === 'function') {
                    handResponse(response, ctx);
                }
            } catch (error) {
                console.error('请求处理异常 %s, Error: %O', fn.lable, error);
            }
        };

        fn.lable = `${this.ContextClass.name}.${propertyKey}`;

        return fn;
    }

    private getRouterHandlerParams(ctx: Koa.Context, next: Function, propertyKey: string): Array<any> {
        const results: Array<any> = [];
        const routerParams: Array<any> = Reflect.getMetadata(METADATA_ROUTER_PARAMS, this.ContextClass.prototype, propertyKey) || [];
        
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
            case ParamDecoratorType.Body: return ctx.request.body;
            case ParamDecoratorType.Session: return ctx.session;
            case ParamDecoratorType.Headers: return ctx.request.headers;
            case ParamDecoratorType.Cookies: return ctx.cookies;
            case ParamDecoratorType.ApplicationInstance: return this.appInstance;
            case ParamDecoratorType.KoaInstance: return this.appInstance.getKoaInstance();
            default: return undefined;
        }
    }
}