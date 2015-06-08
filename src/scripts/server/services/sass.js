var Service = require('../lib/service.js');
var sass = require('gulp-sass-native');
var File = require('vinyl');
var StringDecoder = require('string_decoder').StringDecoder;

module.exports = function() {
  return new Service('sass', (data, conn, next) => {
    try {
      console.log("SASS request...");
      console.log(data.raw);
      var file = new File({
        path: 'source.scss',
        cwd: 'fake/',
        base: 'fake/',
        contents: new Buffer(data.raw)
      });

      var stream = sass();
      stream.on('error', function(err) {
        console.log("Sass error");
        conn.write(JSON.stringify({
          path: 'task',
          value: err.message
        }));
      });
      var bufs = [];
      stream.on('readable', function() {
        var read = stream.read();
        if (read) {
          bufs.push(read.contents);
        }
      });
      stream.on('end', function() {
        console.log("Ended stream...");
        var all = Buffer.concat(bufs);
        var decoder = new StringDecoder('utf8');
        var content = decoder.write(all).trim();
        console.log(content);
        conn.write(JSON.stringify({
          path: 'task',
          value: content
        }));
      });

      stream.write(file);
      stream.end();
    }
    catch(err) {
      console.log("Failed on stream write");
      console.log(err);
    }
    next();
  });
};
