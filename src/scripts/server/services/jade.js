import {gulp} from '../stream/stream';
var Service = require('../lib/service.js');
var jade = require('gulp-jade');

/** Pass input directly to sass gulp plugin */
export default function service(pen) {
  var rtn = new Service('jade', (data, conn, next) => {
    var pen = conn.active;
    if (pen) {
      pen.html_src = data.raw;
      gulp(jade, 'source.jade', data.raw).then((content) => {
        pen.html = content;
        conn.write(JSON.stringify({
          path: 'task',
          target: data.target,
          value: content
        }));
        conn.write(JSON.stringify({
          path: 'periscope',
          value: pen.compile()
        }));
      }, (err) => {
        conn.write(JSON.stringify({
          path: 'task',
          target: data.target,
          value: err.message
        }));
      });
      console.log("updated pen");
      console.log(pen);
    }
    else {
      console.log("Jade request but no pen is active on this connection");
    }
    next();
  });
  rtn.pen = pen;
  return rtn;
}
