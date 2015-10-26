/**
 * @todo
 */

/**
 * Provides the utility function 'strtr' from PHP.js [http://phpjs.org/].
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

/**
 * Replace the tokens in the str with the given args.
 *
 * @method strtr
 * @param {String} str The string that will be have its tokens replaced.
 * @param {Object} [args] Tokens to be replaced.
 * @return {String} Returns the translated and tokenized string.
 */
module.exports = function strtr (str, args) {
  'use strict';

  var i = 0, j = 0,
      lenStr = str.length, lenFrom = 0,
      from = [], to = [],
      ret = '',
      match = false;

  for (var arg in args) {
    from.push(':' + arg);
    to.push(args[arg]);
  }

  lenFrom = from.length;
  for (i = 0; i < lenStr; i++) {
    match = false;
    for (j = 0; j < lenFrom; j++) {
      if (str.substr(i, from[j].length) === from[j]) {
        match = true;
        i = (i + from[j].length) - 1;

        break;
      }
    }

    ret += match ? to[j] : str.charAt(i);
  }

  return ret;
};
