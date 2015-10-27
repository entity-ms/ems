/**
 * Provides the 'info' CLI command.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var program = require('commander');

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

      console.log(
        'Name:'.bold,
        response.name,
        ('http://' + response.host + ':' + response.port).bold.underline
      );
      console.log('Version:'.bold, response.version);
      console.log(
        'Components:'.bold,
        response.components.length === 0 ?
          '[none]' :
          response.components.join(', ')
      );
      console.log(
        'Instances:'.bold,
        response.instances.length === 0 ?
          '[none]' :
          response.instances.join(', ')
      );
      console.log('');
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
  console.log('    $ entity-ms info');
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
