"use strict";
var stream = require('stream');
var tar = require('tar');
var zlib = require('zlib');

class ZdfInfo {
  constructor() {
    this.files = {};
    this.manifest = {};
  }
}

class PackageReadStream extends stream.Stream {
  constructor(options) {
    super();

    if (!options) {
      options = {};
    }
    this._options = options;

    this._zdfInfo = new ZdfInfo();

    // Create our tar parser
    this._tar = tar.Parse();

    // Create our gzip decompressor
    this._gzip = zlib.Gunzip();

    // Pipe the gzip and tar streams
    this._gzip.pipe(this._tar);

    // Listen for events on tar. It is the output end needs to be emitted
    var self = this;
    this._tar
      .on('error', (e) => self.emit('error', e))

      // A file entry in the package
      .on('entry', (e) => {
        // If the file is the manifest, read and parse it
        if (e.props.path === 'manifest.json') {
          e.on('data', (c) => {
            self._zdfInfo.manifest = JSON.parse(c.toString());
          });
        } else {
          // Add other files to the files hash with their entry instance
          // Emit entry so implementation can decide how to read the individual files
          self._zdfInfo.files[e.props.path] = e;
          self.emit('entry', e);
        }
      })

      // On end, emit the resulting ZDF object
      .on('end', () => self.emit('end', self._zdfInfo))

      // Not sure if we need these or not yet...
      .on('extendedHeader', (e) => {
        console.error('extended pax header', e.props);
        e.on('end', () => {
          console.error('extended pax fields:', e.fields);
        });
      })
      .on('ignoredEntry', (e) => {
        console.error('ignoredEntry?!?', e.props);
      })
      .on('longLinkpath', (e) => {
        console.error('longLinkpath entry', e.props);
        e.on('end', () => {
          console.error('value=%j', e.body.toString());
        });
      })
      .on('longPath', (e) => {
        console.error('longPath entry', e.props);
        e.on('end', () => {
          console.error('value=%j', e.body.toString());
        });
      });
  }

  write(chunk) {
    this._gzip.write(chunk);
  }

  end(chunk) {
    if (!!chunk) {
      this.write(chunk);
    }
    this._gzip.end();
  }

}

module.exports = PackageReadStream;
