/**
 * @todo
 * Provides the ECommandAlreadyRegistered class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    EError = require('ems-error');

/**
 * Provides the ECommandAlreadyRegistered error class.
 *
 * @class ECommandAlreadyRegistered
 * @extends {EError}
 */
function ECommandAlreadyRegistered(command) {
  'use strict';

  ECommandAlreadyRegistered.super_.call(this);

  Object.defineProperties(this, {
    /**
     * The command name causing the error.
     *
     * @var {String} command
     * @memberof ECommandAlreadyRegistered
     * @readonly
     * @instance
     */
    command: {
      get: function () {
        return command;
      }
    }
  });
}

util.inherits(ECommandAlreadyRegistered, EError);

/**
 * Exports the ECommandAlreadyRegistered class.
 */
module.exports = ECommandAlreadyRegistered;
