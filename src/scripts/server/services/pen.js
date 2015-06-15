import Service from '../lib/service';
import {PenFactory} from '../model/pen';

/** Pass input directly to jade gulp plugin */
module.exports = function(pen) {
  var rtn = new Service('pen', (data, conn, next) => {
    try {
      console.log("PEN request...");
      console.log(data);
      if ((data.request) && (data.request == 'new')) {
        // Add a new pen and return the id
      }
      else if ((data.request) && (data.request == 'list')) {
        // Return a list of all pen ids
      }
      else if ((data.request) && (data.request == 'delete')) {
        // Delete a single pen by id
      }
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
