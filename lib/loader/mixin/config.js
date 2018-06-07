const path = require('path');

module.exports = {
  /**
   * Loader config to `app`,
   * @method loadConfig
   * @since 1.0.0
   */
  loadConfig() {
    const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const appBaseDir = this.options.baseDir;

    const defaultConfig = this.loadConfigDirectory(path.join(__dirname, '../../../', 'config'), env); // framework config
    const appConfig = this.loadConfigDirectory(path.join(appBaseDir, 'config'), env); // app config

    this.app.config = Object.assign({}, defaultConfig, appConfig);

    this.bottle.constant('config', this.app.config);
  },

  loadConfigDirectory(directory, env) {
    const commonConfig = this.resolveModule(path.join(directory, 'index.js'));
    const envConfig = this.resolveModule(path.join(directory, `${env}.env.js`));

    return Object.assign({}, commonConfig, envConfig);
  },
};
