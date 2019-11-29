"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("../constants");
function Render(view) {
    return (target, propertyKey) => {
        Reflect.defineMetadata(constants_1.METADATA_ROUTER_RENDER_VIEW, view, target, propertyKey);
    };
}
exports.Render = Render;
//# sourceMappingURL=render.js.map