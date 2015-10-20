/**
 * @todo
 */

var util = require('util'),
    Command = require('ems-commands/lib/Command'),
    info = require('../../package.json');

/**
 * Construct the Unregister command.
 *
 * @class Unregister
 * @extends Command
 * @constructor
 * @param {Commands} commands The owning components object.
 * @param {String} command The name of this command.
 */
function Unregister(commands, command) {
  'use strict';

  Unregister.super_.call(this, commands, command);
}

util.inherits(Unregister, Command);

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
Unregister.prototype.execute = function (data, done) {
  'use strict';

  console.info('UNREGISTER', data);

  var name = data.type + '@' + data.name;

  if (this.commands.owner.components[name] === undefined) {
    done(new Error('Not registered.'));
  }

  delete this.commands.owner.components[name];
  done(null, true);
};

/**
 * Exports the Unregister class.
 */
module.exports = Unregister;
