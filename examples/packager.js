var fs = require('fs');
var fstream = require('fstream');
var path = require('path');
var zdf = require('../zdf');

var sourceDirectory = path.join(__dirname, 'how-to-spy');

var destinationStream = fs.createWriteStream(path.join(__dirname, 'how-to-spy.zdf'))
  .on('error', function(err) {
    console.error('Destination error occurred: ', err);
  })
  .on('finish', function() {
    console.log('Write Complete');
  });

zdf.package(sourceDirectory)
  .on('error', function(err) {
    console.error('ZDF error occurred: ', err);
  })
  .pipe(destinationStream);

// var packageStream = zdf.createPackageStream();
//
// fstream.Reader({
//     path: sourceDirectory,
//     type: 'Directory'
//   })
//   .pipe(packageStream)
//   .pipe(destinationStream);
