/**
 * Provides the 'info' CLI command.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var program = require('commander'),
    terminal = require('color-terminal');

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
        terminal
          .color({
            attribute: 'bold'
          })
          .write('\nError: ')
          .reset()
          .write(err.message)
          .write('\n')
          .write(err.stack)
          .write('\n');

        return;
      }

      terminal
        .color({
          attribute: 'bold'
        })
        .write(response.title)
        .write('\n')
        .reset()
        .write(response.description)
        .write('\n' + (response.description !== '' ? '\n' : ''))
        .color({
          attribute: 'bold'
        })
        .write('Name: ')
        .reset()
        .write(response.name)
        .write('\n')
        .color({
          attribute: 'bold'
        })
        .write('Version: ')
        .reset()
        .write(response.version)
        .write('\n')
        .color({
          attribute: 'bold'
        })
        .write('Address: ')
        .reset()
        .write('http://' + response.host + ':' + response.port)
        .write('\n')
        .color({
          attribute: 'bold'
        })
        .write('Components: ')
        .reset()
        .write(response.components.join(', '))
        .write('\n')
        .color({
          attribute: 'bold'
        })
        .write('Instances: ')
        .reset()
        .write(response.instances.join(', '))
        .write('\n\n');
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

  terminal
    .write('  Examples: \n\n')
    .write('    $ ems info\n')
    .write('\n')
    .reset();
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
