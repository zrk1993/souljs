"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const param_decorator_tool_1 = require("./param-decorator-tool");
exports.Ctx = param_decorator_tool_1.createParamDecorator(ctx => {
    return ctx;
});
exports.Request = param_decorator_tool_1.createParamDecorator(ctx => {
    return ctx.request;
});
exports.Response = param_decorator_tool_1.createParamDecorator(ctx => {
    return ctx.response;
});
exports.Query = param_decorator_tool_1.createParamDecorator((ctx, data) => {
    return data && ctx.request.query ? ctx.request.query[data] : ctx.request.query;
});
exports.Body = param_decorator_tool_1.createParamDecorator((ctx, data) => {
    const body = ctx.request.body;
    return data && body ? body[data] : body;
});
//# sourceMappingURL=request-params.js.map