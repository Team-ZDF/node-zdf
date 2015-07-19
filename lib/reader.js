var tar = require('tar');
var zlib = require('zlib');

function onEnd() {
  console.log('ZDF Package Complete');
}

function onError(err) {
  console.error('An error occurred:', err);
}

var parser = tar.Parse();
var unzip = zlib.Gunzip();

module.exports = function(stream, successCallback) {
  var zdfInfo = {
    files: {}
  };
  stream
    .pipe(unzip)
    .pipe(parser)

    // .on('extendedHeader', function (e) {
    //   console.error('extended pax header', e.props);
    //   e.on('end', function () {
    //     console.error('extended pax fields:', e.fields);
    //   });
    // })
    // .on('ignoredEntry', function (e) {
    //   console.error('ignoredEntry?!?', e.props);
    // })
    // .on('longLinkpath', function (e) {
    //   console.error('longLinkpath entry', e.props);
    //   e.on('end', function () {
    //     console.error('value=%j', e.body.toString());
    //   });
    // })
    // .on('longPath', function (e) {
    //   console.error('longPath entry', e.props);
    //   e.on('end', function () {
    //     console.error('value=%j', e.body.toString());
    //   });
    // })

    .on('entry', function (e) {
      if (e.props.path === 'manifest.json') {
        e.on('data', function (c) {
          zdfInfo.manifest = JSON.parse(c.toString());
        });
      } else {
        e.on('data', function (c) {
          zdfInfo.files[e.props.path] = c;
        });
      }
    })
    .on('end', function() {
      successCallback(zdfInfo);
    });
};
