/**
 * Starts the Central Component as a cluster.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var path = require('path'),
    cluster = require('cluster'),
    EntityMS = require('./lib');

var maxWorkers = require('os').cpus().length,
    workers = {};

function onMessage (msg) {
  var _pid = '' + this.process.pid;
  for (var pid in workers) {
    if (pid === _pid) {
      return;
    }

    workers[pid].send(msg);
  }
}

if (cluster.isMaster) {
  process.title = 'ems-central';

  for (var i = 0; i < maxWorkers; i++) {
    var worker = cluster.fork();
    worker.on('message', onMessage);
    workers[worker.process.pid] = worker;
  }

  cluster
    .on('exit', function (worker, code, signal) {
      delete workers[worker.pid];
    });
} else {
  new EntityMS(path.join(__dirname, 'config', 'config.json'))
    .start();
}
