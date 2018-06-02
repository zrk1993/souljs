'use strict';

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
    this.ctx = this.options.app.ctx;
  }

  /**
   * loadConfig
   * @since 1.0.0
   */
  loadConfig() {
    this.loadConfig();
  }

  /**
   * Load all directories in convention
   * @since 1.0.0
   */
  load() {
    // app > core
    this.loadApplicationExtend();
    this.loadRequestExtend();
    this.loadResponseExtend();
    this.loadContextExtend();
    this.loadHelperExtend();

    // app > plugin
    this.loadService();
    // app
    this.loadController();
    // app
    this.loadRouter(); // Dependent on controllers
  }

  /**
   * 加载模块
   * @param {string} filepath - 路径
   */
  resolveModule(filepath) {
    let obj = null;
    try {
      const fullPath = require.resolve(filepath);
      obj = require(fullPath);
    } catch (e) {
      return obj;
    }
    return obj;
  }

  /**
   * 获取目录下的所有模块
   * 
   * @param {string} directory - directory
   */
  getDirectoryModule(directory) {
    const result = [];
    function finder(dir) {
      const files = fs.readdirSync(dir);
      files.forEach((val,index) => {
        const fPath = path.join(dir, val);
        const stats = fs.statSync(fPath);
        if(stats.isDirectory()) finder(fPath);
        if(stats.isFile()) result.push(fPath);
      });
    }
    finder(directory);

    const modules = [];
    result.forEach(fullpath => {
      
      const properties = fullpath
        .replace(directory, '').replace(/\..*$/, '')
        .split(/\/|\\/).filter(i => !!i);

      const exports = this.resolveModule(fullpath);

      modules.push({ fullpath, properties, exports });
    });
    return modules;
  }

  /**
   * 根据模块信息数组加载模块
   * 
   * @param {Array} modules - 文件夹下的模块信息数组
   * @returns {Object}
   */
  parseDirectoryModule(modules) {
    const modulesTree = Object.create(null);
    modules.forEach(item => {
      let dest = modulesTree;
      item.properties.forEach((propertie, index) => {
        if (!dest[propertie] && index !== item.properties.length - 1) {
          dest = dest[propertie] = Object.create(null);
        } else {
          dest[propertie] = new item.exports(this);
        }
      });
    });

    return modulesTree;
  }
}

/**
 * Mixin methods to Loader
 * // ES6 Multiple Inheritance
 * https://medium.com/@leocavalcante/es6-multiple-inheritance-73a3c66d2b6b
 */
const loaders = [
  require('./mixin/extend'),
  require('./mixin/service'),
  require('./mixin/controller'),
  require('./mixin/router'),
];

for (const loader of loaders) {
  Object.assign(Loader.prototype, loader);
}

module.exports = Loader;
