#!/usr/bin/env node

/**
 * @todo
 */

var path = require('path'),
    fs = require('fs'),
    http = require('http'),
    cp = require('child_process'),
    program = require('commander'),
    terminal = require('color-terminal'),
    Config = require('ems-config'),
    Request = require('ems-request'),
    info = require('../package.json'),

    statusMsg = require('../lib/cli/statusMsg'),
    infoMsg = require('../lib/cli/infoMsg');

var config = new Config('../config.json'),
    request = new Request(
      'cli',
      'Cli',
      config.get('host', '0.0.0.0'),
      config.get('port', 9999)
    );

/**
 * @todo
 */
function charFullWidth(char) {
  var str = '';
  while (str.length < process.stdout.columns) {
    str += char || '*';
  }

  return str + '\n';
}

terminal.color({
  attribute: 'bold',
  foreground: 'yellow'
})
.write(charFullWidth())
.write('* EntityMS (eMS) CLI [v' + info.version + ']\n');

request.ping(function (alive) {
  terminal
    .color({
      attribute: 'bold',
      foreground: 'yellow'
    })
    .write('* Status: ')
    .color({
      attribute: 'bold',
      foreground: alive ? 'green' : 'red'
    })
    .write((alive ? 'Alive' : 'Dead') + '\n')
    .color({
      attribute: 'bold',
      foreground: 'yellow'
    })
    .write(charFullWidth())
    .reset();

  program
    .version('Version: ' + info.version)/*
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq-sauce', 'Add bbq sauce')*/;

  require('../lib/cli/commands/service')(config, request);

  if (alive) {
    // @todo
    require('../lib/cli/commands/info')(config, request);
  }

  program
    .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
});
