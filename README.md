# socket.io-zeromq-emitter

[![NPM version](https://badge.fury.io/js/socket.io-zeromq-emitter.svg)](http://badge.fury.io/js/socket.io-zeromq-emitter)
[![Build Status](https://travis-ci.org/kazupon/socket.io-zeromq-emitter.svg?branch=master)](https://travis-ci.org/kazupon/socket.io-zeromq-emitter)
[![Coverage Status](https://img.shields.io/coveralls/kazupon/socket.io-zeromq-emitter.svg)](https://coveralls.io/r/kazupon/socket.io-zeromq-emitter)
[![Dependency Status](https://david-dm.org/kazupon/socket.io-zeromq-emitter.svg)](https://david-dm.org/kazupon/socket.io-zeromq-emitter)

socket.io emitter [zeromq](http://zeromq.org) implementation.


# Installing

```shell
$ npm install socket.io-zeromq-emitter
```

zeromq version required >= 4.0.4


# Usage

```js
var emitter = require('socket.io-zeromq-emitter')();
setInterval(function () {
  emitter.emit('time', new Date);
}, 1000);
```


# API

`socket.io-zeromq-emitter` API is virtually the same as [socket.io-emitter](https://github.com/automattic/socket.io-emitter#api).

## Emitter(opts)

The following options are allowed:

- key: the name of the key to pub/sub events on as prefix (socket.io-zmq)
- host: host to connect to socket.io-zeromq-server on (127.0.0.1)
- port: port to connect to socket.io-zeromq-server on (5555)


# Testing

```shell
$ make test
```


# TODO
more test !!


# License

[MIT license](http://www.opensource.org/licenses/mit-license.php).

See the `LICENSE`.
