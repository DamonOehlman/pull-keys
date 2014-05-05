var pull = require('pull-stream');
var keymap = require('../');

pull(
  keymap({
    left: '<left>',
    selectAll: ['<control>', 'a']
  }),
  pull.log()
);
