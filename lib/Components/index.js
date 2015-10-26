/**
 * Provides the components class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

var path = require('path'),
    async = require('async');

var globalPath = '',
    _instances = {};

/**
 * The components class provides access to components and instances.
 *
 * @class Components
 * @constructor
 * @param {EntityMS} central The central object.
 */
function Components(central) {
  'use strict';

  var me = this;

  Object.defineProperties(this, {
    /**
     * An instance to the central object.
     *
     * @var {EntityMS} central
     * @memberof Components
     * @instance
     * @readOnly
     */
    central: {
      get: function () {
        return central;
      }
    },
    /**
     * An object containing details of the defined instances.
     *
     * @var {Object} _instances
     * @memberof Components
     * @instance
     * @readOnly
     */
    _instances: {
      get: function () {
        return _instances;
      }
    },
    /**
     * An array of defined instances names and details.
     *
     * @var {Array} instances
     * @memberof Components
     * @instance
     * @readOnly
     */
    instances: {
      get: function () {
        var instances = [];
        Object.keys(me._instances).forEach(function (item) {
          instances.push({
            name: item,
            type: me._instances[item].type,
            typeCls: me._instances[item].instance.type,
            version: me._instances[item].version
          });
        });

        return instances;
      }
    }
  });

  central
    .on('components.update', function (data) {
      me.installed(function (err, instance) {
        // @todo - do something?
      }, true);
    })
    .on('components.create', function (data) {
      me.create(function (err, instance) {
        // @todo - do something?
      }, data.name, data.type, true);
    })
    .on('components.remove', function (data) {
      me.remove(function (err, instance) {
        // @todo - do something?
      }, data.name, true);
    });

  // @todo
  this.installed(function () {});
}

/**
 * @todo
 */
Components.prototype.installed = function (done, reset) {
  'use strict';

  if (this._installed && reset !== true) {
    return done(null, this._installed);
  }

  this._installed = [];

  var me = this,
      child = require('child_process').exec('npm list -g --depth=0'),
      err = null;

  child.stdout.on('data', function (data) {
    var lines = data.split('\n');
    globalPath = lines.shift();

    lines.forEach(function (item) {
      if (item.length <= 4) {
        return;
      }

      var cmp = item.substring(4, item.indexOf('@')),
          version = item.substring(
            item.indexOf('@') + 1,
            item.lastIndexOf(' ')
          ),
          filename = path.join(globalPath, 'node_modules', cmp),
          packg = require(path.join(filename, 'package.json'));

      if (packg.entityMS && packg.entityMS.type === 'component') {
        me._installed.push({
          name: cmp,
          version: version
        });
      }
    });
  });

  child.stderr.on('data', function (data) {
    err = new Error(data);
  });

  child.on('close', function (code) {
    done(err, me._installed);
  });
};

/**
 * @todo
 */
Components.prototype.install = function (componentType) {};

/**
 * @todo
 */
Components.prototype.uninstall = function (componentType) {};

/**
 * @todo
 */
Components.prototype.update = function (componentType) {};

/**
 * @todo
 */
Components.prototype.create = function (done, name, type, silent) {
  'use strict';

  var me = this,
      queue = [],
      components = [],
      versions = {};

  queue.push(function (next) {
    if (me._instances[name] !== undefined) {
      return next(
        new Error('Component instance "' + name + '" already defined.')
      );
    }

    next();
  });

  queue.push(function (next) {
    me.installed(function (err, installed) {
      if (err) {
        return next(err);
      }

      installed.forEach(function (item) {
        components.push(item.name);
        versions[item.name] = item.version;
      });

      next();
    });
  });

  queue.push(function (next) {
    var idx = components.indexOf(type);
    if (idx === -1) {
      return next(new Error('Unknown component type "' + type + '".'));
    }

    me.central.info(
      'Components',
      'Created Component',
      'Successfully created the component instance ":name" of type ":type".',
      {
        name: name,
        type: type
      }
    );

    me._instances[name] = {
      type: components[idx],
      version: versions[components[idx]],
      instance: null
    };

    me.start(next, name);
  });

  async.series(queue, function (err) {
    if (err) {
      return done(err);
    }

    if (!silent) {
      me.central.message('components.create', {
        name: name,
        type: type
      });
    }

    done(null, me._instances[name].instance);
  });
};

/**
 * @todo
 */
Components.prototype.remove = function (done, name, silent) {
  'use strict';

  if (this._instances[name] === undefined) {
    done(new Error('The component instance "' + name + '" is undefined.'));
  }

  var me = this;
  this.stop(function (err) {
    if (err) {
      return done(err);
    }

    delete me._instances[name];
    if (!silent) {
      me.central.message('components.remove', {
        name: name
      });

      me.central.message('components.update');
    }

    me.central.info(
      'Components',
      'Removed Component',
      'Successfully removed the component instance ":name".',
      {
        name: name
      }
    );

    done();
  }, name);
};

/**
 * @todo
 */
Components.prototype.start = function (done, name) {
  'use strict';

  if (this._instances[name] === undefined) {
    return done(new Error('Unknown component instance "' + name + '".'));
  }

  var packg = path.join(globalPath, 'node_modules', this._instances[name].type);

  delete require.cache[packg];

  var ComponentType = require(packg),
      cmp = new ComponentType(this.central, name);

  this.central.info(
    'Components',
    'Started Component',
    'Successfully started the component instance ":name".',
    {
      name: name
    }
  );
  this._instances[name].instance = cmp;

  done();
};

/**
 * @todo
 */
Components.prototype.stop = function (done, name) {
  'use strict';

  if (this._instances[name] === undefined) {
    return done(new Error('Unknown component instance "' + name + '".'));
  }

  this.central.info(
    'Components',
    'Stopped Component',
    'Successfully stopped the component instance ":name".',
    {
      name: name
    }
  );

  this._instances[name].instance = null;

  done();
};

/**
 * @todo
 */
Components.prototype.restart = function (done, name) {};

// @todo - modules?

/**
 * @todo
 */
module.exports = Components;
