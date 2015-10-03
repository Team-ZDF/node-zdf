"use strict";
var stream = require('stream');
var tar = require('tar');
var zlib = require('zlib');

class PackageWriteStream extends stream.Stream {
  constructor() {
    super();

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

    // Listen for events on gzip. It is the output end needs to be emitted
    var self = this;
    this._gzip
      .on('data', (d) => self.emit('data', d))
      .on('end', () => self.emit('end'))
      .on('error', (e) => self.emit('error', e));
  }

  add(entry) {
    this._tar.add(entry);
  }

  end(entry) {
    if (!!entry) {
      this.add(entry);
    }

    this._tar.end();
  }
}

module.exports = PackageWriteStream;
