/**
 * @todo
 */

var program = require('commander'),
    colors = require('colors'),
    statusMsg = require('../../statusMsg');

/**
 * @todo
 */
function listInstances(config, request) {
  'use strict';

  request.get(function (err, success, response) {
    if (err) {
      statusMsg(err.message, 'error');
      console.log('\n', err.stack, '\n');
      return;
    }

    var instances = [];
    response.forEach(function (item) {
      instances.push(item.name + ' <' + item.type + '>');
    });

    console.log('Instances: '.bold);
    if (instances.length > 0) {
      console.log('    ' + instances.join('\n    '));
    } else {
      console.log('[none]');
    }

    console.log('');
  }, 'api/instances');
}

/**
 * @todo
 */
function createInstance(config, request, name, options) {
  'use strict';

  if (options.type === undefined) {
    statusMsg(
      'You must specify a component type using -t or --type.'.bold,
      'warning'
    );
    console.log('');
    return;
  }

  request.post(function (err, success, response) {
    if (err) {
      statusMsg(err.message, 'error');
      console.log('\n', err.stack, '\n');
      return;
    }

    statusMsg(
      'Component instance ' + response.name.bold + ' of type ' +
        (response.type + '@' + response.version).bold + ' has been created.',
      'success'
    );

    console.log('');
  }, 'api/instances', {
    name: name,
    type: options.type
  });
}

/**
 * @todo
 */
function infoInstance(config, request, name) {
  'use strict';

  request.get(function (err, success, response) {
    if (err) {
      console.log('\nError:'.bold, err.message, '\n', err.stack);
      return;
    }

    console.log('Name:'.bold, response.name);
    console.log('Type:'.bold, response.type);
    console.log('Version:'.bold, response.version);
    console.log(
      'Status:'.bold, response.status ? 'Running'.green : 'Stopped'.red
    );
    console.log('');
  }, 'api/instances/' + name);
}

/**
 * @todo
 */
function removeInstance(config, request, name) {
  'use strict';

  request.delete(function (err, success, response) {
    if (err) {
      statusMsg(err.message, 'error');
      console.log('\n', err.stack, '\n');
      return;
    }

    statusMsg(
      'Component instance ' + response.name.bold + ' has been removed.',
      'success'
    );

    console.log('');
  }, 'api/instances/' + name);
}

/**
 * @todo
 */
function onInstancesAction (config, request) {
  'use strict';

  return function (cmd, name, options) {
    if (cmd && cmd !== 'list' && !name) {
      console.log('Either an unspecified or an unknown instance name.'.bold);
      return;
    }

    switch (cmd) {
      default:
      case 'list':
        listInstances(config, request);
        break;

      case 'create':
        createInstance(config, request, name, options);
        break;

      case 'info':
        infoInstance(config, request, name);
        break;

      case 'remove':
        removeInstance(config, request, name);
        break;
    }
  };
}

/**
 * @todo
 */
function onInstancesHelp() {
  'use strict';

  console.log('  Examples:');
  console.log('');
  console.log('    $ entity-ms instances [list]');
  console.log(
    '    $ entity-ms instances create example-1 --type ems-simple-example'
  );
  console.log('    $ entity-ms instances info example-1');
  console.log('    $ entity-ms instances remove example-1');
  console.log('    $ entity-ms instances start example-1');
  console.log('    $ entity-ms instances stop example-1');
  console.log('    $ entity-ms instances restart example-1');
  console.log('    $ entity-ms instances status example-1');
}

/**
 * @todo
 */
module.exports = function (config, request) {
  'use strict';

  program
    .command('instances [cmd] [name]')
    .description('Show details of component instances, and manage instances.')
    .option('-t, --type <type>', 'The type of instance component to create.')
    .action(onInstancesAction(config, request))
    .on('--help', onInstancesHelp);
};
