/**
 * @todo
 */

var path = require('path'),
    fs = require('fs'),
    cp = require('child_process'),
    program = require('commander'),
    terminal = require('color-terminal'),
    statusMsg = require('../statusMsg'),
    infoMsg = require('../infoMsg');

var config,
    request,
    cwd = path.normalize(path.join(__dirname, '..', '..', '..'));

/**
 * @todo
 */
function onInfoAction(cmd, options) {
  'use strict';

  request.get(function (err, success, response) {
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
      .write('Component Version: ')
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
      .write('Registered Components: ')
      .reset()
      .write(response.registered.join(', '))
      .write('\n\n');
  }, 'info');
}

/**
 * @todo
 */
function onInfoHelp() {
  'use strict';

  terminal
    .write('  Examples: \n\n')
    .write('    $ ems-central info\n')
    .write('\n')
    .reset();
}

/**
 * @todo
 */
module.exports = function (conf, req) {
  'use strict';

  config = conf;
  request = req;

  program
    .command('info')
    .description('Show information regarding the centralized component.')
    .action(onInfoAction)
    .on('--help', onInfoHelp);
};
