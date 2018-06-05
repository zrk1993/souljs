const path = require('path');

module.exports = {

  /**
   * Load app/service
   * @method loadservice
   * @param {Object} opt - LoaderOptions
   * @since 1.0.0
   */
  loadService() {
    const { baseDir } = this.options;
    const dependencies = ['application'];

    this.registerModule(path.join(baseDir, 'app/service'), 'service', dependencies);
  },

};

