/**
 * @todo
 */

var http = require('http'),
    Config = require('ems-config'),
    Commands = require('ems-commands'),
    Request = require('ems-request');

/**
 * @todo
 */
function OnRequest(req, res) {
  'use strict';

  var body = '';

  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    body += chunk;
  });

  req.on('end', function () {
    console.info('BODY', body);
    var data = body !== '' ? JSON.parse(body) : {};

    // empty 200 OK response for now
    //res.writeHead(200, "OK", {'Content-Type': 'text/html'});
    //res.end();

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      success: true,
      response: data
    }));
  });
}

/**
 * @todo
 */
function CentralComponent(filename) {
  'use strict';

  var me = this,
      _config = new Config(filename, true),
      _request = new Request('central', me.name, me.host, me.port),
      _components = {},
      _commands = new Commands(this),
      _server = http.createServer(),
      _status = false;

  _server
    .on('request', function (req, res) {
      _commands.request(req, res);
    })
    .on('listening', function () {
      console.info('[' + me.name + '] listening on ' + me.host + ':' + me.port + '.');
    })
    .on('error', function (err) {
      console.error('ERROR', err);
    });

  Object.defineProperties(this, {
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

  _commands.register('info', require('./Commands/Info'));
}

/**
 * @todo
 */
CentralComponent.prototype.start = function () {
  'use strict';

  if (this.status !== true) {
    this.server.listen(this.port, this.host);
  }

  return this;
};

/**
 * @todo
 */
CentralComponent.prototype.register = function (type, name, host, ip) {
  'use strict';

  if (this.components[type + ':' + name] !== undefined) {
    throw new Error(); // @todo
  }

  // @todo - send hello request.

  this.components[type + ':' + name] = {
    host: host,
    ip: ip
  };

  return this;
};

/**
 * @todo
 */
CentralComponent.prototype.unregister = function (type, name) {
  'use strict';

  if (this.components[type + ':' + name] !== undefined) {
    // @todo - say goodbye?
    delete this.components[type + ':' + name];
  }

  return this;
};

/**
 * Exports the CentralComponent class.
 */
module.exports = CentralComponent;
