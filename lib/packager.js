var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');

function onEnd() {
  console.log('ZDF Package Complete');
}

function onError(err) {
  console.error('An error occurred:', err);
}

var packer = tar.Pack({
    fromBase: true,
    noProprietary: true
  })
  .on('error', onError)
  .on('end', onEnd);

var zip = zlib.Gzip();

module.exports = function(contentFolder) {
  return fstream.Reader({
      path: contentFolder,
      type: 'Directory'
    })
    .on('error', onError)
    .pipe(packer)
    .pipe(zip);
};
