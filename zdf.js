var packageJson = require('./package.json');

module.exports = {
  PackageWriteStream: require('./lib/package-write-stream'),
  PackageReadStream: require('./lib/package-read-stream'),
  read: require('./lib/reader'),
  package: require('./lib/packager'),
  version: 'node-zdf version ' + packageJson.version
};
