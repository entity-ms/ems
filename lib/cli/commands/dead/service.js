/**
 * Provides the 'service' CLI command.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var path = require('path'),
    fs = require('fs'),
    cp = require('child_process'),
    program = require('commander'),
    terminal = require('color-terminal'),
    statusMsg = require('../../statusMsg'),
    infoMsg = require('../../infoMsg');

var request,
    cwd = path.normalize(path.join(__dirname, '..', '..', '..', '..'));

/**
 * Perform the service start.
 *
 * @method _start
 * @param {Function} dne The done callback.
 * @aysnc
 * @private
 */
function _start(done) {
  'use strict';

  infoMsg('Starting centralized component...').write('\n');
  var out = fs.openSync('./out.log', 'a'),
      eout = fs.openSync('./out.log', 'a'),
      child = cp.spawn('npm', ['start'], {
        cwd: cwd,
        detached: true,
        stdio: ['ignore', out, eout]
      });

  child.unref();

  setTimeout(function () {
    request.ping(done);
  }, 5000);
}

/**
 * Perform the service stop.
 *
 * @method _stop
 * @param {Function} dne The done callback.
 * @aysnc
 * @private
 */
function _stop(done) {
  'use strict';

  infoMsg('Stopping centralized component...').write('\n');
  var out = fs.openSync('./out.log', 'a'),
      eout = fs.openSync('./out.log', 'a'),
      child = cp.spawn('npm', ['stop'], {
        cwd: cwd,
        detached: true,
        stdio: ['ignore', out, eout]
      });

  child.unref();

  setTimeout(function () {
    request.ping(done);
  }, 1000);
}

/**
 * The action to perform a service restart.
 *
 * @method serviceRestart
 * @param {Function} done The done callback.
 * @async
 * @private
 */
function serviceRestart(done) {
  'use strict';

  request.ping(function (alive) {
    if (alive) {
      _stop(function (alive2) {
        if (alive2) {
          statusMsg('Failed to stop the centralized component server.', false);
          return done(false);
        }

        _start(done);
      });
    } else {
      _start(done);
    }
  });
}

/**
 * The action to perform a service start.
 *
 * @method serviceStart
 * @param {Function} done The done callback.
 * @async
 * @private
 */
function serviceStart(done) {
  'use strict';

  request.ping(function (err, alive) {
    if (!alive) {
      _start(done);
    } else {
      statusMsg('The centralized component service is already running.', true);
    }
  });
}

/**
 * The action to perform a service stop.
 *
 * @method serviceStop
 * @param {Function} done The done callback.
 * @async
 * @private
 */
function serviceStop(done) {
  'use strict';

  request.ping(function (alive) {
    if (alive) {
      _stop(done);
    } else {
      statusMsg('The centralized component service is already dead.', true);
    }
  });
}

/**
 * The action callback for the 'service' CLI command.
 *
 * @method onServiceAction
 * @param {String} cmd The command being executed.
 * @param {Object} options Any options being parsed via the CLI.
 * @private
 */
function onServiceAction(cmd, options) {
  'use strict';

  switch (cmd) {
    case 'restart':
      serviceRestart(function (alive) {
        if (alive) {
          statusMsg('The central component service has restarted.', true);
        } else {
          statusMsg('Failed to restart the central component server.', false);
        }
      });

      break;

    case 'start':
      serviceStart(function (alive) {
        if (alive) {
          statusMsg('The central component service has started.', true);
        } else {
          statusMsg('Failed to start the central component server.', false);
        }
      });

      break;

    case 'stop':
      serviceStop(function (alive) {
        if (alive === false) {
          statusMsg('The central component service has stopped.', true);
        } else {
          statusMsg('Failed to stop the central component server.', false);
        }
      });

      break;

    default:
      request.ping(function (alive) {
        terminal
          .write('Service status: ')
          .color({
            attribute: 'bold',
            foreground: alive ? 'green' : 'red'
          })
          .write((alive ? 'Alive' : 'Dead') + '\n')
          .write('\n')
          .reset();
      });

      break;
  }
}

/**
 * Provides the help output for the 'service' command.
 *
 * @method onServiceHelp
 * @private
 */
function onServiceHelp() {
  'use strict';

  terminal
    .write('  Examples: \n\n')
    .write('    $ ems service [status]\n')
    .write('    $ ems service start\n')
    .write('    $ ems service stop\n')
    .write('    $ ems service restart\n')
    .write('\n')
    .reset();
}

/**
 * Exports the 'service' CLI command.
 */
module.exports = function (conf, req) {
  'use strict';

  config = conf;
  request = req;

  program
    .command('service [cmd]')
    .description('Show details of the service of this centralized component.')
    .action(onServiceAction)
    .on('--help', onServiceHelp);
};
