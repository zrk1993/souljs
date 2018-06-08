const path = require('path');


module.exports = {

  /**
   * Load app/router.js
   * @method loadRouter
   * @param {Object} opt - LoaderOptions
   * @since 1.0.0
   */
  loadRouter() {
    const { app } = this;

    const routers = this.resolveModule(path.join(this.options.baseDir, 'app/router'));
    routers(app);


    app
      .use(app.router.routes())
      .use(app.router.allowedMethods({
        throw: true,
      }));
  },
};
