var pull = require('pull-stream');
var pk = require('../');

pull(
  pk({
    left: '<left>',
    right: true,
    selectAll: ['<control>', 'a']
  }),
  pull.log()
);
