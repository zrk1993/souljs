"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const KoaRouter = require("koa-router");
const cron_1 = require("cron");
const execution_contex_1 = require("./execution-contex");
const response_handler_1 = require("./response-handler");
const param_validate_1 = require("../middlewares/param-validate");
const is_master_1 = require("../utils/is-master");
const constants_1 = require("../constants");
class RouterResolver {
    constructor(routers, appInstance, options) {
        this.routers = routers;
        this.appInstance = appInstance;
        this.koaRouter = new KoaRouter();
        this.logger = appInstance.getLogger();
        this.responseHandler = new response_handler_1.ResponseHandler(this.appInstance);
    }
    resolve() {
        this.routers.forEach((router) => {
            this.registerRouter(router);
            this.registerCronJob(router);
        });
        this.appInstance
            .getKoaInstance()
            .use(this.koaRouter.routes())
            .use(this.koaRouter.allowedMethods());
    }
    registerRouter(Router) {
        this.logger.info('路由 %s', Router.name);
        const executionContex = new execution_contex_1.ExecutionContex(this.appInstance, this.responseHandler, Router);
        const routerMiddlewares = this.getMiddlewares(Router);
        const requestMappings = this.getRequestMappings(Router.prototype);
        requestMappings.forEach(prop => {
            const requestPath = [
                Reflect.getMetadata(constants_1.METADATA_ROUTER_PATH, Router),
                Reflect.getMetadata(constants_1.METADATA_ROUTER_PATH, Router.prototype, prop),
            ]
                .join('')
                .replace('//', '/');
            const requestMethod = Reflect.getMetadata(constants_1.METADATA_ROUTER_METHOD, Router.prototype, prop);
            const propMiddlewares = this.getMiddlewares(Router.prototype, prop);
            const allMiddlewares = [].concat(routerMiddlewares).concat(propMiddlewares);
            const validQuerySchame = Reflect.getMetadata(constants_1.METADATA_ROUTER_QUERY_SCHAME, Router.prototype, prop);
            if (validQuerySchame) {
                allMiddlewares.push(param_validate_1.ParamValidate(validQuerySchame, { type: 'query' }));
            }
            const validBodySchame = Reflect.getMetadata(constants_1.METADATA_ROUTER_BODY_SCHAME, Router.prototype, prop);
            if (validBodySchame) {
                allMiddlewares.push(param_validate_1.ParamValidate(validBodySchame, { type: 'body' }));
            }
            this.koaRouterRegisterHelper(requestMethod)(requestPath, ...allMiddlewares, executionContex.create(prop));
        });
    }
    registerCronJob(Router) {
        const cronJobs = Object.getOwnPropertyNames(Router.prototype).filter(prop => {
            return (prop !== 'constructor' &&
                typeof Router.prototype[prop] === 'function' &&
                Reflect.hasMetadata(constants_1.METADATA_CRON, Router.prototype, prop));
        });
        cronJobs.forEach(prop => {
            const { cronTime, options } = Reflect.getMetadata(constants_1.METADATA_CRON, Router.prototype, prop);
            if (options.onlyRunMaster && !is_master_1.default()) {
                return;
            }
            this.logger.info('创建计划任务 %s.%s cron：%s', Router.name, prop, cronTime);
            const job = new cron_1.CronJob(cronTime, Router.prototype[prop].bind(Router.prototype));
            job.start();
        });
    }
    getMiddlewares(target, propertyKey) {
        const middlewares = Reflect.getMetadata(constants_1.METADATA_ROUTER_MIDDLEWARE, target, propertyKey) || [];
        return middlewares.reverse();
    }
    koaRouterRegisterHelper(m) {
        switch (m) {
            case 'POST':
                return this.koaRouter.post.bind(this.koaRouter);
            default:
                return this.koaRouter.get.bind(this.koaRouter);
        }
    }
    getRequestMappings(router) {
        return Object.getOwnPropertyNames(router).filter(prop => {
            return (prop !== 'constructor' &&
                typeof router[prop] === 'function' &&
                Reflect.hasMetadata(constants_1.METADATA_ROUTER_METHOD, router, prop));
        });
    }
}
exports.RouterResolver = RouterResolver;
//# sourceMappingURL=router-resolver.js.map