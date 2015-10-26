/**
 * @todo
 * Provides the ECommandMissingExecute class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var util = require('util'),
    EError = require('ems-error');

/**
 * Provides the ECommandMissingExecute error class.
 *
 * @class ECommandMissingExecute
 * @extends {EError}
 */
function ECommandMissingExecute(command, commandCls) {
  'use strict';

  ECommandMissingExecute.super_.call(this);

  Object.defineProperties(this, {
    /**
     * The command name causing the error.
     *
     * @var {String} command
     * @memberof ECommandMissingExecute
     * @readonly
     * @instance
     */
    command: {
      get: function () {
        return command;
      }
    },
    /**
     * The classname of the command causing the error.
     *
     * @var {String} commandCls
     * @memberof ECommandMissingExecute
     * @readonly
     * @instance
     */
    commandCls: {
      get: function () {
        return commandCls;
      }
    }
  });
}

util.inherits(ECommandMissingExecute, EError);

/**
 * Exports the ECommandMissingExecute class.
 */
module.exports = ECommandMissingExecute;
