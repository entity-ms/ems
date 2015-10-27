#!/usr/bin/env node

/**
 * Provides the EntityMS CLI functionality.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var path = require('path'),
    fs = require('fs'),
    http = require('http'),
    cp = require('child_process'),
    glob = require('glob'),
    program = require('commander'),
    colors = require('colors'),
    Config = require('ems-config'),
    Request = require('ems-request'),
    info = require('../package.json'),
    statusMsg = require('../lib/cli/statusMsg');

var config = new Config('../config.json'),
    request = new Request(
      'cli',
      'Cli',
      config.get('host', '0.0.0.0'),
      config.get('port', 9999)
    );

/**
 * Helper function to output a full line of a provided character.
 *
 * @method charFullWidth
 * @param {String} [char='*'] The character to output as full length of the
 *   terminal window.
 * @return {String} The outputted line.
 */
function charFullWidth(char) {
  var str = '';
  while (str.length < process.stdout.columns) {
    str += char || '*';
  }

  return str;
}

console.log(charFullWidth().bold.yellow);
console.log('*'.bold.yellow + (' EntityMS (eMS) CLI [v' + info.version + ']').bold);

request.ping(function (alive) {
  var status = alive ?
    'Alive'.bold.green :
    'Dead'.bold.red;

  console.log('*'.bold.yellow + ' Status: '.bold + status);
  console.log(charFullWidth().bold.yellow);

  program
    .version('Version: ' + info.version)
    .option('-fy, --force-yes', 'Always use a yes response.')
    .option('-fn, --force-no', 'Always use a no response.')
    .option('-v, --verbose', 'Output more verbose details.');

  glob.sync(path.join(
    __dirname, '..', 'lib', 'cli', 'commands', 'dead', '*.js'
  )).forEach(function (item) {
    require(path.relative(__dirname, item))(config, request);
  });

  if (alive) {
    glob.sync(path.join(
      __dirname, '..', 'lib', 'cli', 'commands', 'alive', '*.js'
    )).forEach(function (item) {
      require(path.relative(__dirname, item))(config, request);
    });
  }

  program
    .parse(process.argv);

  var pArgs = process.argv.slice(2);
  if (!pArgs.length) {
    program.outputHelp();
  } else if (
    pArgs.length > 0 &&
    program._events[pArgs[0]] === undefined
  ) {
    statusMsg('Unknown command ' + pArgs[0].bold, 'error');
  }

  console.log('');
});
