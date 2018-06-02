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
    const property = 'controller';
    const baseDir = this.options.baseDir;

    const controllerPath = path.join(baseDir, 'app/controller');
    const controllerList = this.getDirectoryModule(controllerPath);

    const controller = this.parseDirectoryModule(controllerList);

    app[property] = controller;
  },

};

