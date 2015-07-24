import {gulp} from '../stream/stream';
import Service from '../lib/service';
import sass from 'gulp-sass-native';

/** Pass input directly to sass gulp plugin */
export default function service(pen) {
  var rtn = new Service('sass', (data, conn, next) => {
    gulp(sass, 'source.scss', data.raw).then((content) => {
      pen.css = content;
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
    next();
  });
  rtn.pen = pen;
  return rtn;
}
