"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("../constants");
exports.CronJob = (cronTime, options = { onlyRunMaster: true }) => {
    return (target, propertyKey) => {
        Reflect.defineMetadata(constants_1.METADATA_CRON, { cronTime, options }, target, propertyKey);
    };
};
//# sourceMappingURL=cron-job.js.map