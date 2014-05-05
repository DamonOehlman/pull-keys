var pull = require('pull-stream');
var pk = require('../');

pull(
  pk(),
  pull.log()
);
