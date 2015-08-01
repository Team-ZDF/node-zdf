var kbpgp = require('kbpgp');
var fs = require('fs');
var path = require('path');

// See https://keybase.io/kbpgp/docs/generating_a_pair

kbpgp.KeyManager.generate_rsa({
  userid: 'ZDF User <zdf@example.com>'
}, function(err, alice) {
  if (!err) {
    // sign alice's subkeys
    alice.sign({}, function(err) {
      console.log(alice);
      // export demo; dump the private with a passphrase
      alice.export_pgp_private ({
        passphrase: 'passphrase'
      }, function(err, pgp_private) {
        console.log('private key: ', pgp_private);
        fs.writeFileSync(path.join(__dirname, 'private.pgp'), pgp_private);
      });
      alice.export_pgp_public({}, function(err, pgp_public) {
        console.log('public key: ', pgp_public);
        fs.writeFileSync(path.join(__dirname, 'public.pgp'), pgp_public);
      });
    });
  }
});
