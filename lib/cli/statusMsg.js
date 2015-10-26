/**
 * @todo
 */

var colors = require('colors');

/**
 * @todo
 */
module.exports = function (msg, success) {
  'use strict';

  var status = success ?
    'success'.bold.green :
    'failed'.bold.red;

  console.log(' [' + status + ']', msg);
};
