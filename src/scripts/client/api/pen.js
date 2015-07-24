import * as task from '../lib/consts/pen';

/** Public api for pens */
class PenApi {

  /**
   * The pen listing api stuff
   * @param connection To the connection to stream content through.
   */
  constructor(connection) {
    this.connection = connection;
  }

  /** Add a new pen */
  create() {
    this.connection.socket.send(JSON.stringify({
      path: 'pen',
      request: task.NEW
    }));
  }

  /** Select a new pen */
  select(id) {
    this.connection.socket.send(JSON.stringify({
      path: 'pen',
      request: task.SELECT,
      target: id
    }));
  }

  /**
   * Delete a pen
   * @param id The id of the pen to delete
   */
  delete(id) {
    this.connection.socket.send(JSON.stringify({
      path: 'pen',
      request: task.DELETE,
      id: id
    }));
  }

  /** Update the list of know pens */
  list() {
    this.connection.socket.send(JSON.stringify({
      path: 'pen',
      request: task.QUERY
    }));
  }
}

// Publish
export default function factory(connection) {
  if (!window.periscope) { window.periscope = {}; }
  window.periscope.pen = new PenApi(connection);
  return { name: 'Pen' };
}
