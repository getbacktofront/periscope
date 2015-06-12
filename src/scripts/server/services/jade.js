var Service = require('../lib/service.js');
var jade = require('gulp-jade');
var File = require('vinyl');
var StringDecoder = require('string_decoder').StringDecoder;

/** Pass input directly to jade gulp plugin */
module.exports = function() {
  return new Service('jade', (data, conn, next) => {
    try {
      console.log("JADE request...");
      console.log(data.raw);
      var file = new File({
        path: 'source.scss',
        cwd: 'fake/',
        base: 'fake/',
        contents: new Buffer(data.raw)
      });

      var stream = jade();
      stream.on('error', function(err) {
        console.log("Jade error");
        conn.write(JSON.stringify({
          path: 'task',
          target: data.target,
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
          target: data.target,
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