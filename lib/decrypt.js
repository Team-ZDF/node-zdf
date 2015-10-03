var kbpgp = require('kbpgp');

function decryptInner(zdf, privateKey) {
  return new Promise((resolve, reject) => {
    kbpgp.unbox({
      keyfetch: privateKey,
      armored: zdf
    }, (err, literals) => {
      if (err) {
        reject(err);
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
        resolve(literals[0].toBuffer());
      }
    });
  });
}

function decrypt(zdf, privateKey, passphrase) {
  return new Promise((resolve, reject) => {
    kbpgp.KeyManager.import_from_armored_pgp({
      armored: privateKey
    }, (err, key) => {
      if (err) {
        reject(err);
      } else {
        if (key.is_pgp_locked()) {
          key.unlock_pgp({
            passphrase: passphrase
          }, (err) => {
            if (err) {
              reject(err);
            } else {
              decryptInner(zdf, key).then(resolve).catch(reject);
            }
          });
        } else {
          decryptInner(zdf, key).then(resolve).catch(reject);
        }
      }
    });
  });
}

module.exports = decrypt;
