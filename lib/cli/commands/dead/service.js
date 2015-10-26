/**
 * Provides the 'service' CLI command.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var path = require('path'),
    fs = require('fs'),
    cp = require('child_process'),
    program = require('commander'),
    colors = require('colors'),
    statusMsg = require('../../statusMsg');

var cwd = path.normalize(path.join(__dirname, '..', '..', '..', '..'));

/**
 * Perform the service start.
 *
 * @method _start
 * @param {Function} dne The done callback.
 * @aysnc
 * @private
 */
function _start(config, request, done) {
  'use strict';

  console.log('Starting centralized component...');
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
function _stop(config, request, done) {
  'use strict';

  console.log('Stopping centralized component...');
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
function serviceRestart(config, request, done) {
  'use strict';

  request.ping(function (alive) {
    if (alive) {
      _stop(config, request, function (alive2) {
        if (alive2) {
          statusMsg(
            'Failed to stop the centralized component server.',
            'failed'
          );

          return done(false);
        }

        _start(config, request, done);
      });
    } else {
      _start(config, request, done);
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
function serviceStart(config, request, done) {
  'use strict';

  request.ping(function (err, alive) {
    if (!alive) {
      _start(config, request, done);
    } else {
      statusMsg(
        'The centralized component service is already running.',
        'success'
      );
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
function serviceStop(config, request, done) {
  'use strict';

  request.ping(function (alive) {
    if (alive) {
      _stop(config, request, done);
    } else {
      statusMsg(
        'The centralized component service is already dead.',
        'success'
      );
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
function onServiceAction(config, request) {
  'use strict';

  return function (cmd, options) {
    switch (cmd) {
      case 'restart':
        serviceRestart(config, request, function (alive) {
          if (alive) {
            statusMsg(
              'The central component service has restarted.',
              'success'
            );
          } else {
            statusMsg(
              'Failed to restart the central component server.',
              'failed'
            );
          }
        });

        break;

      case 'start':
        serviceStart(config, request, function (alive) {
          if (alive) {
            statusMsg('The central component service has started.', 'success');
          } else {
            statusMsg(
              'Failed to start the central component server.',
              'failed'
            );
          }
        });

        break;

      case 'stop':
        serviceStop(config, request, function (alive) {
          if (alive === false) {
            statusMsg('The central component service has stopped.', 'success');
          } else {
            statusMsg('Failed to stop the central component server.', 'failed');
          }
        });

        break;

      default:
        request.ping(function (alive) {
          var status = alive ?
            'Alive'.bold.green :
            'Dead'.bold.red;

          console.log('Service status: ' + status)
        });

        break;
    }
  };
}

/**
 * Provides the help output for the 'service' command.
 *
 * @method onServiceHelp
 * @private
 */
function onServiceHelp() {
  'use strict';

  console.log('  Examples:');
  console.log('');
  console.log('    $ entity-ms service [status]');
  console.log('    $ entity-ms service start');
  console.log('    $ entity-ms service stop');
  console.log('    $ entity-ms service restart');
  console.log('');
}

/**
 * Exports the 'service' CLI command.
 */
module.exports = function (config, request) {
  'use strict';

  program
    .command('service [cmd]')
    .description('Show details of the service of this centralized component.')
    .action(onServiceAction(config, request))
    .on('--help', onServiceHelp);
};
