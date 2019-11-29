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
const joi = require("joi");
const constants_1 = require("../constants");
const joiOptions = {
    allowUnknown: true,
    stripUnknown: true,
    skipFunctions: true,
};
function ParamValidate(schema, option) {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const data = option.type === 'query' ? ctx.request.query : ctx.request.body;
        const result = joi.validate(data, schema, joiOptions);
        if (result.error === null) {
            ctx.reqData = result.value;
            if (option.type === 'query') {
                ctx.request.query = result.value;
            }
            else {
                ctx.request.body = result.value;
            }
            yield next();
        }
        else {
            result.error.name = constants_1.PARAM_VALIDATIONE_RROR;
            throw result.error;
        }
    });
}
exports.ParamValidate = ParamValidate;
//# sourceMappingURL=param-validate.js.map