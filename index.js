/**
 * Starts the Central Component as a cluster.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var path = require('path'),
    cluster = require('cluster'),
    EntityMS = require('./lib');

var maxWorkers = require('os').cpus().length;

if (cluster.isMaster) {
  process.title = 'ems-central';

  for (var i = 0; i < maxWorkers; i++) {
    cluster.fork();
  }

  cluster
    .on('exit', function(worker, code, signal) {
      console.log('worker ' + worker.process.pid + ' died');
    });
} else {
  new EntityMS(path.join(__dirname, 'config', 'config.json'))
    .start();
}
