/**
 * @todo
 */

var util = require('util'),
    path = require('path'),
    http = require('http'),
    events = require('events'),
    express = require('express'),
    swig = require('swig'),
    glob = require('glob'),
    Config = require('ems-config'),
    Request = require('ems-request'),
    Components = require('./Components'),
    strtr = require('./Utils/strtr');

/**
 * @todo
 */
function EntityMS(filename) {
  'use strict';

  EntityMS.super_.call(this);

  var me = this,
      _config = new Config(filename, true),
      _request = new Request('central', me.name, me.host, me.port),
      _components = new Components(this),
      _app = express(),
      _api = /* eslint-disable */express.Router(),/* eslint-enable */
      _server = http.createServer(_app),
      _status = false;

  _server
    .on('listening', function () {
      me.info(
        'Core',
        'Listening',
        'Process [:pid] listening on :host::port.',
        {
          pid: process.pid,
          host: me.host,
          port: me.port
        }
      );
    })
    .on('error', function (err) {
      me.error(
        'Core',
        'Server Error',
        'There was a server error: :err',
        {
          err: err.message,
          stack: err.stack
        }
      );
    });

  Object.defineProperties(this, {
    /**
     * @todo
     */
    app: {
      get: function () {
        return _app;
      }
    },
    /**
     * @todo
     */
    api: {
      get: function () {
        return _api;
      }
    },
    /**
     * @todo
     */
    config: {
      get: function () {
        return _config;
      }
    },
    /**
     * @todo
     */
    request: {
      get: function () {
        return _request;
      }
    },
    /**
     * @todo
     */
    server: {
      get: function () {
        return _server;
      }
    },
    /**
     * @todo
     */
    name: {
      get: function () {
        return _config.get('name', 'centralized1');
      }
    },
    /**
     * @todo
     */
    title: {
      get: function () {
        return _config.get('title', 'Centralized 1');
      }
    },
    /**
     * @todo
     */
    description: {
      get: function () {
        return _config.get('description', '');
      }
    },
    /**
     * @todo
     */
    host: {
      get: function () {
        return _config.get('host', '0.0.0.0');
      }
    },
    /**
     * @todo
     */
    port: {
      get: function () {
        return _config.get('port', 9999);
      }
    },
    /**
     * @todo
     */
    status: {
      get: function () {
        return _status;
      }
    },
    /**
     * @todo
     */
    registered: {
      get: function () {
        return Object.keys(_components);
      }
    },
    /**
     * @todo
     */
    components: {
      get: function () {
        return _components;
      }
    }
  });

  this._setupApp();

  process.on('message', function (msg) {
    if (msg.pid === process.pid) {
      return;
    }

    me.info(
      'Core',
      'Message Recieved',
      'Recieved a message from :pid triggering the event ":event".',
      {
        pid: process.pid,
        event: msg.event
      }
    );

    me.emit(msg.event, msg.data);
  });

  // @todo - check access permissions.

  this.message = function (event, data) {
    process.send({
      sender: process.pid,
      event: event,
      data: data
    });
  };
}

util.inherits(EntityMS, events.EventEmitter);

/**
 * @todo
 */
EntityMS.prototype._setupApp = function () {
  'use strict';

  this.app.engine('swig', swig.renderFile);
  this.app.set('view engine', 'swig');
  this.app.set('views', __dirname + '/Views');

  this.app.use(require('body-parser').json());
  this.app.use('/api', this.api);

  this.app.get('/', function (req, res) {
    // @todo
    res.redirect(200, '/api');
  });

  var me = this;
  glob.sync(path.join(
    __dirname, 'Routes', '*.js'
  )).forEach(function (item) {
    require('./' + path.relative(__dirname, item))(me);
  });

  this.app.use(function (req, res, next) {
    var err = new Error('Unknown REST command ' + req.url);
    err.status = 404;
    next(err);
  });

  this.app.use(function (err, req, res, next) {
    // @todo - me.error('Routing Error', err.message);
    res
      .status(err.status || 500)
      .send({
        success: false,
        error: err.message
      });
  });
};

/**
 * @todo
 */
EntityMS.prototype.start = function () {
  'use strict';

  if (this.status !== true) {
    this.server.listen(this.port, this.host);
  }

  return this;
};

/**
 * Send a log message.
 *
 * @method log
 * @param {String} type The log type.
 * @param {String} group The log message group.
 * @param {String} title The title of the log message.
 * @param {String} message The log message.
 * @param {Object} [data] Any additional data to store along with the log.
 * @return {EntityMS} Returns self.
 * @chainable
 */
EntityMS.prototype.log = function (type, group, title, message, data) {
  'use strict';

  type = [
    'INFO', 'WARN', 'ERROR', 'FATAL', 'DEBUG'
  ].indexOf(type) > -1 ? type : 'INFO';

  /* eslint-disable */
  var log = {
    time: Date.now(),
    type: type,
    group: group,
    title: title,
    message: message,
    data: data
  };
  /* eslint-enable */

  // @todo

  console.info(
    '[' + type + '] ' + strtr(title, data) + ': ' + strtr(message, data)
  );

  return this;
};

/**
 * Send an 'info' log message.
 *
 * @method info
 * @param {String} group The log message group.
 * @param {String} title The title of the log message.
 * @param {String} message The log message.
 * @param {Object} [data] Any additional data to store along with the log.
 * @return {EntityMS} Returns self.
 * @chainable
 */
EntityMS.prototype.info = function (group, title, message, data) {
  'use strict';

  return this.log('INFO', group, title, message, data);
};

/**
 * Send a 'warn' log message.
 *
 * @method warn
 * @param {String} group The log message group.
 * @param {String} title The title of the log message.
 * @param {String} message The log message.
 * @param {Object} [data] Any additional data to store along with the log.
 * @return {EntityMS} Returns self.
 * @chainable
 */
EntityMS.prototype.warn = function (group, title, message, data) {
  'use strict';

  return this.log('WARN', group, title, message, data);
};

/**
 * Send an 'error' log message.
 *
 * @method error
 * @param {String} group The log message group.
 * @param {String} title The title of the log message.
 * @param {String} message The log message.
 * @param {Object} [data] Any additional data to store along with the log.
 * @return {EntityMS} Returns self.
 * @chainable
 */
EntityMS.prototype.error = function (group, title, message, data) {
  'use strict';

  return this.log('ERROR', group, title, message, data);
};

/**
 * Send a 'fatal' log message.
 *
 * @method fatal
 * @param {String} group The log message group.
 * @param {String} title The title of the log message.
 * @param {String} message The log message.
 * @param {Object} [data] Any additional data to store along with the log.
 * @return {EntityMS} Returns self.
 * @chainable
 */
EntityMS.prototype.fatal = function (group, title, message, data) {
  'use strict';

  return this.log('FATAL', group, title, message, data);
};

/**
 * Send a 'debug' log message.
 *
 * @method debug
 * @param {String} group The log message group.
 * @param {String} title The title of the log message.
 * @param {String} message The log message.
 * @param {Object} [data] Any additional data to store along with the log.
 * @return {EntityMS} Returns self.
 * @chainable
 */
EntityMS.prototype.debug = function (group, title, message, data) {
  'use strict';

  return this.log('DEBUG', group, title, message, data);
};

/**
 * @todo
 */

/**
 * Exports the EntityMS class.
 */
module.exports = EntityMS;
