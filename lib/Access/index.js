/**
 * @todo
 */

module.exports = function (central) {
  'use strict';

  central.app.use(require('body-parser').json());
  central.app.use(require('body-parser').urlencoded({
    extended: false
  }));
  central.app.use(cookieParser());
  central.app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }));
  central.app.use(passport.initialize());
  central.app.use(passport.session());

}