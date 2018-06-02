const http = require('http');
const Soul = require('./soul');

class Application extends Soul {

  /**
   * @constructor
   * @param {Object} options - see {@link Soul}
   */
  constructor(options = {}) {
    super(options);

    this.server = null;

    this.loader.load();
  }

  start() {
    this.server = http.createServer(this.callback()).listen(3000);
  }

}

module.exports = Application;