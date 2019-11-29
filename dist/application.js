"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Koa = require("koa");
const router_resolver_1 = require("./router/router-resolver");
class Application {
    constructor(routers, options) {
        this.routers = routers;
        this.logger = options.logger;
        this.koaInstance = new Koa();
        this.httpServer = this.createHttpServer();
    }
    createHttpServer() {
        return http.createServer(this.koaInstance.callback());
    }
    registerRouter() {
        const routerResolver = new router_resolver_1.RouterResolver(this.routers, this);
        routerResolver.resolve();
    }
    use(mid) {
        this.koaInstance.use(mid);
    }
    listen(port) {
        this.registerRouter();
        this.httpServer.listen(port);
        this.logger.info('Listening at %d', port);
    }
    getKoaInstance() {
        return this.koaInstance;
    }
    getHttpServer() {
        return this.httpServer;
    }
    getRouters() {
        return this.routers;
    }
    getLogger() {
        return this.logger;
    }
}
exports.Application = Application;
//# sourceMappingURL=application.js.map