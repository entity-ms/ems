/**
 * @todo
 */

var terminal = require('color-terminal');

/**
 * @todo
 */
module.exports = function (msg) {
  'use strict';

  return terminal
    .color({
      attribute: 'bold'
    })
    .write(msg + '\n')
    .reset();
};
