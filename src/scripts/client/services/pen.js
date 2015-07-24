import * as task from '../lib/consts/pen';
import Service from '../lib/service.js';
import $ from 'jquery/dist/jquery';

/** Pen related client side services */
class Handler extends Service {

  /** Split the input into functions */
  handler(data, conn, next) {
    console.log("Incoming pen handler");
    console.log(data);
    switch (data.request) {
      case task.ENUMERATE:
        this.request_list();
        break;
      case task.NEW:
        this.select_new(data);
        break;
      case task.QUERY:
        this.update_list(data, conn);
        break;
    }
    next();
  }

  /** Update the list of pens in the menu */
  update_list(data, c) {
    var page = data.value.page + 1;
    var pages = data.value.pages > 0 ? data.value.pages : 1;
    var api = window['corner-menu']['pens_menu'];
    api.clear();
    api.push(`Page ${page}/${pages}`, '');
    for (var i = 0; i < data.value.page_size; ++i) {
      if (data.value.keys[i] == data.active) {
        api.push(`Pen ${data.value.keys[i]} (active)`, '');
      }
      else {
        api.push(`Pen ${data.value.keys[i]}`, `javascript: window.periscope.pen.select(${data.value.keys[i]});`);
      }
    }
    if (data.active == null) {
      window.periscope.pen.create();
    }
  }

  /** Select the new pen we just created */
  select_new(data) {
    console.log(data)
    window.periscope.pen.select(data.id);
  }

  /** Request a list of new records */
  request_list() {
    window.periscope.pen.list();
  }
}

export default function handler() {
  return new Handler('pen');
};
