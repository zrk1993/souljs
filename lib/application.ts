import * as http from 'http';
import * as Koa from 'koa';
import { RouterResolver } from './router/router-resolver';
import { ExecutionContex } from './router/execution-contex';

export interface ApplicationOptions {
    controllers: Array<any>
}

export class Application {

    private readonly httpServer: http.Server;

    private readonly koaInstance: Koa;

    private readonly routerResolver: RouterResolver;

    private readonly routers: Array<any>;

    constructor(options: ApplicationOptions) {
        this.routers = options.controllers;
        this.koaInstance = new Koa();
        this.httpServer = this.createHttpServer(this.koaInstance);
        this.routerResolver = new RouterResolver(this.routers, this);
    }

    private createHttpServer(koaInstance: Koa): http.Server {
        return http.createServer(koaInstance.callback());
    }

    private registerRouter() {
        this.routerResolver.resolve();
    }

    useGlobalMiddleware(middlewareClass: any, args?: Array<any>) {
        const executionContex = new ExecutionContex(this, this.getKoaInstance(), middlewareClass, args);
        this.getKoaInstance().use(executionContex.create('pip'));
    }

    listen(port: number) {
        this.registerRouter();
        this.httpServer.listen(port);
    }

    getKoaInstance(): Koa {
        return this.koaInstance;
    }

    getHttpServer(): http.Server {
        return this.httpServer;
    }
}