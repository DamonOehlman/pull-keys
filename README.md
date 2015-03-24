# pull-keys

A pull-stream for keydown events, using [vkey](https://github.com/chrisdickinson/vkey)
key-codes.  Saw [keydown](https://github.com/maxogden/keydown) and thought this
might be a good idea too.


[![NPM](https://nodei.co/npm/pull-keys.png)](https://nodei.co/npm/pull-keys/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) [![bitHound Score](https://www.bithound.io/github/DamonOehlman/pull-keys/badges/score.svg)](https://www.bithound.io/github/DamonOehlman/pull-keys) 

## Example Usage

For any key presses:

```js
var pull = require('pull-stream');
var pk = require('pull-keys');

pull(
  pk(),
  pull.log()
);

```

Or define, a key map:

```js
var pull = require('pull-stream');
var pk = require('pull-keys');

pull(
  pk({
    left: '<left>',
    right: true,
    selectAll: ['<control>', 'a']
  }),
  pull.log()
);

```

Additionally, you can do some clever things by using a keymap to map key combinations
to [taskify](https://github.com/DamonOehlman/taskify) tasks:

```js
var pull = require('pull-stream');
var pk = require('pull-keys');
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

```

## License(s)

### ISC

Copyright (c) 2015, Damon Oehlman <damon.oehlman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
