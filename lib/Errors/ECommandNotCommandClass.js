/**
 * @todo
 * Provides the ECommandNotCommandClass class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    EError = require('ems-error');

/**
 * Provides the ECommandNotCommandClass error class.
 *
 * @class ECommandNotCommandClass
 * @extends {EError}
 */
function ECommandNotCommandClass(command) {
  'use strict';

  ECommandNotCommandClass.super_.call(this);

  Object.defineProperties(this, {
    /**
     * The command name causing the error.
     *
     * @var {String} command
     * @memberof ECommandNotCommandClass
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

util.inherits(ECommandNotCommandClass, EError);

/**
 * Exports the ECommandNotCommandClass class.
 */
module.exports = ECommandNotCommandClass;
