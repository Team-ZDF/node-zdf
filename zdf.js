var packageJson = require('./package.json');

module.exports = {
  createPackageStream: require('./lib/package-stream.js'),
  read: require('./lib/reader.js'),
  package: require('./lib/packager.js'),
  version: 'node-zdf version ' + packageJson.version
};
