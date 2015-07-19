var fs = require('fs');
var zdf = require('../zdf.js');

var filename = __dirname + '/how-to-spy.zdf';
console.log(filename);
var stream = fs.createReadStream(filename);

zdf.read(stream, function(zdfInfo) {
  console.log(zdfInfo);
});
