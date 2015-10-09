/**
 * @todo
 */

var util = require('util'),
    Command = require('ems-commands/lib/Command'),
    info = require('../../package.json');

/**
 * @todo
 */
function Info(commands, command) {
  'use strict';

  Info.super_.call(this, commands, command);
}

util.inherits(Info, Command);

/**
 * @todo
 */
Info.prototype.execute = function (data, done) {
  'use strict';

  // @todo

  done(null, true, {
    name: this.commands.owner.name,
    title: this.commands.owner.title,
    description: this.commands.owner.description,
    version: info.version,
    host: this.commands.owner.host,
    port: this.commands.owner.port,
    registered: this.commands.owner.registered
  });
};

/**
 * Exports the Info class.
 */
module.exports = Info;
