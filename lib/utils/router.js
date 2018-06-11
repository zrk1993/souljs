const KoaRouter = require('koa-router');
const fnArgs = require('fn-args');

/**
 * Extend {@link https://github.com/alexmingoia/koa-router}
 */
class Router extends KoaRouter {
  constructor(options) {
    super(options);

    this.options = Object.assign({}, options);
    this.app = this.options.app;
    this.container = this.app.container;
  }

  route(route) {
    const method = route.method.toLowerCase();
    const { path } = route;

    const [controllerName, actionName] = route.controller.split(/\.(?!.+[.]+)/);

    const controller = this.app.getContainer(['controller', controllerName].join('.'));
    const action = controller[actionName];

    const _args = fnArgs(action).slice(1);

    const fn = async function anonymous(ctx) {
      await action.apply(controller, [ctx].concat(_args.map(arg => this.container[arg])));
    };

    super[method](path, fn);
  }
}

module.exports = Router;
