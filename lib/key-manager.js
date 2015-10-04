var errors = require('./errors');
var kbpgp = require('kbpgp');

function importPrivateKey(privateKey, passphrase) {
  return new Promise((resolve, reject) => {
    kbpgp.KeyManager.import_from_armored_pgp({
      armored: privateKey
    }, (err, key) => {
      if (err) {
        reject(new errors.KeyManagerError(err));
      } else {
        if (key.is_pgp_locked()) {
          key.unlock_pgp({
            passphrase: passphrase
          }, (err) => {
            if (err) {
              reject(new errors.KeyManagerError(err));
            } else {
              resolve(key);
            }
          });
        } else {
          resolve(key);
        }
      }
    });
  });
}

function importPublicKey(publicKey) {
  return new Promise((resolve, reject) => {
    kbpgp.KeyManager.import_from_armored_pgp({
      armored: publicKey
    }, (err, key) => {
      if (err) {
        reject(new errors.KeyManagerError(err));
      } else {
        resolve(key);
      }
    });
  });
}

module.exports = {
  importPrivateKey: importPrivateKey,
  importPublicKey: importPublicKey
};
