/**
 * import(s)
 */

var expect = require('expect.js');
var format = require('util').format;
var zmq = require('zmq');
var parser = require('socket.io-parser');
var msgpack = require('msgpack-js');
var Emitter = require('../');


/**
 * test(s)
 */

describe('socket.io-zeromq-emitter', function () {
  var address = 'tcp://127.0.0.1:5555';
  var server = zmq.socket('sub');
  server.subscribe('');

  beforeEach(function (done) {
    server.bind(address, done);
  });

  afterEach(function (done) {
    server.unbind(address, done);
  });

  it('should be emit', function (done) {
    var emitter = Emitter();
    var args = ['hello', 'world'];

    server.on('message', function (msg) {
      var getOffset = function (msg) {
        var offset = 0;
        for (var i = 0; i < msg.length; i++) {
          if (msg[i] === 0x20) { // space
            offset = i;
            break;
          }
        }
        return offset;
      };
      var offset = getOffset(msg);

      var key = msg.slice(0, offset);
      var payload = msgpack.decode(msg.slice(offset + 1, msg.length));
      var data = payload[0];
      expect(key).to.match(/^socket\.io\-zmq#emitter\-.*$/);
      expect(payload).to.be.an(Array);
      expect(data.data[0]).to.contain('hello');
      expect(data.data[1]).to.contain('world');
      expect(data.nsp).to.eql('/');

      done();
    });

    // emit !!
    setTimeout(function () {
      emitter.emit(args[0], args[1]);
    }, 5);
  });
});
