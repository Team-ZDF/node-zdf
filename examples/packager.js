var fs = require('fs');
var fstream = require('fstream');
var path = require('path');
var zdf = require('../zdf');

var sourceDirectory = path.join(__dirname, 'how-to-spy');

// Option 1 - using `PackageWriteStream` directly
var zdfWriteStream = new zdf.PackageWriteStream();
var inputStream = fstream.Reader({
  path: sourceDirectory,
  type: 'Directory'
});
inputStream.pipe(zdfWriteStream); // This returns `zdfWriteStream` so you can chain it

// Option 2 - using file path as source
// var zdfWriteStream = zdf.package(sourceDirectory);

// Option 3 - using stream as source
// var inputStream = fstream.Reader({
//   path: sourceDirectory,
//   type: 'Directory'
// });
// var zdfWriteStream = zdf.package(inputStream);

// Option 4 - using options hash
// var inputStream = fstream.Reader({
//   path: sourceDirectory,
//   type: 'Directory'
// });
// var zdfWriteStream = zdf.package({
//   source: inputStream
// });

var destinationStream = fs.createWriteStream(path.join(__dirname, 'how-to-spy.zdf'))
  .on('error', (err) => console.error('Destination error occurred: ', err))
  .on('finish', () => console.log('Write Complete'));

zdfWriteStream
  .on('error', (err) => console.error('ZDF error occurred: ', err))
  .pipe(destinationStream);
