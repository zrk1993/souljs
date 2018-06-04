const http = require('http');
const Koa = require('koa');
const Bottle = require('bottlejs')
var Router = require('./utils/router');
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
    this.loader.load();
  }

  start() {
    this.server = http.createServer(this.callback()).listen(3000);
  }

  controller(name) {
    return this.container['controller.' + name];
  }

}

module.exports = Soul;