var fs = require('fs');
var path = require('path');
var zdf = require('../zdf');

var doc = fs.readFileSync(path.join(__dirname, 'how-to-spy.zdf'));
console.log('Document', doc);
var publicKey = fs.readFileSync(path.join(__dirname, 'public.pgp'));
console.log('Public key', publicKey);
var privateKey = fs.readFileSync(path.join(__dirname, 'private.pgp'));
console.log('Private key', privateKey);
var privateKeyPassphrase = 'passphrase';

console.log('Encryption start');
zdf.encrypt(doc, publicKey, function(err, secret) {
  if (err) {
    console.error(err);
  } else {
    fs.writeFileSync(path.join(__dirname, 'secret.zdf'), secret);
    console.log('Encryption complete');

    console.log('Decryption start');
    zdf.decrypt(secret, privateKey, privateKeyPassphrase, function(err, data) {
      if (err) {
        console.error(err);
      } else {
        fs.writeFileSync(path.join(__dirname, 'decrypted.zdf'), data);
        console.log('Decryption complete');
      }
    });
  }
});
