/**
 * @todo
 */

var app = require('express')(),
    swig = require('swig');

/**
 * @todo
 */
function WebUI(central) {
  'use strict';

  Object.defineProperties(this, {
    /**
     * @todo
     */
    central: {
      get: function () {
        return central;
      }
    },
    /**
     * @todo
     */
    app: {
      get: function () {
        return app;
      }
    },
    /**
     * @todo
     */
    swig: {
      get: function () {
        return swig;
      }
    }
  });
}

/**
 * @todo
 */
WebUI.prototype.initialize = function () {
  'use strict';

  // Setup template engine.
  app.engine('swig', swig.renderFile);
  app.set('view engine', 'swig');
  app.set('views', __dirname + '/views');

  var cache = this.central.config.get('webui.cache', false);
  app.set('view cache', cache === true);
  swig.setDefaults({
    cache: cache === true
  });

  //app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(cookieParser());
  app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(path.join(__dirname, 'public')));
/*
  app.get('/', function (req, res) {
    res.render('index', {});
  });

  // passport config
  var Account = require('../Access/Account');
  passport.use(new LocalStrategy(Account.authenticate()));
  passport.serializeUser(Account.serialize());
  passport.deserializeUser(Account.deserialize());
*/
  // mongoose
  //mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');

/*
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
*/
};

/**
 * Exports the WebUI class.
 */
module.exports = WebUI;
