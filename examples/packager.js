var fs = require('fs');
var zdf = require('../zdf.js');

var directory = __dirname + '/how-to-spy/';
console.log(directory);
var destination = fs.createWriteStream(__dirname + '/how-to-spy.zdf');

zdf.package(directory).pipe(destination);
