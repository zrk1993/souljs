import * as http from 'http';
import * as Koa from 'koa';
import * as Debug from 'debug';
import { RouterResolver } from './router/router-resolver';

const debug = Debug('app:Application');

export class Application {
  private readonly httpServer: http.Server;
  private readonly koaInstance: Koa;
  private readonly routers: any[];

  constructor(routers: any[]) {
    this.routers = routers;
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
    debug('Listening at %d', port);
  }

  getKoaInstance(): Koa {
    return this.koaInstance;
  }

  getHttpServer(): http.Server {
    return this.httpServer;
  }

  getRouters(): any[] {
    return this.routers;
  }
}
