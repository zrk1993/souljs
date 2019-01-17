import "reflect-metadata";
import * as Path from 'path';
import * as KoaRouter from 'koa-router';
import { ExecutionContex } from './execution-contex';
import { Application } from '../application';
import { METADATA_ROUTER_METHOD, METADATA_ROUTER_PATH } from '../constants';

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

        const requestMappings = this.getRequestMappings(Router.prototype);

        requestMappings.forEach((prop) => {
            const requestPath: string = Path.join(Reflect.getMetadata(METADATA_ROUTER_PATH, Router),
                Reflect.getMetadata(METADATA_ROUTER_PATH, Router.prototype, prop));
            const requestMethod: string= Reflect.getMetadata(METADATA_ROUTER_METHOD, Router.prototype, prop);

            this.koaRouterRegisterHelper(requestMethod)(requestPath, executionContex.create(prop));
        });
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