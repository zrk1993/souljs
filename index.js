'use strict';


/**
 * @member {Application} Soul#Application
 * @since 1.0.0
 */
exports.Application = require('./lib/application');

/**
 * @member {Controller} Soul#Controller
 * @since 1.1.0
 */
exports.Controller = require('./lib/utils/base_context_class');

/**
 * @member {Service} Soul#Service
 * @since 1.1.0
 */
exports.Service = require('./lib/utils/base_context_class');

/**
 * @member {BaseContextClass} Soul#BaseContextClass
 * @since 1.2.0
 */
exports.BaseContextClass = require('./lib/utils/base_context_class');
