const target = Object.create(null);

/**
 * 请求响应封装
 * @param {*} param
 * @context {this} - koa.ctx
 */
target.respond = function _({ code, message, result }) {
  this.response.status = code;
  this.response.body = { code, message, result };
};
const statusCodeMap = {
  ok: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500,
};
Object.keys(statusCodeMap).forEach((method) => {
  target[method] = function _(...args) {
    const code = statusCodeMap[method];

    if (typeof args[0] === 'string') {
      this.respond({ code, message: args[0], result: args[1] || null });
    } else {
      args[0].code = statusCodeMap[method];
      this.respond(...args);
    }
  };
});

module.exports = target;
