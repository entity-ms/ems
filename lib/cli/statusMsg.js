/**
 * @todo
 */

var terminal = require('color-terminal');

/**
 * @todo
 */
module.exports = function (msg, success) {
  'use strict';

  return terminal
    .write(' [')
    .color({
      attribute: 'bold',
      foreground: success ? 'green' : 'red'
    })
    .write(success ? 'success' : 'failed')
    .reset()
    .write('] ')
    .write(msg + '\n');
};
