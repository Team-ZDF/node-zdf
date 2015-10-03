"use strict";
var fs = require('fs');
var PackageReadStream = require('./package-read-stream');

module.exports = (options) => {
  var addErrorBubblingToSource = false;
  if (!options) {
    throw new Error('source ZDF file is required');
  }

  if (typeof options === 'string' || options instanceof fs.ReadStream) {
    // Create the options object, the next catch will handle the stream
    options = {
      source: options
    };
  }

  if (typeof options.source === 'string') {
    // Create the fstream reader for the directory
    options.source = fs.createReadStream(options.source);
    addErrorBubblingToSource = true;
  }

  // Check that source is type of fstream.Reader
  if (!(options.source instanceof fs.ReadStream)) {
    throw new Error('source must be of type fs.ReadStream');
  }

  // Create our ZDF reader
  var unpackager = new PackageReadStream();

  // Pipe input stream to unpackager
  var s = options.source.pipe(unpackager);

  // Add error bubbling
  function bubbleError(err) {
    s.emit('error', err);
  }

  if (addErrorBubblingToSource) {
    options.source.on('error', bubbleError);
  }
  unpackager.on('error', bubbleError);

  // Return our stream to pipe to an output
  return s;
};
