const Koa = require('koa');
const Loader = require('./loader');

class Soul extends Koa {

  /**
   * @constructor
   * @param {Object} options - options
   */
  constructor(options = {}) {
    options.baseDir = options.baseDir || process.cwd();

    super();

    this.loader = new Loader({
      baseDir: options.baseDir,
      app: this,
    });

  }
}

module.exports = Soul;