"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const joi = require("joi");
const constants_1 = require("../constants");
function create(type) {
    return (schemaMap) => {
        Object.keys(schemaMap).forEach(k => {
            const v = schemaMap[k];
            if (v._flags.presence !== 'required') {
                schemaMap[k] = v.allow.call(v, '', null);
            }
        });
        return (target, propertyKey) => {
            Reflect.defineMetadata(type, joi.object().keys(schemaMap), target, propertyKey);
        };
    };
}
exports.BodySchame = create(constants_1.METADATA_ROUTER_BODY_SCHAME);
exports.QuerySchame = create(constants_1.METADATA_ROUTER_QUERY_SCHAME);
//# sourceMappingURL=joi-schema.js.map