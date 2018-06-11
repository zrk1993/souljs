const http = require('http');
const Koa = require('koa');
const Helmet = require('koa-helmet');
const Bottle = require('bottlejs');
const Router = require('./utils/router');
const Loader = require('./loader');

const { getLogger } = require('./utils/logger');

const logger = getLogger('soul');

class Soul extends Koa {
  /**
   * @constructor
   * @param {Object} options - options
   */
  constructor(options = {}) {
    options.baseDir = options.baseDir || process.cwd();

    super();

    this.server = null;

    this.bottle = new Bottle();

    this.router = new Router({
      app: this,
    });

    this.loader = new Loader({
      baseDir: options.baseDir,
      app: this,
    });

    this.init();
  }

  init() {
    this.bottle.constant('application', this);

    this.loader.load();

    this.mountMiddleware();

    this.on('error', this._onError.bind(this));
  }

  mountMiddleware() {
    this.use(Helmet()); // 安全
    this.use(this.middlewares.error_handler());
    this.use(this.middlewares.body_parser(this));
    this.use(this.middlewares.http_logger()); // http请求日志
  }

  start() {
    this.loader.loadRouter(); // 在启动时挂载路由

    this.server = http.createServer(this.callback()).listen(this.config.server.port);
    logger.info(this.config.server.name, ' listening at ', this.config.server.port);
  }

  getContainer(name) {
    let target = this.container;
    name.split('.').forEach((item) => {
      target = target[item];
    });
    return target;
  }

  get container() {
    return this.bottle.container;
  }

  get middlewares() { // 因为Koa已经声明了middleware属性了，所以这里取middlewares
    return this.bottle.container.middleware;
  }

  get controller() {
    return this.bottle.container.controller;
  }

  get service() {
    return this.bottle.container.service;
  }

  _onError(err, ctx) {
    getLogger('error').error(err.message);
    ctx.internalServerError(err.message);
  }
}

module.exports = Soul;
