'use strict';

const path = require('path');

module.exports = {

  /**
   * Load app/service
   * @method loadservice
   * @param {Object} opt - LoaderOptions
   * @since 1.0.0
   */
  loadService() {
    const app = this.app;
    const bottle = this.app.bottle;
  
    const property = 'service';
    const baseDir = this.options.baseDir;

    const serviceRootPath = path.join(baseDir, 'app/service');
    const serviceModuleList = this.getDirectoryModule(serviceRootPath);

    serviceModuleList.forEach((service) => {
      bottle.service(['service', ...service.properties].join('.'), service.exports);
    });
  },

};

