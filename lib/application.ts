import * as http from 'http';
import * as Koa from 'koa';
import { RouterResolver } from './router/router-resolver';

export interface ApplicationOptions {
    controllers: Array<any>
}

export class Application {

    private readonly httpServer: http.Server;

    private readonly koaInstance: Koa;

    private readonly routerResolver: RouterResolver;

    private readonly routers: Array<new () => {}>;

    constructor(options: ApplicationOptions) {
        this.routers = options.controllers;
        this.koaInstance = new Koa();
        this.httpServer = this.createHttpServer(this.koaInstance);
        this.routerResolver = new RouterResolver(this.routers, this);
    }

    private createHttpServer(koaInstance: Koa): http.Server {
        return http.createServer(koaInstance.callback());
    }

    useGlobalMiddleware() {
    }

    private registerRouter() {
        this.routerResolver.resolve();
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