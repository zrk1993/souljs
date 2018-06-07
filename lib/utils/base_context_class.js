/**
 * BaseContextClass is a base class that can be extended,
 * it's instantiated in context level,
 * {@link Helper}, {@link Service} is extending it.
 */
class BaseContextClass {
  /**
   * @constructor
   * @param {Context} ctx - context instance
   * @since 1.0.0
   */
  constructor(app) {
    /**
     * @member {Application} BaseContextClass#app
     * @since 1.0.0
     */
    this.app = app;

    this.service = this.app.service;
  }
}

module.exports = BaseContextClass;
