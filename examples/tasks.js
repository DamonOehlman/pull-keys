var pull = require('pull-stream');
var pk = require('..');
var task = require('taskify')();

task('selectAll', function() {
  console.log('need to select all');
});

// task up depends on select all
task('up', ['selectAll'], function() {
  console.log('need to move up');
});

// map commands to tasks
pull(
  pk({
    selectAll: ['<control>', 'a'],
    up: '<up>',
    right: true
  }),
//   pull.log()
  pull.drain(task.exec)
);
