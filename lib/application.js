const Soul = require('./soul');

class Application extends Soul {

  /**
   * @constructor
   * @param {Object} options - see {@link Soul}
   */
  constructor(options = {}) {
    super(options);

    // will auto set after 'server' event emit
    this.server = null;

    this.loader.load();
  }

}

module.exports = Application;