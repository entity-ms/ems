/**
 * @todo
 */

/**
 * @todo
 */
function listInstances(central) {
  'use strict';

  return function (req, res, next) {
    res.send({
      success: true,
      response: central.components.instances
    });
  };
}

/**
 * @todo
 */
function createInstance(central) {
  'use strict';

  return function (req, res, next) {
    central.components.create(function (err, cmp) {
      if (err) {
        return next(err);
      }

      res.send({
        success: true,
        response: {
          name: cmp.name,
          type: req.body.type,
          clsType: cmp.type,
          version: '0.0.0'
        }
      });
    }, req.body.name, req.body.type);
  };
}

/**
 * @todo
 */
function removeInstance(central) {
  'use strict';

  return function (req, res, next) {
    central.components.remove(function (err) {
      if (err) {
        return next(err);
      }

      res.send({
        success: true,
        response: {
          name: req.params.name
        }
      });
    }, req.params.name);
  };
}

/**
 * Exports the 'instance' routes.
 */
module.exports = function (central) {
  'use strict';

  central.api
    .get('/instances', listInstances(central))
    .post('/instances', createInstance(central))
    .get('/instances/:name', function (req, res, next) {
      // @todo - get instance details.

      next();
    })
    .delete('/instances/:name', removeInstance(central))
    .get('/instances/:name/start', function (req, res, next) {
      // @todo - start an instance.

      next();
    })
    .get('/instances/:name/stop', function (req, res, next) {
      // @todo - stop an instance.

      next();
    })
    .get('/instances/:name/restart', function (req, res, next) {
      // @todo - restart an instance.

      next();
    });

  // @todo
};
