"use strict";
var EncryptStream = require('./encrypt-stream');
var stream = require('stream');
var tar = require('tar');
var zlib = require('zlib');

class PackageWriteStream extends stream.Stream {
  constructor(options) {
    super();
    var self = this;

    if (!options) {
      options = {};
    }
    this._options = options;

    // Make this a Readable/Writeable stream
    this.readable = true;
    this.writable = true;

    // Create our tar packer
    this._tar = tar.Pack({
      fromBase: true,
      noProprietary: true
    });

    // Create our gzip compressor
    this._gzip = zlib.createGzip();
    this._gzip.on('error', (e) => self.emit('error', e));

    // Pipe the tar and gzip streams
    this._tar.pipe(this._gzip);
    this._tar.on('error', (e) => self.emit('error', e));

    // Set input and output streams to keep code generic
    this._inputStream = this._tar;
    this._outputStream = this._gzip;

    // Optionally implement encryption
    if (options.publicKey || options.privateKey) {
      var encryptStream = new EncryptStream(options.publicKey, options.privateKey, options.privateKeyPassphrase);
      encryptStream.on('error', (e) => self.emit('error', e));
      this._outputStream.pipe(encryptStream);
      this._outputStream = encryptStream;
    }

    // Listen for events on gzip. It is the output end needs to be emitted
    this._outputStream
      .on('data', (d) => self.emit('data', d))
      .on('end', () => self.emit('end'));
  }

  add(entry) {
    this._inputStream.add(entry);
  }

  end(entry) {
    if (!!entry) {
      this.add(entry);
    }

    this._inputStream.end();
  }
}

module.exports = PackageWriteStream;
