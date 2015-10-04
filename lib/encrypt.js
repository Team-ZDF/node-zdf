var kbpgp = require('kbpgp');
var KeyManager = require('./key-manager');

function encryptAndSign(zdf, publicKey, privateKey, privateKeyPassphrase) {
  return new Promise((resolve, reject) => {
    var publicKeyPromise = publicKey ?
      KeyManager.importPublicKey(publicKey) : Promise.resolve();

    var privateKeyPromise = privateKey ?
      KeyManager.importPrivateKey(privateKey, privateKeyPassphrase) : Promise.resolve();

    Promise.all([publicKeyPromise, privateKeyPromise]).then((keys) => {
      kbpgp.box({
        msg: zdf,
        encrypt_for: keys[0],
        sign_with: keys[1]
      }, (err, resultString, resultBuffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(resultString);
        }
      });
    }).catch(reject);
  });
}

module.exports = encryptAndSign;
