/**
 * @todo
 */

var program = require('commander'),
    terminal = require('color-terminal');

var request;

/**
 * @todo
 */
function listInstances() {
  'use strict';

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

    var instances = [];
    response.forEach(function (item) {
      instances.push(item.name + ' <' + item.type + '>');
    });

    terminal
      .color({
        attribute: 'bold'
      })
      .write('Instances: ')
      .reset();

    if (instances.length > 0) {
      terminal
        .write('\n')
        .write('    ' + instances.join('\n    '));
    } else {
      terminal.write('[none]');
    }

    terminal.write('\n');
  }, 'api/instances');
}

/**
 * @todo
 */
function createInstance(name, options) {
  'use strict';

  if (options.type === undefined) {
    terminal
      .color({
        attribute: 'bold'
      })
      .write('You must specify a component type using -t or --type.')
      .write('\n')
      .reset();

    return;
  }

  request.post(function (err, success, response) {
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
      .write('Component instance ')
      .color({
        attribute: 'bold'
      })
      .write(response.name)
      .reset()
      .write(' of type ')
      .color({
        attribute: 'bold'
      })
      .write(response.type + '@' + response.version)
      .reset()
      .write(' has been created ')
      .color({
        attribute: 'bold'
      })
      .write('successfully')
      .reset()
      .write('.\n');
  }, 'api/instances', {
    name: name,
    type: options.type
  });
}

/**
 * @todo
 */
function infoInstance(name) {
  'use strict';

  // @todo
}

/**
 * @todo
 */
function removeInstance(name) {
  'use strict';

  request.delete(function (err, success, response) {
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
      .write('Component instance ')
      .color({
        attribute: 'bold'
      })
      .write(response.name)
      .reset()
      .write(' has been removed ')
      .color({
        attribute: 'bold'
      })
      .write('successfully')
      .reset()
      .write('.\n');
  }, 'api/instances/' + name);
}

/**
 * @todo
 */
function onInstancesAction(cmd, name, options) {
  'use strict';

  if (cmd && cmd !== 'list' && !name) {
    terminal
      .color({
        attribute: 'bold'
      })
      .write('Either an unspecified or an unknown instance name.')
      .write('\n')
      .reset();

    return;
  }

  switch (cmd) {
    default:
    case 'list':
      listInstances();
      break;

    case 'create':
      createInstance(name, options);
      break;

    case 'info':
      infoInstance(name);
      break;

    case 'remove':
      removeInstance(name);
      break;
  }
}

/**
 * @todo
 */
function onInstancesHelp() {
  'use strict';

  terminal
    .write('  Examples: \n\n')
    .write('    $ ems instances [list]\n')
    .write('    $ ems instances create example-1 --type ems-simple-example\n')
    .write('    $ ems instances info example-1\n')
    .write('    $ ems instances remove example-1\n')
    .write('    $ ems instances start example-1\n')
    .write('    $ ems instances stop example-1\n')
    .write('    $ ems instances restart example-1\n')
    .write('    $ ems instances status example-1\n')
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
    .command('instances [cmd] [name]')
    .description('Show details of component instances, and manage instances.')
    .option('-t, --type <type>', 'The type of instance component to create.')
    .action(onInstancesAction)
    .on('--help', onInstancesHelp);
};
