"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("../constants");
function Use(mid) {
    return (target, propertyKey) => {
        if (!Reflect.hasMetadata(constants_1.METADATA_ROUTER_MIDDLEWARE, target, propertyKey)) {
            Reflect.defineMetadata(constants_1.METADATA_ROUTER_MIDDLEWARE, [], target, propertyKey);
        }
        const middlewares = Reflect.getMetadata(constants_1.METADATA_ROUTER_MIDDLEWARE, target, propertyKey);
        middlewares.push(mid);
        Reflect.defineMetadata(constants_1.METADATA_ROUTER_MIDDLEWARE, middlewares, target, propertyKey);
    };
}
exports.Use = Use;
//# sourceMappingURL=middleware.js.map