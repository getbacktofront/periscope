import Service from '../lib/service';
import PenFactory from '../model/pen';

/** Pass input directly to jade gulp plugin */
module.exports = function(pen) {
  var rtn = new Service('pen', (data, conn, next) => {
    try {
      console.log("PEN request...");
      console.log(data.raw);
    }
    catch(err) {
      console.log("Failed");
      console.log(err);
    }
    next();
  });
  rtn.pen = pen;
  return rtn;
};
