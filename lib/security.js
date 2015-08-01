var kbpgp = require('kbpgp');
var fs = require('fs');
var path = require('path');

function decryptInner(zdf, privateKey, callback) {
  kbpgp.unbox({
    keyfetch: privateKey,
    armored: zdf
  }, function(err, literals) {
    if (err) {
      callback(err);
    } else {
      // var km = null;
      // var ds = literals[0].get_data_signer();
      // if (ds) {
      //   km = ds.get_key_manager();
      //   if (km) {
      //     console.log("Signed by PGP fingerprint");
      //     console.log(km.get_pgp_fingerprint().toString('hex'));
      //   }
      // }
      callback(null, literals[0].toBuffer());
    }
  });
}

function decrypt(zdf, privateKey, passphrase, callback) {
  kbpgp.KeyManager.import_from_armored_pgp({
    armored: privateKey
  }, function(err, key) {
    if (err) {
      callback(err);
    } else {
      if (key.is_pgp_locked()) {
        key.unlock_pgp({
          passphrase: passphrase
        }, function(err) {
          if (err) {
            callback(err);
          } else {
            decryptInner(zdf, key, callback);
          }
        });
      } else {
        decryptInner(zdf, key, callback);
      }
    }
  });
}

function encrypt(zdf, publicKey, callback) {
  kbpgp.KeyManager.import_from_armored_pgp({
    armored: publicKey
  }, function(err, key) {
    kbpgp.box({
      msg: zdf,
      encrypt_for: key
    }, function(err, resultString, resultBuffer) {
      if (err) {
        callback(err);
      } else {
        callback(null, resultString);
      }
    });
  });
}

module.exports = {
  decrypt: decrypt,
  encrypt: encrypt
};
