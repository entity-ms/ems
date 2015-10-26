/**
 * @todo
 */

/**
 * Exports the 'api' route.
 */
module.exports = function (central) {
  'use strict';

  central.api.get('/', function (req, res) {
    var routes = [];

    for (var key in central.api._router.stack) {
      if (central.api._router.stack.hasOwnProperty(key)) {
        var route = central.api._router.stack[key];
        if (route.route) {
          routes.push({
            method: route.route.stack[0].method,
            name: route.route.path,
            path: route.route.path
          });
        }
      }
    }

    res.render('api', {
      component: central,
      routes: routes
    });
  });
};
