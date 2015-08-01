var tar = require('tar');
var zlib = require('zlib');

module.exports = function() {
  // Create our tar packer
  var packer = tar.Pack({
    fromBase: true,
    noProprietary: true
  });

  // Create our gzip compressor
  var gzip = zlib.createGzip();

  // Set up our piped stream
  packer.pipe(gzip);

  // Modify pipe/unpipe to chain off of gzip output
  packer.pipe = function (dest) {
    return gzip.pipe(dest);
  };

  packer.unpipe = function (dest) {
    return gzip.unpipe(dest);
  };

  // Return our PackageStream object
  return packer;
};
