"use strict";
var decryptAndVerify = require('./decrypt');
var stream = require('stream');

class DecryptFakeStream extends stream.Stream {
  constructor(privateKey, passphrase, publicKey) {
    super();

    this.readable = true;
    this.writable = true;

    this._chunks = [];
    this.privateKey = privateKey;
    this.passphrase = passphrase;
    this.publicKey = publicKey;
  }

  write(chunk) {
    // Save the chunk, we need all of them to decrypt
    this._chunks.push(chunk);
  }

  end(chunk) {
    if (!!chunk) {
      this.write(chunk);
    }

    // Concatenate all the buffer chunks
    var encryptedData = Buffer.concat(this._chunks);

    // Decrypt the data
    var self = this;
    decryptAndVerify(encryptedData, this.privateKey, this.passphrase, this.publicKey).then((d) => {
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

module.exports = DecryptFakeStream;
