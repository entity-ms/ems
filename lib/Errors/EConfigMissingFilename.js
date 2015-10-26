/**
 * @todo
 * Provides the EConfigMissingFilename class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    EError = require('ems-error');

/**
 * Provides the EConfigMissingFilename error class.
 *
 * @class EConfigMissingFilename
 * @extends {EError}
 */
function EConfigMissingFilename() {
  'use strict';

  EConfigMissingFilename.super_.call(this);
}

util.inherits(EConfigMissingFilename, EError);

/**
 * Exports the EConfigMissingFilename class.
 */
module.exports = EConfigMissingFilename;
