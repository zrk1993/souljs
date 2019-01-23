import 'reflect-metadata';
import * as Path from 'path';
import * as KoaRouter from 'koa-router';
import * as Koa from 'koa';
import { ExecutionContex } from './execution-contex';
import { validateParams } from './validate-params';
import { ResponseHandler } from './response-handler';
import { Application } from '../application';
import { METADATA_ROUTER_METHOD, METADATA_ROUTER_PATH, METADATA_ROUTER_MIDDLEWARE } from '../constants';

export class RouterResolver {
  private readonly routers: Array<any>;
  private readonly appInstance: Application;
  private readonly koaRouter: KoaRouter;
  private readonly responseHandler: ResponseHandler;

  constructor(routers: Array<any>, appInstance: Application, options?: Object) {
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
    console.info('加载控制器 %s', Router.name);

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

      const validateParamsPip = validateParams(Router, prop);

      const allMiddlewares = []
        .concat(routerMiddlewares)
        .concat(propMiddlewares)
        .concat([validateParamsPip]);

      console.info('应用中间件 %s', allMiddlewares.map(i => i.lable).join(' -> '));

      console.info('注册路由 %s.%s %s %s', Router.name, prop, requestMethod, requestPath);

      this.koaRouterRegisterHelper(requestMethod)(requestPath, ...allMiddlewares, executionContex.create(prop));
    });
  }

  private getMiddlewares(target: any, propertyKey?: string): Array<Function> {
    const middlewares: Array<{ middlewareClass: any; args: Array<any> }> =
      Reflect.getMetadata(METADATA_ROUTER_MIDDLEWARE, target, propertyKey) || [];

    return middlewares
      .map(mid => {
        const executionContex = new ExecutionContex(
          this.appInstance,
          this.responseHandler,
          mid.middlewareClass,
          mid.args,
        );
        return executionContex.create('pip');
      })
      .reverse();
  }

  private koaRouterRegisterHelper(m: string) {
    switch (m) {
      case 'POST':
        return this.koaRouter.post.bind(this.koaRouter);
      default:
        return this.koaRouter.get.bind(this.koaRouter);
    }
  }

  private getRequestMappings(router: any): Array<string> {
    return Object.getOwnPropertyNames(router).filter(prop => {
      return (
        prop !== 'constructor' &&
        typeof router[prop] === 'function' &&
        Reflect.hasMetadata(METADATA_ROUTER_METHOD, router, prop)
      );
    });
  }
}
