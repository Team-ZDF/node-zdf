var KeyManager = require('./key-manager');
var kbpgp = require('kbpgp');

function decryptAndVerify(zdf, privateKey, privateKeyPassphrase, publicKey) {
  return new Promise((resolve, reject) => {
    var privateKeyPromise = privateKey ?
      KeyManager.importPrivateKey(privateKey, privateKeyPassphrase) : Promise.resolve();

    var publicKeyPromise = publicKey ?
      KeyManager.importPublicKey(publicKey) : Promise.resolve();

    Promise.all([privateKeyPromise, publicKeyPromise]).then((keys) => {
      kbpgp.unbox({
        keyfetch: keys[0],
        armored: zdf
      }, (err, literals) => {
        if (err) {
          reject(err);
        } else {
          var ds = literals[0].get_data_signer();
          if (ds && keys[1]) {
            // Verify that the PGP fingerprints match
            var knownFingerprint = keys[1].get_pgp_fingerprint().toString('hex');
            var fingerprint = ds.get_key_manager().get_pgp_fingerprint().toString('hex');
            if (fingerprint !== knownFingerprint) {
              reject('Failed verification');
            }
          }
          resolve(literals[0].toBuffer());
        }
      });
    }).catch(reject);
  });
}

module.exports = decryptAndVerify;
