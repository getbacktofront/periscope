import * as task from '../lib/consts/pen';
import Service from '../lib/service';
import {Pens} from '../model/pen';

/** Pen related client side services */
class Handler extends Service {

  /** Split the input into functions */
  handler(data, conn, next) {
    this.init_handler(conn);
    try {
      switch (data.request) {
        case task.NEW:
          this.create_pen(data, conn);
          break;
        case task.DELETE:
          this.delete_pen(data, conn);
          break;
        case task.QUERY:
          this.list_pens(data, conn);
          break;
        case task.SELECT:
          this.select_pen(data, conn);
          break;
      }
    }
    catch(err) {
      console.log(err);
    }
    next();
  }

  /** Init handler if not ready~ */
  init_handler(c) {
    if (!c.init) {
      c.active = null;
      c.pens = new Pens();
      c.init = true;
      console.log("Init service");
    }
  }

  /// Select a specific pen as the current pen
  select_pen(data, c) {
    console.log("finding...");
    c.pens.find({id: data.target}).then((value) => {
      try {
        console.log("SELECT");
        c.active = value;
        try {
          console.log("publish");
          c.active.publish(c, ['html_src', 'js_src', 'css_src', 'html', 'css', 'js', 'periscope']);
          console.log("enumerate");
          c.write(JSON.stringify({
            path: 'pen',
            request: task.ENUMERATE,
          }));;
          console.log("done");
        }
        catch(err) {
          console.log(err);
        }
      }
      catch(err) {
        console.log(err);
      }
    }, () => {
      console.log("No match for record with id: " + data.target)
    });
  }

  // Return a list of all pen ids
  list_pens(data, c) {
    console.log(c.pens);
    console.log("listing...");
    c.pens.index('key').page(0, 100).then((value) => {
      console.log(value);
      c.write(JSON.stringify({
        path: 'pen',
        request: task.QUERY,
        value: value,
        active: c.active ? c.active.id : null
      }));
    });
  }

  // Add a new pen and return the id
  create_pen(data, c) {
    console.log(data);
    console.log(c.pens);
    c.pens.insert().then((instance) => {
      c.write(JSON.stringify({
        path: 'pen',
        request: task.NEW,
        id: instance.id
      }));
      c.write(JSON.stringify({
        path: 'pen',
        request: task.ENUMERATE
      }));
      if (c.active == null) {
        c.active = instance;
      }
    }, (err) => {
      console.log(err);
    });
  }

  /// Delete a pen by id
  delete_pen(data, c) {
    console.log("delete...");
    c.write(JSON.stringify({
      path: 'pen',
      request: task.DELETE
    }));
    console.log("Good");
  }
}

export default function handler() {
  return new Handler('pen');
};
