var packageJson = require('./package.json');

module.exports = {
  read: require('./lib/reader.js'),
  package: require('./lib/packager.js'),
  version: 'node-zdf version ' + packageJson.version
};
