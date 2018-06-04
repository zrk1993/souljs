'use strict';

const path = require('path');

module.exports = {

  /**
   * Load app/controller
   * @method loadcontroller
   * @param {Object} opt - LoaderOptions
   * @since 1.0.0
   */
  loadController() {
    const app = this.app;
    const bottle = this.app.bottle;
  
    const property = 'controller';
    const baseDir = this.options.baseDir;

    const controllerRootPath = path.join(baseDir, 'app/controller');
    const controllerModuleList = this.getDirectoryModule(controllerRootPath);

    controllerModuleList.forEach((controller) => {
      bottle.service(['controller', ...controller.properties].join('.'), controller.exports);
    });
  },

};

