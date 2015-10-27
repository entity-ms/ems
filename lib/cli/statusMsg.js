/**
 * Provides a status message helper.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

/**
 * Provides the status message helper.
 *
 * @method statusMsg
 * @param {String} msg The status message.
 * @param {String} type The status message type.
 */
module.exports = function statusMsg (msg, type) {
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
