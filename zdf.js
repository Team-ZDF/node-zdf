var packageJson = require('./package.json');
var security = require('./lib/security');

module.exports = {
  PackageStream: require('./lib/package-stream'),
  decrypt: security.decrypt,
  encrypt: security.encrypt,
  read: require('./lib/reader'),
  package: require('./lib/packager'),
  version: 'node-zdf version ' + packageJson.version
};
