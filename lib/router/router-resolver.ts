import 'reflect-metadata';
import * as KoaRouter from 'koa-router';
import * as Koa from 'koa';
import * as Debug from 'debug';
import { ExecutionContex } from './execution-contex';
import { ResponseHandler } from './response-handler';
import { Application } from '../application';
import { ParamValidate } from '../middlewares/param-validate';
import {
  METADATA_ROUTER_METHOD,
  METADATA_ROUTER_PATH,
  METADATA_ROUTER_MIDDLEWARE,
  METADATA_ROUTER_BODY_SCHAME,
  METADATA_ROUTER_QUERY_SCHAME,
} from '../constants';

const debug = Debug('soul:RouterResolver');

export class RouterResolver {
  private readonly routers: any[];
  private readonly appInstance: Application;
  private readonly koaRouter: KoaRouter;
  private readonly responseHandler: ResponseHandler;

  constructor(routers: any[], appInstance: Application, options?: object) {
    this.routers = routers;
    this.appInstance = appInstance;
    this.koaRouter = new KoaRouter();
    this.responseHandler = new ResponseHandler(this.appInstance);
  }

  resolve() {
    this.routers.forEach((router: any) => {
      this.registerRouter(router);
    });

    this.appInstance
      .getKoaInstance()
      .use(this.koaRouter.routes())
      .use(this.koaRouter.allowedMethods());
  }

  private registerRouter(Router: any) {
    debug('路由 %s', Router.name);

    const executionContex = new ExecutionContex(this.appInstance, this.responseHandler, Router);

    const routerMiddlewares = this.getMiddlewares(Router);

    const requestMappings = this.getRequestMappings(Router.prototype);

    requestMappings.forEach(prop => {
      const requestPath: string = [
        Reflect.getMetadata(METADATA_ROUTER_PATH, Router),
        Reflect.getMetadata(METADATA_ROUTER_PATH, Router.prototype, prop),
      ].join('');
      const requestMethod: string = Reflect.getMetadata(METADATA_ROUTER_METHOD, Router.prototype, prop);

      const propMiddlewares = this.getMiddlewares(Router.prototype, prop);

      const allMiddlewares = [].concat(routerMiddlewares).concat(propMiddlewares);

      debug('应用中间件 %s', allMiddlewares.map(i => i.name).join(' -> '));

      const validQuerySchame = Reflect.getMetadata(METADATA_ROUTER_QUERY_SCHAME, Router.prototype, prop);
      if (validQuerySchame) {
        allMiddlewares.push(ParamValidate(validQuerySchame, { type: 'query' }));
      }

      const validBodySchame = Reflect.getMetadata(METADATA_ROUTER_BODY_SCHAME, Router.prototype, prop);
      if (validBodySchame) {
        allMiddlewares.push(ParamValidate(validBodySchame, { type: 'body' }));
      }

      debug('注册路由 %s.%s %s %s', Router.name, prop, requestMethod, requestPath);

      this.koaRouterRegisterHelper(requestMethod)(requestPath, ...allMiddlewares, executionContex.create(prop));
    });
  }

  private getMiddlewares(target: any, propertyKey?: string): Koa.Middleware[] {
    const middlewares: Koa.Middleware[] = Reflect.getMetadata(METADATA_ROUTER_MIDDLEWARE, target, propertyKey) || [];

    return middlewares.reverse();
  }

  private koaRouterRegisterHelper(m: string) {
    switch (m) {
      case 'POST':
        return this.koaRouter.post.bind(this.koaRouter);
      default:
        return this.koaRouter.get.bind(this.koaRouter);
    }
  }

  private getRequestMappings(router: any): string[] {
    return Object.getOwnPropertyNames(router).filter(prop => {
      return (
        prop !== 'constructor' &&
        typeof router[prop] === 'function' &&
        Reflect.hasMetadata(METADATA_ROUTER_METHOD, router, prop)
      );
    });
  }
}
