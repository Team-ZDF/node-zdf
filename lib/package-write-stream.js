"use strict";
var EncryptStream = require('./encrypt-stream');
var stream = require('stream');
var tar = require('tar');
var zlib = require('zlib');

class PackageWriteStream extends stream.Stream {
  constructor(options) {
    super();

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

    // Pipe the tar and gzip streams
    this._tar.pipe(this._gzip);

    // Set input and output streams to keep code generic
    this._inputStream = this._tar;
    this._outputStream = this._gzip;

    // Optionally implement encryption
    if (options.publicKey || options.privateKey) {
      var encryptStream = new EncryptStream(options.publicKey, options.privateKey, options.privateKeyPassphrase);
      this._outputStream.pipe(encryptStream);
      this._outputStream = encryptStream;
    }

    // Listen for events on gzip. It is the output end needs to be emitted
    var self = this;
    this._outputStream
      .on('data', (d) => self.emit('data', d))
      .on('end', () => self.emit('end'))
      .on('error', (e) => self.emit('error', e));
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
