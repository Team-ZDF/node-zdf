"use strict";
var encrypt = require('./encrypt');
var stream = require('stream');

class EncryptFakeStream extends stream.Stream {
  constructor(publicKey, privateKey, privateKeyPassphrase) {
    super();

    this.readable = true;
    this.writable = true;

    this._chunks = [];
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.privateKeyPassphrase = privateKeyPassphrase;
  }

  write(chunk) {
    // Save the chunk, we need all of them to decrypt
    this._chunks.push(chunk);
  }

  end(chunk) {
    if (chunk) {
      this.write(chunk);
    }

    // Concatenate all the buffer chunks
    var encryptedData = Buffer.concat(this._chunks);

    // Decrypt the data
    var self = this;
    encrypt(encryptedData, this.publicKey, this.privateKey, this.privateKeyPassphrase).then((d) => {
      // Emit the decrypted data
      self.emit('data', d);
      self.emit('end');
    }).catch((e) => {
      // Emit the error
      self.emit('error', e);
    });
  }

  pause() {
    // noop
  }

  resume() {
    // noop
  }
}

module.exports = EncryptFakeStream;
