#!/usr/bin/env node

/**
 * @todo
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
    info = require('../package.json');

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
    .version('Version: ' + info.version)/*
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq-sauce', 'Add bbq sauce')*/;

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

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
});
