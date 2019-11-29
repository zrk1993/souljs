"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("../constants");
function createParamDecorator(convertFunc) {
    return (data) => {
        return (target, propertyKey, parameterIndex) => {
            const routerParams = Reflect.getMetadata(constants_1.METADATA_ROUTER_PARAMS, target, propertyKey) || [];
            routerParams.push({
                index: parameterIndex,
                convertFunc,
                data,
            });
            Reflect.defineMetadata(constants_1.METADATA_ROUTER_PARAMS, routerParams, target, propertyKey);
        };
    };
}
exports.createParamDecorator = createParamDecorator;
//# sourceMappingURL=param-decorator-tool.js.map