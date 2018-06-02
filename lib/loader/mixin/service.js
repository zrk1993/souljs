'use strict';

const path = require('path');

module.exports = {

  /**
   * Load app/service
   * @method loadService
   * @param {Object} opt - LoaderOptions
   * @since 1.0.0
   */
  loadService() {
    const app = this.app;
    const property = 'service';
    const baseDir = this.options.baseDir;

    const servicePath = path.join(baseDir, 'app/service');
    const serviceList = this.getDirectoryModule(servicePath);

    const service = this.parseDirectoryModule(serviceList);

    app.context[property] = service;
  },

};

