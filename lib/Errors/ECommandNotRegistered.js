/**
 * @todo
 * Provides the ECommandNotRegistered class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    EError = require('ems-error');

/**
 * Provides the ECommandNotRegistered error class.
 *
 * @class ECommandNotRegistered
 * @extends {EError}
 */
function ECommandNotRegistered(command) {
  'use strict';

  ECommandNotRegistered.super_.call(this);

  Object.defineProperties(this, {
    /**
     * The command name causing the error.
     *
     * @var {String} command
     * @memberof ECommandNotRegistered
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

util.inherits(ECommandNotRegistered, EError);

/**
 * Exports the ECommandNotRegistered class.
 */
module.exports = ECommandNotRegistered;
