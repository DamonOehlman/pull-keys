var pull = require('pull-stream');
var keymap = require('../');

pull(
  keymap({
    left: '<left>',
    right: true,
    selectAll: ['<control>', 'a']
  }),
  pull.log()
);
