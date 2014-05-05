/* jshint node: true */
/* global: HTMLElement */

var pull = require('pull-core');
var vkey = require('vkey');

module.exports = pull.Source(function(def, el) {
  var buffer = [];
  var waiting = [];

  function bufferKey(key) {
    var sendKey = waiting.length > 0 ? waiting.splice(0)[0] : null;

    // if we have a waiting callback, trigger that now
    if (typeof sendKey == 'function') {
      return sendKey(null, key);
    }

    // otherwise, buffer the key
    buffer.push(key);
  }

  function checkKey(key) {
    console.log('need to check key: ' + key);
  }

  function handleKey(evt) {
    var key = vkey[evt.keyCode];

    // if we don't have a known key abort
    if (! key) {
      return;
    }

    // if we have definitions, then check the key
    if (def) {
      checkKey(key);
    }
    // otherwise, immediately buffer the key
    else {
      bufferKey(key);
    }
  }

  // if the definition list is a HTMLElement, then remap args
  if (el instanceof HTMLElement) {
    el = def;
    def = undefined;
  }

  // use window if an element is not defined
  el = el || window;

  // bind the keydown listener
  el.addEventListener('keydown', handleKey);

  function next(end, cb) {
    if (end) {
      return cb(end);
    }

    if (buffer.length > 0) {
      return cb(null, buffer.shift());
    }

    // otherwise, accept the next key
    waiting.push(cb);
  }

  return next;
});
