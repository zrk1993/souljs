const Koa = require('koa');
var Router = require('koa-router');
const Loader = require('./loader');

class Soul extends Koa {

  /**
   * @constructor
   * @param {Object} options - options
   */
  constructor(options = {}) {
    options.baseDir = options.baseDir || process.cwd();

    super();

    this.router = new Router();

    this.loader = new Loader({
      baseDir: options.baseDir,
      app: this,
    });

  }
}

module.exports = Soul;