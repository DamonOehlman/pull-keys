/* jshint node: true */
/* global: HTMLElement */

var pull = require('pull-core');
var vkey = require('vkey');

/**
  # pull-keys

  A pull-stream for keydown events, using [vkey](https://github.com/chrisdickinson/vkey)
  key-codes.  Saw [keydown](https://github.com/maxogden/keydown) and thought this
  might be a good idea too.

  ## Example Usage

  For any key presses:

  <<< examples/anykey.js

  Or define, a key map:

  <<< examples/keymap.js

**/

module.exports = pull.Source(function(keymap, el) {
  var buffer = [];
  var waiting = [];
  var identifiers = [];
  var keyValues = [];
  var queue = [];
  var maxBufferSize = 1;

  function checkBuffer() {
    var matched = false;

    // iterate through the buffer
    keyValues.forEach(function(values, idx) {
      var test;
      if (matched) {
        return;
      }

      // check for a match
      test = buffer.slice(-values.length);
      matched = values.reduce(function(memo, val, testIdx) {
        return memo && test[testIdx] && val.toLowerCase() === test[testIdx].toLowerCase();
      }, true);

      // if we had a match, then queue the action
      if (matched) {
        queueKey(identifiers[idx]);

        // remove the last character from the buffer to allow more matches
        buffer = buffer.slice(0, -1);
      }
    });

    // if the buffer is longer than the maxBufferSize, clean it up
    buffer = buffer.slice(-maxBufferSize);
  }

  function handleKey(evt) {
    var key = vkey[evt.keyCode];

    // if we don't have a known key abort
    if (! key) {
      return;
    }

    // if we have definitions, then check the key
    if (keymap) {
      buffer.push(key);
      checkBuffer();
    }
    // otherwise, immediately buffer the key
    else {
      queueKey(key);
    }
  }

  function parseKeymap() {
    Object.keys(keymap).forEach(function(key, idx) {
      var values = [].concat(keymap[key] || ('<' + key + '>'));

      // fix any boolean true values
      values = values.map(function(val) {
        return val === true ? ('<' + key + '>') : val;
      });

      identifiers[idx] = key;
      keyValues[idx] = values;

      // update the required max buffer size (based on the longest key combination)
      maxBufferSize = Math.max(maxBufferSize, values.length);
    });
  }

  function queueKey(key) {
    var sendKey = waiting.length > 0 ? waiting.splice(0)[0] : null;

    // if we have a waiting callback, trigger that now
    if (typeof sendKey == 'function') {
      return sendKey(null, key);
    }

    // otherwise, buffer the key
    queue.push(key);
  }

  // if the definition list is a HTMLElement, then remap args
  if (el instanceof HTMLElement) {
    el = keymap;
    keymap = undefined;
  }

  // use window if an element is not defined
  el = el || window;

  // bind the keydown listener
  el.addEventListener('keydown', handleKey);

  // if we have definitions, then parse
  if (keymap) {
    parseKeymap();
  }

  function next(end, cb) {
    if (end) {
      return cb(end);
    }

    if (queue.length > 0) {
      return cb(null, queue.shift());
    }

    // otherwise, accept the next key
    waiting.push(cb);
  }

  return next;
});
