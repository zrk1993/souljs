"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Bodyparser = require("koa-bodyparser");
const koaStatic = require("koa-static");
const helmet = require("koa-helmet");
const mount = require("koa-mount");
const cors = require("@koa/cors");
const logger_1 = require("./utils/logger");
const application_1 = require("./application");
const swagger_doc_1 = require("./middlewares/swagger-doc");
function createApplication(root, globsOrControllers, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = options.logger || logger_1.logger;
        logger.info('application starting ...');
        const routers = globsOrControllers;
        logger.info('find %d routes', routers.length);
        const app = new application_1.Application(routers, { logger });
        if (options.helmet !== false) {
            logger.info('应用全局中间件 %s', 'koa-helmet');
            app.use(helmet());
        }
        if (options.cors !== false) {
            logger.info('应用全局中间件 %s', 'koa-cors');
            const corsOptions = { credentials: true };
            app.use(cors(Object.assign(corsOptions, options.cors)));
        }
        const staticAssetsOptions = Object.assign({
            root: Path.join(root, '..', 'public'),
            prefix: '/public',
            maxage: 86400000,
        }, options.staticAssets);
        logger.info('站点资源目录public');
        app.use(mount(staticAssetsOptions.prefix, koaStatic(staticAssetsOptions.root, staticAssetsOptions)));
        logger.info('站点目录www');
        app.use(koaStatic(Path.join(root, '..', 'www'), {
            maxage: 86400000,
        }));
        if (options.bodyparser !== false) {
            const bodyparserOptions = Object.assign({
                enableTypes: ['json', 'form'],
                textLimit: '1mb',
                jsonLimit: '1mb',
            }, options.bodyparser);
            logger.info('应用全局中间件 %s', 'koa-bodyparser');
            app.use(Bodyparser(bodyparserOptions));
        }
        if (options.swagger !== false) {
            const swaggerOptions = Object.assign({
                url: '/swagger-api/doc',
                prefix: '/swagger-ui',
            }, options.swagger);
            logger.info('应用swagger接口文档 访问路劲：%s%s', swaggerOptions.prefix, '/index.html');
            swagger_doc_1.useSwaggerApi(app, swaggerOptions);
        }
        return app;
    });
}
exports.createApplication = createApplication;
//# sourceMappingURL=createApplication.js.map