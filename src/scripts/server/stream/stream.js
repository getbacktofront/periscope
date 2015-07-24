import q from 'Q';
import File from 'vinyl';
import {StringDecoder} from 'string_decoder';
import buffertools from 'buffertools';

/**
 * Return a safe callback handler.
 * @param x The function to invoke.
 * @param deferred The deferred to reject with on error.
 */
function safe(x, deferred) {
  return function() {
    try { x.apply(null, arguments); } catch(ex) {
      deferred.reject(ex);
    }
  };
};

/**
 * Invoke the callback after reading from the stream and converting the result to a string
 * @param stream A stream to read from.
 * @param deferred The deferred to resolve with.
 */
export function read_from_stream(stream, deferred) {
  var bufs = [];
  stream.on('error', function(err) {
    deferred.reject(err);
  });
  stream.on('readable', safe(function() {
    var read = stream.read();
    if (read) {
      if (read.contents) {
        bufs.push(read.contents);
      }
      else {
        bufs.push(read);
      }
    }
  }));
  stream.on('end', safe(function() {
    var all = buffertools.concat.apply(null, bufs);
    var decoder = new StringDecoder('utf8');
    var content = decoder.write(all);
    deferred.resolve(content);
  }));
}

/**
 * Run a string through a gulp plugin and return the results.
 * @param plugin The gulp plugin factory (ie. sass not sass())
 * @param filename The name of the file to emit at the end
 * @param raw The raw input string to process
 * @return A promise for an encoded string
 */
export function gulp(plugin, filename, raw) {
  var deferred = q.defer();

  // Create fake input file
  var file = new File({
    path: filename,
    cwd: './',
    base: './',
    contents: new Buffer(raw)
  });

  // Handle events on the stream before writing to it, because
  // some errors *may* not be async.
  var stream = plugin();
  read_from_stream(stream, deferred);

  stream.write(file);
  stream.end();

  return deferred.promise;
}
