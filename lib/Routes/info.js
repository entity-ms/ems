/**
 * Provides the '/api/info' API route.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var async = require('async'),
    info = require('../../package.json');

/**
 * Exports the '/api/info' route.
 */
module.exports = function (central) {
  'use strict';

  central.api.get('/info', function (req, res, next) {
    var queue = [],
        components = [],
        instances = [];

    queue.push(function (nxt) {
      central.components.installed(function (err, data) {
        if (err) {
          return nxt(err);
        }

        data.forEach(function (item) {
          components.push(item.name + '@' + item.version);
        });

        nxt();
      });
    });

    queue.push(function (nxt) {
      central.components.instances(function (err, data) {
        if (err) {
          return nxt(err);
        }

        data.forEach(function (item) {
          instances.push(item.name + ' <' + item.type + '>');
        });

        nxt();
      });
    });

    async.series(queue, function (err) {
      console.info(err);
      if (err) {
        return next(err);
      }

      res.send({
        success: true,
        response: {
          name: central.name,
          title: central.title,
          description: central.description,
          version: info.version,
          host: central.host,
          port: central.port,
          components: components,
          instances: instances
        }
      });
    });
  });
};
