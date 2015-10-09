/**
 * @todo
 */

var path = require('path'),
    cluster = require('cluster'),
    CentralComponent = require('./lib');

var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  process.title = 'ems-central';

  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster
    .on('exit', function(worker, code, signal) {
      console.log('worker ' + worker.process.pid + ' died');
    });
} else {
  new CentralComponent(path.join(__dirname, 'config.json'))
    .start();
}
