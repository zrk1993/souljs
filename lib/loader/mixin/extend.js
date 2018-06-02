'use strict';

const path = require('path');

const originalPrototypes = {
  request: require('koa/lib/request'),
  response: require('koa/lib/response'),
  context: require('koa/lib/context'),
  application: require('koa/lib/application'),
};

module.exports = {

  /**
   * mixin Application.prototype
   * @method EggLoader#loadApplicationExtend
   * @since 1.0.0
   */
  loadApplicationExtend() {
    this.loadExtend('application', this.app);
  },

  /**
   * mixin Request.prototype
   * @method EggLoader#loadRequestExtend
   * @since 1.0.0
   */
  loadRequestExtend() {
    this.loadExtend('request', this.app.request);
  },

  /**
   * mixin Response.prototype
   * @method EggLoader#loadResponseExtend
   * @since 1.0.0
   */
  loadResponseExtend() {
    this.loadExtend('response', this.app.response);
  },

  /**
   * mixin Context.prototype
   * @method EggLoader#loadContextExtend
   * @since 1.0.0
   */
  loadContextExtend() {
    this.loadExtend('context', this.app.context);
  },

  /**
   * mixin app.Helper.prototype
   * @method EggLoader#loadHelperExtend
   * @since 1.0.0
   */
  loadHelperExtend() {
    if (this.app && this.app.Helper) {
      this.loadExtend('helper', this.app.Helper.prototype);
    }
  },

  /**
   * Find all extend file paths by name
   * can be override in top level framework to support load `app/extends/{name}.js`
   *
   * @param {String} name - filename which may be `app/extend/{name}.js`
   * @return {Array} filepaths extend file paths
   * @private
   */
  getExtendFilePaths(name) {
    const dirs = this.dirs = [];
    dirs.push({
      path: this.options.baseDir,
      type: 'app',
    });
    return dirs.map(unit => path.join(unit.path, 'app/extend', name));
  },

  /**
   * Loader app/extend/xx.js to `prototype`,
   * @method loadExtend
   * @param {String} name - filename which may be `app/extend/{name}.js`
   * @param {Object} proto - prototype that mixed
   * @since 1.0.0
   */
  loadExtend(name, proto) {
    const filepaths = this.getExtendFilePaths(name);

    for (let filepath of filepaths) {
      const ext = this.resolveModule(filepath);

      if (!ext) continue;

      const properties = Object.getOwnPropertyNames(ext)
        .concat(Object.getOwnPropertySymbols(ext));

      for (const property of properties) {
        let extDescriptor = Object.getOwnPropertyDescriptor(ext, property);
        let protoDescriptor = Object.getOwnPropertyDescriptor(proto, property);
        let originalDescriptor = Object.getOwnPropertyDescriptor(originalPrototypes[name], property);

        if (protoDescriptor) {
          console.log('属性覆盖1');
        }

        if (originalDescriptor) {
          console.log('属性覆盖2');
        }

        if (extDescriptor) {
          const descriptor = Object.assign({}, extDescriptor);
          Object.defineProperty(proto, property, descriptor);
        }
      }
    }
  },
};
