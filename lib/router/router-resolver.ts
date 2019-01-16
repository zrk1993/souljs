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
    private readonly executionContex: ExecutionContex;

    constructor(routers: Array<Function>, appInstance: Application, options?: Object) {
        this.routers = routers;
        this.appInstance = appInstance;
        this.koaRouter = new KoaRouter();
        this.executionContex = new ExecutionContex();
    }

    resolve() {
        this.routers.forEach((router: Function) => {
            this.registerRouter(router);
        });

        this.appInstance.getKoaInstance()
            .use(this.koaRouter.routes())
            .use(this.koaRouter.allowedMethods());
    }

    private registerRouter(router: any) {

        const requestMappings = this.getRequestMappings(router.prototype);

        requestMappings.forEach((prop) => {
            const requestPath: string = Path.join(Reflect.getMetadata(METADATA_ROUTER_PATH, router),
                Reflect.getMetadata(METADATA_ROUTER_PATH, router.prototype, prop));
            const requestMethod: string= Reflect.getMetadata(METADATA_ROUTER_METHOD, router.prototype, prop);

            this.koaRouterRegisterHelper(requestMethod)(requestPath, this.executionContex.create());
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