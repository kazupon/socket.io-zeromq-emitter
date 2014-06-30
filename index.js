/**
 * import(s)
 */

var debug = require('debug')('socket.io-zeromq-emitter');
var format = require('util').format;
var uid2 = require('uid2');
var parser = require('socket.io-parser');
var hasBin = require('has-binary-data');
var msgpack = require('msgpack-js');
var zmq = require('zmq');


/**
 * export(s)
 */

module.exports = Emitter;

var flags = [
  'json',
  'volatile',
  'broadcast'
];

function Emitter (opts) {
  if (!(this instanceof Emitter)) return new Emitter(opts);

  opts = opts || {};
  opts.port = opts.port || 5555;
  opts.host = opts.host || '127.0.0.1';
  opts.key = opts.key || 'socket.io-zmq';

  this.key = format('%s#emitter-%s', opts.key, uid2(6));

  this.client = zmq.socket('pub');
  this.client.identity = this.key;
  this.client.connect(format('tcp://%s:%s', opts.host, opts.port));
  
  this._rooms = {};
  this._flags = {};
}

flags.forEach(function (flag) {
  Emitter.prototype.__defineGetter__(flag, function () {
    debug('flag %s on', flag);
    this._flags[flag] = true;
    return this;
  });
});

Emitter.prototype.in =
Emitter.prototype.to = function (room) {
  if (!~this._rooms.indexOf(room)) {
    debug('room %s', room);
    this._rooms.push(room);
  }
  return this;
};

Emitter.prototype.of = function (nsp) {
  debug('nsp set to %s', nsp);
  this._flags.nsp = nsp;
  return this;
};

Emitter.prototype.emit = function () {
  // packet
  var args = Array.prototype.slice.call(arguments);
  var packet = {};
  packet.type = hasBin(args) ? parser.BINARY_EVENT : parser.EVENT;
  packet.data = args;
  // set namespace to packet
  if (this._flags.nsp) {
    packet.nsp = this._flags.nsp;
    delete this._flags.nsp;
  } else {
    packet.nsp = '/';
  }

  // publish
  var key = new Buffer(format('%s ', this.key), 'binary');
  var payload = msgpack.encode([packet, {
    rooms: this._rooms,
    flags: this._flags
  }]);
  var data = Buffer.concat([key, payload]);
  debug('send data length: key = %d, payload = %d, data = %d', key.length, payload.length, data.length);
  this.client.send(data);

  // reset state
  this._rooms = [];
  this._flags = {};

  return this;
};
