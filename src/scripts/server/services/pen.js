import * as task from '../lib/consts/pen';
import Service from '../lib/service';
import {Pens} from '../model/pen';

/** Pass input directly to jade gulp plugin */
module.exports = function(pen) {
  var rtn = new Service('pen', (data, conn, next) => {

    /// DB connection
    var pens = new Pens();

    try {
      console.log(data);

      /// List all the pens
      if (data.request == task.QUERY) {
        // Return a list of all pen ids
        console.log("listing...");
        conn.write(JSON.stringify({
          path: 'pen',
          request: task.QUERY,
          value: [1,2,3,4]
        }));
      }

      /// Create a new pen
      else if (data.request == task.NEW) {
        // Add a new pen and return the id
        console.log("new...");
        pens.insert().then((instance) => {
          console.log("Good");
          console.log(instance);
          conn.write(JSON.stringify({
            path: 'pen',
            request: task.NEW
          }));
        });
      }

      /// Delete a pen by id
      else if (data.request == task.DELETE) {
        console.log("delete...");
        conn.write(JSON.stringify({
          path: 'pen',
          request: task.DELETE
        }));
        console.log("Good");
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
