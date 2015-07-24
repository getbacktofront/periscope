import * as task from '../lib/consts/pen';
import Service from '../lib/service.js';
import $ from 'jquery/dist/jquery';

/** Publish the output string to the given target */
export default function handler() {
  return new Service('pen', (data, c, next) => {
    if ((data.request == task.NEW) || (data.request == task.DELETE)) {
      console.log("TRANSACTION");
      window.periscope.pen.list();
    }
    else if (data.request == task.QUERY) {
      console.log("LIST");
      console.log(data);
    }
    next();
  });
};
