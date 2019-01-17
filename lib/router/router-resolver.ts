import "reflect-metadata";
import * as Path from 'path';
import * as KoaRouter from 'koa-router';
import * as Koa from 'koa';
import { ExecutionContex } from './execution-contex';
import { Application } from '../application';
import { METADATA_ROUTER_METHOD, METADATA_ROUTER_PATH, METADATA_ROUTER_MIDDLEWARE } from '../constants';

export class RouterResolver {
    private readonly routers: Array<Function>;
    private readonly appInstance: Application;
    private readonly koaRouter: KoaRouter;

    constructor(routers: Array<Function>, appInstance: Application, options?: Object) {
        this.routers = routers;
        this.appInstance = appInstance;
        this.koaRouter = new KoaRouter();
    }

    resolve() {
        this.routers.forEach((router: Function) => {
            this.registerRouter(router);
        });

        this.appInstance.getKoaInstance()
            .use(this.koaRouter.routes())
            .use(this.koaRouter.allowedMethods());
    }

    private registerRouter(Router: any) {

        const executionContex = new ExecutionContex(this.appInstance, this.appInstance.getKoaInstance(), Router);

        const routerMiddlewares = this.getMiddlewares(Router);

        const requestMappings = this.getRequestMappings(Router.prototype);

        requestMappings.forEach((prop) => {
            const requestPath: string = Path.join(Reflect.getMetadata(METADATA_ROUTER_PATH, Router),
                Reflect.getMetadata(METADATA_ROUTER_PATH, Router.prototype, prop));
            const requestMethod: string= Reflect.getMetadata(METADATA_ROUTER_METHOD, Router.prototype, prop);

            const propMiddlewares = this.getMiddlewares(Router.prototype, prop);

            this.koaRouterRegisterHelper(requestMethod)(requestPath, ...routerMiddlewares, ...propMiddlewares, executionContex.create(prop, this.handResponse));
        });
    }

    private getMiddlewares(target: any, propertyKey?: string): Array<Function> {
        const middlewares: Array<{ middlewareClass: any, args: Array<any> }> = Reflect.getMetadata(METADATA_ROUTER_MIDDLEWARE, target, propertyKey) || [];
        
        return middlewares.map((mid) => {
            const executionContex = new ExecutionContex(this.appInstance, this.appInstance.getKoaInstance(), mid.middlewareClass, mid.args);
            return executionContex.create('pip');
        });
    }

    private handResponse(response: any | Error, ctx: Koa.Context) {
        ctx.body = response;
    }

    private koaRouterRegisterHelper(m: string) {
        switch(m) {
            case 'POST': return this.koaRouter.post.bind(this.koaRouter);
            default: return this.koaRouter.get.bind(this.koaRouter);
        }
    }

    private getRequestMappings(router: any): Array<string> {
        return Object.getOwnPropertyNames(router)
            .filter((prop) => {
                return prop !== 'constructor'
                    && typeof router[prop] === 'function'
                    && Reflect.hasMetadata(METADATA_ROUTER_METHOD, router, prop);
            });
    }
    
}