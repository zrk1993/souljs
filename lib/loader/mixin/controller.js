const path = require('path');

module.exports = {

  /**
   * Load app/controller
   * @method loadcontroller
   * @param {Object} opt - LoaderOptions
   * @since 1.0.0
   */
  loadController() {
    const { baseDir } = this.options;
    const dependencies = ['application'];

    this.registerModule(path.join(baseDir, 'app/controller'), 'controller', dependencies);
  },

};

