const path = require('path');
const fs = require('fs');

const defaults = {
  baseDir: null,
  app: null,
};

/**
 * @class
 */
class Loader {
  constructor(options) {
    this.options = Object.assign({}, defaults, options);

    this.app = this.options.app;
    this.bottle = this.options.app.bottle;
  }

  /**
   * Load all directories in convention
   * @since 1.0.0
   */
  load() {
    this.loadConfig();

    // app
    this.loadApplicationExtend();
    this.loadRequestExtend();
    this.loadResponseExtend();
    this.loadContextExtend();
    this.loadHelperExtend();

    // app
    this.loadService();
    // app
    this.loadController();
  }

  resolveModule(modulePath) {
    let ext = null;
    try {
      ext = require(require.resolve(modulePath));
    } catch (error) {
      ext = null;
    }
    return ext;
  }

  /**
   * 获取目录下的所有模块
   * @param {string} directory - directory
   */
  getDirectoryModule(directory) {
    const result = [];
    function finder(dir) {
      const files = fs.readdirSync(dir);
      files.forEach((val) => {
        const fPath = path.join(dir, val);
        const stats = fs.statSync(fPath);
        if (stats.isDirectory()) finder(fPath);
        if (stats.isFile()) result.push(fPath);
      });
    }
    finder(directory);

    const modules = [];
    result.forEach((fullpath) => {
      const properties = fullpath
        .replace(directory, '').replace(/\..*$/, '')
        .split(/\/|\\/).filter(i => !!i);

      const exports = this.resolveModule(fullpath);
      modules.push({ fullpath, properties, exports });
    });
    return modules;
  }

  /**
   * 将指定问文件夹下的模块注册到bottle
   */
  registerModule(directory, namespace, dependencies = []) {
    const moduleList = this.getDirectoryModule(directory);

    moduleList.forEach((item) => {
      this.bottle.service([namespace, ...item.properties].join('.'), item.exports, ...dependencies);
    });
  }
}

/**
 * Mixin methods to Loader
 * // ES6 Multiple Inheritance
 * https://medium.com/@leocavalcante/es6-multiple-inheritance-73a3c66d2b6b
 */
const loaders = [
  require('./mixin/config'),
  require('./mixin/extend'),
  require('./mixin/service'),
  require('./mixin/controller'),
  require('./mixin/router'),
];

for (const loader of loaders) {
  Object.assign(Loader.prototype, loader);
}

module.exports = Loader;
