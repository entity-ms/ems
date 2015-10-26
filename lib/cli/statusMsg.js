/**
 * @todo
 */

var colors = require('colors');

/**
 * @todo
 */
module.exports = function (msg, type) {
  'use strict';

  type = [
    'info', 'warning', 'error', 'success', 'fail'
  ].indexOf(type) ? type : 'info';

  var clrs = {
    info: 'white',
    warning: 'orange',
    error: 'red',
    success: 'green',
    fail: 'red'
  };

  console.log('[', type.bold[clrs[type]], ']', msg);
};
