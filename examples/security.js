var fs = require('fs');
var fstream = require('fstream');
var path = require('path');
var zdf = require('../zdf');

var publicKey = fs.readFileSync(path.join(__dirname, 'public.pgp'));
//console.log('Public key', publicKey);
var privateKey = fs.readFileSync(path.join(__dirname, 'private.pgp'));
//console.log('Private key', privateKey);
var privateKeyPassphrase = 'passphrase';


// Write with Encryption
var sourceDirectory = path.join(__dirname, 'how-to-spy');
var inputStream = fstream.Reader({
  path: sourceDirectory,
  type: 'Directory'
});

var destinationStream = fs.createWriteStream(path.join(__dirname, 'secret.zdf'))
  .on('error', (err) => console.error('Destination error occurred: ', err))
  .on('finish', () => console.log('Write Complete'));

var zdfWriteStream = new zdf.PackageWriteStream({
  publicKey: publicKey,
  privateKey: privateKey,
  privateKeyPassphrase: privateKeyPassphrase
});
inputStream.pipe(zdfWriteStream)
  .on('error', (err) => console.error('ZDF error occurred: ', err))
  .pipe(destinationStream);


// Read with decrypt
var filename = path.join(__dirname, '/secret.zdf');
var inputStream = fs.createReadStream(filename);

var zdfReadStream = new zdf.PackageReadStream({
  privateKey: privateKey,
  privateKeyPassphrase: privateKeyPassphrase,
  publicKey: publicKey
}).on('error', (e) => {
  console.error(e);
});

inputStream.pipe(zdfReadStream).on('entry', (entry) => {
  // `entry` will be a file entry
  // use `entry.on('data', ...)`` to take advantage of file contents
  //console.log('entry', entry);
}).on('end', (zdfInfo) => {
  // `zdfInfo` will be an object with `files` as a hash of entries and
  // `manifest` as the ZDF manifest data
  console.log('zdfInfo', zdfInfo);
}).on('error', (e) => {
  console.error(e);
});
