const path = require('path');

module.exports = {

  /**
   * Load app/middleware
   * @method loadmiddleware
   * @param {Object} opt - LoaderOptions
   * @since 1.0.0
   */
  loadmiddleware() {
    const { baseDir } = this.options;

    const moduleList = this.getDirectoryModule(path.join(baseDir, 'app/middleware'))
      .concat(this.getDirectoryModule(path.join(__dirname, '../../../', 'app/middleware')));
    debugger
    moduleList.forEach((item) => {
      this.bottle.constant(['middleware', ...item.properties].join('.'), item.exports);
    });
  },

};

