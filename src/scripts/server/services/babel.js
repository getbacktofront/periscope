import {gulp} from '../stream/stream';
import Service from '../lib/service';
import browserify from 'gulp-browserify';
import babel from 'gulp-babel';

/** Pass input directly to sass gulp plugin */
export default function service(pen) {
  var rtn = new Service('babel', (data, conn, next) => {
    gulp(babel, 'source.js', data.raw).then((content) => {
      gulp(browserify, 'source.js', content).then((content) => {
        pen.js = content;
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
    }, (err) => {
      conn.write(JSON.stringify({
        path: 'task',
        target: data.target,
        value: err.message
      }));
    });
    next();
  });
  rtn.pen = pen;
  return rtn;
}
