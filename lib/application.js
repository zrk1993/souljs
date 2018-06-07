const http = require('http');
const Koa = require('koa');
const Bottle = require('bottlejs');
const Router = require('./utils/router');
const createLogger = require('./utils/logger');
const Loader = require('./loader');

class Soul extends Koa {
  /**
   * @constructor
   * @param {Object} options - options
   */
  constructor(options = {}) {
    options.baseDir = options.baseDir || process.cwd();

    super();

    this.server = null;
    this.logger = null;

    this.bottle = new Bottle();
    this.container = this.bottle.container;

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
    this.bottle.constant('logger', this.logger);

    this.loader.load();
  }

  start() {
    this.server = http.createServer(this.callback()).listen(3000);
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

  get middleware() {
    return this.bottle.container.middleware;
  }

  get controller() {
    return this.bottle.container.controller;
  }

  get service() {
    return this.bottle.container.service;
  }

  get logger() {
    if (!this.logger) {
      this.logger = createLogger(this);
    }
    return this.logger;
  }
}

module.exports = Soul;
