"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cluster = require("cluster");
function isPM2Master() {
    return parseInt(process.env.INSTANCE_ID, 10) === 0;
}
exports.isPM2Master = isPM2Master;
function isMaster() {
    return cluster.isMaster || isPM2Master();
}
exports.default = isMaster;
//# sourceMappingURL=is-master.js.map