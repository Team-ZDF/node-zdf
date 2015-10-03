var fs = require('fs');
var path = require('path');
var zdf = require('../zdf');

// Option 1 - using `PackageReadStream` directly
var filename = path.join(__dirname, '/how-to-spy.zdf');
var inputStream = fs.createReadStream(filename);
var zdfReadStream = new zdf.PackageReadStream();
inputStream.pipe(zdfReadStream); // This returns `zdfReadStream` so you can chain it

// Option 2 - using file path as source
// var filename = path.join(__dirname, '/how-to-spy.zdf');
// var zdfReadStream = zdf.read(filename);

// Option 3 - using stream as source
// var filename = path.join(__dirname, '/how-to-spy.zdf');
// var inputStream = fs.createReadStream(filename);
// var zdfReadStream = zdf.read(inputStream);

// Option 4 - using options hash
// var filename = path.join(__dirname, '/how-to-spy.zdf');
// var inputStream = fs.createReadStream(filename);
// var zdfReadStream = zdf.read({
//   source: inputStream
// });

zdfReadStream.on('entry', (entry) => {
  // `entry` will be a file entry
  // use `entry.on('data', ...)`` to take advantage of file contents
  console.log('entry', entry);
}).on('end', (zdfInfo) => {
  // `zdfInfo` will be an object with `files` as a hash of entries and
  // `manifest` as the ZDF manifest data
  console.log('zdfInfo', zdfInfo);
});
