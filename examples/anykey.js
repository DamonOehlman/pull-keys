var pull = require('pull-stream');
var keymap = require('../');

pull(
  keymap(),
  pull.log()
);
