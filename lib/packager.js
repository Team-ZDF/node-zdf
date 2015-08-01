var fstream = require('fstream');
var PackageStream = require('./package-stream');
var tar = require('tar');
var util = require('util');
var zlib = require('zlib');

module.exports = function(options) {
  var addErrorBubblingToSource = false;
  if (!options) {
    throw new Error('source directory is required');
  }

  if (typeof options === 'string') {
    // Create the options object, the next catch will handle the stream
    options = {
      source: options
    };
  }

  if (typeof options.source === 'string') {
    // Create the fstream reader for the directory
    options.source = fstream.Reader({
      path: options.source,
      type: 'Directory'
    });
    addErrorBubblingToSource = true;
  }

  // Check that source is type of fstream.Reader
  if (!(options.source instanceof fstream.Reader)) {
    throw new Error('source must be of type fstream.Reader');
  }

  // Create our ZDF packager
  var packager = new PackageStream();

  // Pipe input stream to packager
  var s = options.source.pipe(packager);

  // Add error bubbling
  function bubbleError(err) {
    s.emit('error', err);
  }

  if (addErrorBubblingToSource) {
    options.source.on('error', bubbleError);
  }
  packager.on('error', bubbleError);

  // Return our stream to pipe to an output
  return s;
};
