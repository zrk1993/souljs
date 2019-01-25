import * as http from 'http';
import * as Koa from 'koa';
import { RouterResolver } from './router/router-resolver';

export interface ApplicationOptions {
  controllers: Array<any>;
  hbs?: { viewPath: string };
  staticAssets?: { root: string; prefix?: string };
  swagger?: { url: string; prefix?: string };
}

export class Application {
  private readonly httpServer: http.Server;
  private readonly koaInstance: Koa;
  private readonly routers: Array<any>;

  constructor(options: ApplicationOptions) {
    this.routers = options.controllers;
    this.koaInstance = new Koa();
    this.httpServer = this.createHttpServer();
  }

  private createHttpServer(): http.Server {
    return http.createServer(this.koaInstance.callback());
  }

  private registerRouter() {
    const routerResolver = new RouterResolver(this.routers, this);
    routerResolver.resolve();
  }

  use(mid: Koa.Middleware) {
    this.koaInstance.use(mid);
  }

  listen(port: number) {
    this.registerRouter();
    this.httpServer.listen(port);
    console.info('Listening at %d', port);
  }

  getKoaInstance(): Koa {
    return this.koaInstance;
  }

  getHttpServer(): http.Server {
    return this.httpServer;
  }

  getRouters(): Array<any> {
    return this.routers;
  }
}
