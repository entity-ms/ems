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
  }, 1000);
}

/**
 * @todo
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
 * @todo
 */
function serviceRestart(done) {
  'use strict';

  request.ping(function (alive) {
    if (alive) {
      _stop(function (alive2) {
        if (alive2) {
          statusMsg('Failed to stop the centralized component server.', false)
          return done(false);
        }

        _start(done);
      });
    } else {
      _start(done);
    }
  });
};

/**
 * @todo
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
 * @todo
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
 * @todo
 */
function onServiceAction(cmd, options) {
  'use strict';

  switch (cmd) {
    case 'restart':
      serviceRestart(function (alive) {
        alive ?
          statusMsg('The centralized component service has restarted.', true) :
          statusMsg('Failed to restart the centralized component server.', false);
      });

      break;

    case 'start':
      serviceStart(function (alive) {
        alive ?
          statusMsg('The centralized component service has started.', true) :
          statusMsg('Failed to start the centralized component server.', false);
      });

      break;

    case 'stop':
      serviceStop(function (alive) {
        alive === false ?
          statusMsg('The centralized component service has stopped.', true) :
          statusMsg('Failed to stop the centralized component server.', false);
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
 * @todo
 */
function onServiceHelp() {
  'use strict';

  terminal
    .write('  Examples: \n\n')
    .write('    $ ems-central service [status]\n')
    .write('    $ ems-central service start\n')
    .write('    $ ems-central service stop\n')
    .write('    $ ems-central service restart\n')
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
    .command('service [cmd]')
    .description('Show details of the service of this centralized component.')
    .action(onServiceAction)
    .on('--help', onServiceHelp);
};
