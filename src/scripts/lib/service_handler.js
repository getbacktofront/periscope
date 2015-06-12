import q from 'q';

/** A common base for service handlers */
export default class ServiceHandler {

  /** Create a constructor */
  constructor() {
    this.bindings = [];
  }

  /**
   * Bind a service to this handler
   * @param service The Service instance to bind.
   */
  bind(service) {
    this.bindings.push(service);
  }

  /**
   * Handle some data object
   * @param data Any object with a 'path' property.
   * @param conn The connection object, whatever type.
   */
  handle(data, conn) {
    var promises = [];
    for (var i = 0; i < this.bindings.length; ++i) {
      var p = this.bindings[i].handle(data, conn);
      promises.push(p);
    }
    return q.all(promises);
  }
}
