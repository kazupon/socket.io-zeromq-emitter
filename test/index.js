/**
 * import(s)
 */

var expect = require('expect.js');
var format = require('util').format;
var zmqEmitter = require('../');


/**
 * test(s)
 */

describe('socket.io-zeromq-emitter', function () {
  it('should be ok', function (done) {
    expect(zmqEmitter()).to.be.ok;
    done();
  });
});
