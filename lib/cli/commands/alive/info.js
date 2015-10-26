/**
 * Provides the 'info' CLI command.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var program = require('commander'),
    colors = require('colors');

/**
 * The action callback for the 'info' CLI command.
 *
 * @method onInfoAction
 * @param {String} cmd The command being executed.
 * @param {Object} options Any options being parsed via the CLI.
 * @private
 */
function onInfoAction(config, request) {
  'use strict';

  return function (cmd, options) {
    request.get(function (err, success, response) {
      if (err) {
        console.log('\nError:'.bold, err.message, '\n', err.stack);
        return;
      }

      console.log(response.title.bold);
      console.log(response.description);
      if (response.description !== '') {
        console.log('');
      }

      console.log('Name:'.bold, response.name);
      console.log('Version:'.bold, response.version);
      console.log(
        'Address:'.bold,
        'http://' + response.host + ':' + response.port
      );
      console.log('Components:'.bold, response.components.join(', '));
      console.log('Instances:'.bold, response.instances.join(', '));
    }, 'api/info');
  };
}

/**
 * Provides the help output for the 'info' command.
 *
 * @method onInfoHelp
 * @private
 */
function onInfoHelp() {
  'use strict';

  console.log('  Examples:');
  console.log('    $ ems info');
  console.log('');
}

/**
 * Exports the 'info' CLI command.
 */
module.exports = function (config, request) {
  'use strict';

  program
    .command('info')
    .description('Show information regarding the centralized component.')
    .action(onInfoAction(config, request))
    .on('--help', onInfoHelp);
};
