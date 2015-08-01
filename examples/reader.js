var fs = require('fs');
var path = require('path');
var zdf = require('../zdf');

var filename = path.join(__dirname, '/how-to-spy.zdf');
console.log(filename);
var stream = fs.createReadStream(filename);

zdf.read(stream, function(zdfInfo) {
  console.log(zdfInfo);
});
