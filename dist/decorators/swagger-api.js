"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("../constants");
exports.Tag = (tag) => {
    return (target, propertyKey) => {
        Reflect.defineMetadata(constants_1.METADATA_API_TAG, tag, target, propertyKey);
    };
};
exports.Description = (description) => {
    return (target, propertyKey) => {
        const des = Reflect.getMetadata(constants_1.METADATA_API_DESCRIPTION, target, propertyKey) || '';
        Reflect.defineMetadata(constants_1.METADATA_API_DESCRIPTION, description + ' ' + des, target, propertyKey);
    };
};
//# sourceMappingURL=swagger-api.js.map