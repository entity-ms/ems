/**
 * @todo
 */

var util = require('util'),
    Command = require('ems-commands/lib/Command'),
    info = require('../../package.json');

/**
 * Construct the Register command.
 *
 * @class Register
 * @extends Command
 * @constructor
 * @param {Commands} commands The owning components object.
 * @param {String} command The name of this command.
 */
function Register(commands, command) {
  'use strict';

  Register.super_.call(this, commands, command);
}

util.inherits(Register, Command);

/**
 * Executes the command.
 *
 * @method execute
 * @param {Object} data The data sent to the command.
 * @param {Function} done The done callback.
 *   @param {Error} done.err Any raised errors.
 *   @param {Boolean} done.success The success status of this command.
 *   @param {Object} done.response The response object.
 * @async
 */
Register.prototype.execute = function (data, done) {
  'use strict';

  console.info(data);

  var name = data.sender.type + '@' + data.sender.name;
  if (this.commands.owner.components[name] !== undefined) {
    done(new Error('Already registered.'));
  }

  console.info('Registered component [' + data.sender.type + '] ' + data.sender.name);

  this.commands.owner.components[name] = data.sender;
  done(null, true);
};

/**
 * Exports the Register class.
 */
module.exports = Register;
