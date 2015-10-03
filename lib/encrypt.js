var kbpgp = require('kbpgp');

function encrypt(zdf, publicKey) {
  return new Promise((resolve, reject) => {
    kbpgp.KeyManager.import_from_armored_pgp({
      armored: publicKey
    }, (err, key) => {
      if (err) {
        reject(err);
      } else {
        kbpgp.box({
          msg: zdf,
          encrypt_for: key
        }, (err, resultString, resultBuffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(resultString);
          }
        });
      }
    });
  });
}

module.exports = encrypt;
