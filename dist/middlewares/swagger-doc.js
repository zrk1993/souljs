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
require("reflect-metadata");
const fs = require("fs");
const path = require("path");
const mount = require("koa-mount");
const koaStatic = require("koa-static");
const SwaggerUIDist = require("swagger-ui-dist");
const load_modules_1 = require("../utils/load-modules");
const constants_1 = require("../constants");
const convert = load_modules_1.loadPackage('joi-to-json-schema');
function useSwaggerApi(app, swaggerConfig) {
    const pathToSwaggerUi = SwaggerUIDist.getAbsoluteFSPath();
    app.getKoaInstance().use(mount((swaggerConfig.prefix || '/api') + '/index.html', (ctx) => __awaiter(this, void 0, void 0, function* () {
        const d = yield new Promise((resolve, reject) => {
            fs.readFile(path.join(pathToSwaggerUi, 'index.html'), (err, data) => {
                if (err) {
                    return reject(err.message);
                }
                resolve(data.toString());
            });
        });
        ctx.type = 'text/html';
        ctx.body = d.replace(/url:\s*?"\S*"/gi, `url:"${swaggerConfig.url}",docExpansion: 'none'`);
    })));
    app.getKoaInstance().use(mount(swaggerConfig.url, (ctx) => {
        ctx.body = generateApi(app.getRouters(), swaggerConfig);
    }));
    app.getKoaInstance().use(mount(swaggerConfig.prefix || '/api', koaStatic(pathToSwaggerUi, {
        maxage: 8640000,
    })));
}
exports.useSwaggerApi = useSwaggerApi;
const api = {
    swagger: '2.0',
    info: {
        title: '接口文档',
        version: '1.0.0',
    },
    schemes: ['http'],
    basePath: '',
    consumes: ['application/json', 'application/x-www-form-urlencoded'],
    produces: ['application/json'],
    paths: {},
    tags: [],
};
let generated = false;
function generateApi(controllers, swaggerConfig) {
    if (generated) {
        return api;
    }
    api.info.title = swaggerConfig.title || '接口文档';
    controllers.forEach(Controller => {
        const requestMappings = getRequestMappings(Controller.prototype);
        const tag = Reflect.getMetadata(constants_1.METADATA_API_TAG, Controller) || Controller.name;
        const description = Reflect.getMetadata(constants_1.METADATA_API_DESCRIPTION, Controller) || '';
        if (!api.tags.find(i => i.name === tag)) {
            api.tags.push({ name: tag, description });
        }
        requestMappings.forEach(prop => {
            const requestPath = [
                Reflect.getMetadata(constants_1.METADATA_ROUTER_PATH, Controller),
                Reflect.getMetadata(constants_1.METADATA_ROUTER_PATH, Controller.prototype, prop),
            ]
                .join('')
                .replace('//', '/');
            const requestMethod = Reflect.getMetadata(constants_1.METADATA_ROUTER_METHOD, Controller.prototype, prop);
            const methodDesc = Reflect.getMetadata(constants_1.METADATA_API_DESCRIPTION, Controller.prototype, prop) || '';
            let cronJobInfo = '';
            if (Reflect.hasMetadata(constants_1.METADATA_CRON, Controller.prototype, prop)) {
                const { cronTime, options } = Reflect.getMetadata(constants_1.METADATA_CRON, Controller.prototype, prop);
                cronJobInfo = `【计划任务：${cronTime}】${options.onlyRunMaster ? '（onlyRunMaster）' : ''}`;
            }
            const method = {
                summary: methodDesc + cronJobInfo,
                tags: [tag],
                produces: ['application/json', 'application/x-www-form-urlencoded'],
                parameters: [],
                responses: { default: { description: 'successful operation' } },
            };
            const validQuerySchame = Reflect.getMetadata(constants_1.METADATA_ROUTER_QUERY_SCHAME, Controller.prototype, prop);
            if (validQuerySchame) {
                const schema = convert(validQuerySchame);
                Object.keys(schema.properties).forEach(key => {
                    const property = schema.properties[key];
                    method.parameters.push({
                        name: key,
                        in: 'query',
                        type: property.type,
                        required: !!(schema.required || []).find((i) => i === key),
                        description: key,
                    });
                });
            }
            const validBodySchame = Reflect.getMetadata(constants_1.METADATA_ROUTER_BODY_SCHAME, Controller.prototype, prop);
            if (validBodySchame) {
                const schema = convert(validBodySchame);
                method.parameters.push({
                    description: '',
                    in: 'body',
                    name: 'body',
                    required: true,
                    schema,
                });
            }
            api.paths[requestPath] = { [requestMethod.toLowerCase()]: method };
        });
    });
    generated = true;
    return api;
}
function getRequestMappings(router) {
    return Object.getOwnPropertyNames(router).filter(prop => {
        return (prop !== 'constructor' &&
            typeof router[prop] === 'function' &&
            Reflect.hasMetadata(constants_1.METADATA_ROUTER_METHOD, router, prop));
    });
}
//# sourceMappingURL=swagger-doc.js.map